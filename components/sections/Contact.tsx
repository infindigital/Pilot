"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmberField from "@/components/EmberField";
import { CONTACT, BRAND } from "@/lib/content";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `A raven from ${data.get("name") || "a stranger"}`
    );
    const body = encodeURIComponent(String(data.get("message") || ""));
    // Static-export friendly: hand off to the visitor's mail client.
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-coal py-28">
      <EmberField className="z-0" density={0.6} />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="reveal-up">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {CONTACT.kicker}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold text-parchment sm:text-5xl">
            {CONTACT.title}
          </h2>
          <div className="rule-forged mx-auto mt-6 w-40" />
          <p className="mx-auto mt-6 max-w-xl font-body text-sm leading-relaxed text-parchment/70">
            {CONTACT.body}
          </p>
        </div>

        <form onSubmit={onSubmit} className="reveal-up mt-12 space-y-4 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Your name, my lord/lady"
              className="w-full rounded-sm border border-gold/20 bg-obsidian/80 px-5 py-4 font-body text-sm text-parchment placeholder:text-ash focus:border-ember focus:outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Where the raven returns (email)"
              className="w-full rounded-sm border border-gold/20 bg-obsidian/80 px-5 py-4 font-body text-sm text-parchment placeholder:text-ash focus:border-ember focus:outline-none"
            />
          </div>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Speak your quest — the kingdom you wish to grow…"
            className="w-full rounded-sm border border-gold/20 bg-obsidian/80 px-5 py-4 font-body text-sm text-parchment placeholder:text-ash focus:border-ember focus:outline-none"
          />
          <button
            type="submit"
            data-cursor="hover"
            className="group relative w-full overflow-hidden rounded-sm border border-ember/60 bg-ember/10 px-8 py-4 font-body text-xs uppercase tracking-widest2 text-ember-glow transition hover:bg-ember/20 sm:w-auto"
          >
            <span className="relative z-10">🪶 Send the Raven</span>
          </button>
        </form>

        <AnimatePresence>
          {sent && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 font-display text-sm text-goldLight"
            >
              The raven has taken wing. I shall answer swiftly.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Socials as house banners */}
        <div className="reveal-up mt-16 flex flex-wrap items-start justify-center gap-4">
          {CONTACT.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              data-cursor="hover"
              className="group relative w-36 border border-gold/20 bg-gradient-to-b from-iron to-obsidian px-4 pb-6 pt-5 text-center transition hover:border-ember"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
              }}
            >
              <div className="font-display text-xs font-bold uppercase tracking-widest2 text-goldLight">
                {s.label}
              </div>
              <div className="mt-1 truncate font-body text-[10px] text-parchment/50 group-hover:text-parchment/80">
                {s.handle}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
