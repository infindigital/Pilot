"use client";

import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { ABOUT } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-obsidian py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        {/* War table scene */}
        <div className="reveal-up relative">
          <div
            className="relative aspect-[16/10] overflow-hidden rounded-sm tex-steel"
            data-scene
          >
            <Image
              src={ASSETS.warTable}
              alt="Saleeth at the war table planning SEO, performance marketing and social media campaigns"
              fill
              className="object-cover"
              data-parallax="0.08"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          </div>
          <div className="mt-4 text-center font-body text-[10px] uppercase tracking-widest2 text-ash">
            The War Table · SEO · Performance Marketing · Social Media
          </div>
        </div>

        {/* Story */}
        <div className="reveal-up">
          <p className="font-body text-xs uppercase tracking-widest2 text-ember">
            {ABOUT.kicker}
          </p>
          <h2 className="mt-4 whitespace-pre-line font-display text-4xl font-bold leading-tight text-parchment sm:text-5xl">
            {ABOUT.title}
          </h2>
          <div className="rule-forged mt-6 w-40" />
          <div className="mt-6 space-y-5">
            {ABOUT.body.map((p, i) => (
              <p key={i} className="font-body text-base leading-relaxed text-parchment/70">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
