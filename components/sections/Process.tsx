"use client";

import { PROCESS } from "@/lib/content";

/**
 * "The Campaign" — a marching war-map timeline. A glowing route line runs
 * down the center; each step is a waypoint marker with a roman numeral seal.
 */
export default function Process() {
  return (
    <section id="process" className="relative bg-coal py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal-up text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {PROCESS.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-parchment sm:text-5xl">
            {PROCESS.title}
          </h2>
          <div className="rule-forged mx-auto mt-6 w-40" />
        </div>

        <div className="relative mt-20">
          {/* Marching route */}
          <span
            className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-ember/50 to-transparent md:left-1/2"
            aria-hidden
          />

          <ol className="space-y-16">
            {PROCESS.steps.map((step, i) => (
              <li
                key={step.n}
                className={`reveal-up relative flex flex-col gap-6 pl-16 md:w-1/2 md:pl-0 ${
                  i % 2 === 0
                    ? "md:pr-16 md:text-right"
                    : "md:ml-auto md:pl-16"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Waypoint seal */}
                <span
                  className={`absolute top-0 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-obsidian font-display text-sm font-bold text-goldLight shadow-[0_0_20px_-4px_rgba(255,106,26,0.5)] ${
                    i % 2 === 0
                      ? "left-0 md:left-auto md:-right-6"
                      : "left-0 md:-left-6"
                  }`}
                  aria-hidden
                >
                  {step.n}
                </span>

                <div>
                  <h3 className="font-display text-2xl font-semibold text-parchment">
                    {step.name}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-parchment/60">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
