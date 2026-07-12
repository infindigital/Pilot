"use client";

import VideoScene from "@/components/VideoScene";
import EmberField from "@/components/EmberField";
import { ASSETS } from "@/lib/assets";
import { BRAND } from "@/lib/content";

/**
 * Cinematic transition band — the great-hall walk plate with a slow parallax
 * drift and a single line of house words. Sits between Services and Results.
 */
export default function HallBand() {
  return (
    <section className="relative h-[60vh] overflow-hidden" aria-label="Cinematic interlude">
      <div className="absolute inset-0" data-scene>
        <VideoScene
          video={ASSETS.hallWalkVideo}
          poster={ASSETS.hallWalk}
          alt="Saleeth walking through a torch-lit great hall"
          parallax={0.15}
        />
        <div className="absolute inset-0 bg-obsidian/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
      </div>
      <EmberField className="z-10" density={0.7} />
      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <p className="reveal-up max-w-3xl text-center font-display text-2xl font-semibold leading-relaxed text-parchment sm:text-4xl">
          “{BRAND.words}”
        </p>
      </div>
    </section>
  );
}
