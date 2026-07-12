"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP/ScrollTrigger controller. Wires:
 *  - .reveal-up   → fade + rise as they enter
 *  - [data-parallax] → depth drift tied to scroll (value = strength)
 *  - [data-pin-scene] → subtle scale/opacity on cinematic scenes
 * Respects prefers-reduced-motion.
 */
export default function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".reveal-up")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Reveal on enter
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("is-in"),
        });
      });

      // Parallax layers
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const strength = parseFloat(el.dataset.parallax || "0.2");
        gsap.to(el, {
          yPercent: -strength * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Cinematic scene scale/fade
      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.12, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top center",
              scrub: true,
            },
          }
        );
      });
    });

    // Recalc once fonts/images settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
