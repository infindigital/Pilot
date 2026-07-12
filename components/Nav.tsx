"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NAV, BRAND } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className={`fixed inset-x-0 top-0 z-[90] transition-colors duration-500 ${
        scrolled ? "bg-obsidian/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#hero"
          className="font-display text-2xl font-black tracking-widest2 text-forged"
        >
          {BRAND.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="group relative font-body text-xs uppercase tracking-widest2 text-parchment/70 transition hover:text-goldLight"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden rounded-sm border border-gold/40 px-5 py-2 font-body text-xs uppercase tracking-widest2 text-goldLight transition hover:border-ember hover:text-ember-glow md:inline-block"
        >
          Send a Raven
        </a>

        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-px w-6 bg-goldLight" />
            <span className="block h-px w-6 bg-goldLight" />
            <span className="block h-px w-4 bg-goldLight" />
          </div>
        </button>
      </nav>

      {open && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="flex flex-col gap-1 overflow-hidden bg-obsidian/95 px-6 pb-6 md:hidden"
        >
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className="block border-b border-iron py-3 font-display text-sm uppercase tracking-widest2 text-parchment/80"
              >
                {n.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
