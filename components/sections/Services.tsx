"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/content";

export default function Services() {
  return (
    <section id="services" className="relative bg-coal py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal-up text-center">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {SERVICES.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-parchment sm:text-5xl">
            {SERVICES.title}
          </h2>
          <div className="rule-forged mx-auto mt-6 w-40" />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.items.map((s, i) => (
            <motion.article
              key={s.name}
              className="reveal-up group relative overflow-hidden rounded-sm tex-steel p-8 transition-transform duration-500 hover:-translate-y-2"
              style={{ transitionDelay: `${i * 90}ms` }}
              whileHover={{ rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              data-cursor="hover"
            >
              {/* molten edge sweep on hover */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="text-4xl" aria-hidden>
                {s.sigil}
              </div>
              <p className="mt-5 font-body text-[10px] uppercase tracking-widest2 text-gold/80">
                {s.house}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-parchment">
                {s.name}
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-parchment/60">
                {s.desc}
              </p>

              {/* forged corner rivets */}
              <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-gold/40" aria-hidden />
              <span className="absolute right-2 top-2 h-1 w-1 rounded-full bg-gold/40" aria-hidden />
              <span className="absolute bottom-2 left-2 h-1 w-1 rounded-full bg-gold/40" aria-hidden />
              <span className="absolute bottom-2 right-2 h-1 w-1 rounded-full bg-gold/40" aria-hidden />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
