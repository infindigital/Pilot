"use client";

import { TESTIMONIALS } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-obsidian py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal-up text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {TESTIMONIALS.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-parchment sm:text-5xl">
            {TESTIMONIALS.title}
          </h2>
          <div className="rule-forged mx-auto mt-6 w-40" />
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.items.map((t, i) => (
            <figure
              key={t.name}
              className="reveal-up tex-parchment relative rounded-sm p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
              style={{
                transitionDelay: `${i * 100}ms`,
                clipPath:
                  "polygon(0 2%, 3% 0, 97% 1%, 100% 3%, 99% 97%, 96% 100%, 4% 99%, 0 96%)",
              }}
            >
              <span className="font-display text-5xl leading-none text-blood/70" aria-hidden>
                “
              </span>
              <blockquote className="mt-2 font-body text-sm leading-relaxed">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-blood/20 pt-4">
                <div className="font-display text-sm font-bold uppercase tracking-widest2">
                  {t.name}
                </div>
                <div className="mt-1 font-body text-xs opacity-70">{t.title}</div>
              </figcaption>
              {/* wax seal */}
              <span
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-blood font-display text-xs font-black text-parchment shadow-lg"
                aria-hidden
              >
                S
              </span>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
