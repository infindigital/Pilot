"use client";

import { useEffect, useRef, useState } from "react";
import { RESULTS } from "@/lib/content";

/** Animated stat counter that runs once when scrolled into view. */
function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 2000;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          // easeOutExpo — counters land like a drawn blade, fast then settle
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setDisplay((value * eased).toFixed(decimals));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function Results() {
  return (
    <section id="results" className="relative bg-obsidian py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal-up text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {RESULTS.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-parchment sm:text-5xl">
            {RESULTS.title}
          </h2>
          <div className="rule-forged mx-auto mt-6 w-40" />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.stats.map((s, i) => (
            <div
              key={s.label}
              className="reveal-up rounded-sm tex-steel p-10 text-center"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="font-display text-5xl font-black text-forged">
                <Counter
                  value={s.value}
                  prefix={"prefix" in s ? (s as { prefix?: string }).prefix : ""}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
              </div>
              <div className="rule-forged mx-auto mt-5 w-16" />
              <p className="mt-5 font-body text-xs uppercase tracking-widest2 text-parchment/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <p className="reveal-up mt-8 text-center font-body text-[10px] uppercase tracking-widest2 text-ash">
          {RESULTS.note}
        </p>
      </div>
    </section>
  );
}
