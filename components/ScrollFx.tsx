"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP/ScrollTrigger controller. Wires:
 *  - .reveal-up      → fade + rise as they enter
 *  - [data-parallax] → depth drift tied to scroll (value = strength)
 *  - [data-scene]    → cinematic scale/opacity settle on entry
 *  - [data-draw]     → line that draws itself as you scroll (scaleY 0→1)
 *  - #hero-media / #hero-title → scroll-out cinematography (zoom + drift + fade)
 *
 * Sections below the fold are lazy-loaded (next/dynamic) and mount AFTER this
 * component, so a one-time querySelectorAll misses them entirely. A
 * MutationObserver re-binds effects for every element that appears later —
 * each element is bound exactly once via WeakSet.
 *
 * Respects prefers-reduced-motion.
 */
export default function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const show = () =>
        document
          .querySelectorAll(".reveal-up")
          .forEach((el) => el.classList.add("is-in"));
      show();
      const mo = new MutationObserver(show);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    gsap.registerPlugin(ScrollTrigger);
    const bound = new WeakSet<Element>();

    const bind = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".reveal-up").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => el.classList.add("is-in"),
          once: true,
        });
      });

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        const strength = parseFloat(el.dataset.parallax || "0.2");
        gsap.fromTo(
          el,
          { yPercent: strength * 60 },
          {
            yPercent: -strength * 60,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      root.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        gsap.fromTo(
          el,
          { scale: 1.14, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 35%",
              scrub: true,
            },
          }
        );
      });

      root.querySelectorAll<HTMLElement>("[data-draw]").forEach((el) => {
        if (bound.has(el)) return;
        bound.add(el);
        gsap.fromTo(
          el,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top 75%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      });

      // Hero scroll-out cinematography — bound once when hero exists.
      const heroMedia = root.querySelector<HTMLElement>("#hero-media");
      const heroTitle = root.querySelector<HTMLElement>("#hero-title");
      if (heroMedia && !bound.has(heroMedia)) {
        bound.add(heroMedia);
        gsap.to(heroMedia, {
          scale: 1.18,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (heroTitle && !bound.has(heroTitle)) {
        bound.add(heroTitle);
        gsap.to(heroTitle, {
          yPercent: -45,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "70% top",
            scrub: true,
          },
        });
      }
    };

    bind(document.body);

    // Lazy-loaded sections mount later — bind them the moment they appear.
    let refreshT: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => {
      bind(document.body);
      clearTimeout(refreshT);
      refreshT = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      mo.disconnect();
      clearTimeout(t);
      clearTimeout(refreshT);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
