"use client";

import { useEffect, useRef } from "react";

/**
 * Torch cursor — a small ember ring plus a soft radial glow that lights the
 * parchment near the pointer. Grows over interactive elements. Disabled on
 * touch devices via CSS.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const ring = ringRef.current!;
    const glow = glowRef.current!;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let gx = rx;
    let gy = ry;
    let mx = rx;
    let my = ry;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Ring tracks tightly; glow lags for a torch-drag feel.
      ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor='hover'], input, textarea")) {
        ring.classList.add("is-hover");
      } else {
        ring.classList.remove("is-hover");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    loop();

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="torch-glow" aria-hidden />
      <div ref={ringRef} className="torch-cursor" aria-hidden />
    </>
  );
}
