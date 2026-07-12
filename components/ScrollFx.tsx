"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

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

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const bound = new WeakSet<Element>();

    // Animated anchor navigation — plays nicely with pinned sections
    // (native smooth anchor scrolling gets cancelled by pin updates).
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const target = document.querySelector(a.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href")!);
      gsap.to(window, {
        scrollTo: { y: target as Element, autoKill: false },
        duration: 1.2,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    };
    document.addEventListener("click", onAnchorClick);

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

      // Scroll-driven videos: the video PLAYS while the user scrolls and
      // pauses the moment they stop. Playing forward works with any video
      // encoding (unlike currentTime seeking, which stalls on the sparse
      // keyframes of AI-generated clips).
      // data-scrub-video="pin" → also pins its section for ~2 viewports
      // data-scrub-video       → active while the section transits the viewport
      root
        .querySelectorAll<HTMLVideoElement>("video[data-scrub-video]")
        .forEach((v) => {
          if (bound.has(v)) return;
          bound.add(v);
          v.pause();
          const mode = v.dataset.scrubVideo;
          const section = v.closest("section") || v.parentElement!;
          // "Chase the target": scroll progress maps to a film position and
          // the video PLAYS toward it at a rate proportional to the gap.
          // Decoder-friendly (no per-frame seeking) yet deterministic —
          // stop scrolling and playback glides to a stop at your position.
          const state = { progress: 0 };

          const onUpdate = (self: ScrollTrigger) => {
            state.progress = self.progress;
          };

          const tick = () => {
            if (v.duration) {
              const target = state.progress * (v.duration - 0.05);
              const gap = target - v.currentTime;
              if (gap > 0.12) {
                // Chase forward by playing; scale speed to the gap.
                // Wide hysteresis (start >0.12s, stop <0.04s) prevents
                // rapid play/pause thrash that reads as stutter.
                v.playbackRate = Math.min(2.5, Math.max(0.6, gap * 1.8));
                if (v.paused) v.play().catch(() => {});
              } else if (gap < -0.4) {
                // Scrolled back up — one coarse seek, then hold.
                if (!v.paused) v.pause();
                v.currentTime = Math.max(0, target);
              } else if (gap < 0.04 && !v.paused) {
                v.pause();
              }
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);

          ScrollTrigger.create(
            mode === "pin"
              ? {
                  trigger: section,
                  start: "top top",
                  end: "+=200%",
                  pin: true,
                  scrub: true,
                  anticipatePin: 1,
                  onUpdate,
                }
              : {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  onUpdate,
                }
          );
        });
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
      document.removeEventListener("click", onAnchorClick);
      mo.disconnect();
      clearTimeout(t);
      clearTimeout(refreshT);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
