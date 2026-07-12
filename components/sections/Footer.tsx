"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { BRAND } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/10 bg-obsidian py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center">
        {/* Sufy crest */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full border border-gold/20 shadow-[0_0_40px_-8px_rgba(255,106,26,0.35)]">
          <Image
            src={ASSETS.sigil}
            alt="House Sufy sigil"
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <div className="font-display text-3xl font-black tracking-widest2 text-forged">
          {BRAND.name}
        </div>

        <p className="font-display text-sm italic text-parchment/60">
          “{BRAND.words}”
        </p>

        <div className="rule-forged w-64" />

        <p className="font-body text-[11px] uppercase tracking-widest2 text-ash">
          © {new Date().getFullYear()} {BRAND.fullName} · {BRAND.role} · All
          banners flown with honor
        </p>
      </div>
    </footer>
  );
}
