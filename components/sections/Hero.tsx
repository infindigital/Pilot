"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import EmberField from "@/components/EmberField";
import { ASSETS } from "@/lib/assets";
import { BRAND } from "@/lib/content";

/**
 * Pinned, scroll-scrubbed hero. The section pins for ~2 extra viewports and
 * the throne video's playback is DRIVEN BY SCROLL (see ScrollFx's
 * [data-scrub-video] binding) — no autoplay loop, no jump-cut restarts.
 * Text sits lower-left so it never covers the face.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Mouse-driven depth drift on the backplate only.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const bgY = useTransform(sy, [-0.5, 0.5], [5, -5]);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Cinematic backplate — scrubbed by scroll while the section is pinned */}
      <div id="hero-media" className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ x: bgX, y: bgY, scale: 1.06 }}
        >
          {ASSETS.heroVideo ? (
            <video
              className="h-full w-full object-cover"
              src={ASSETS.heroVideo}
              poster={ASSETS.heroImage4k || ASSETS.heroImage}
              data-scrub-video="pin"
              muted
              playsInline
              preload="auto"
            />
          ) : (
            <Image
              src={ASSETS.heroImage}
              alt="Saleeth Sufiyan on the Iron Throne"
              fill
              priority
              className="object-cover"
            />
          )}
          {/* Grading + legibility gradients (bottom-heavy, face stays clear) */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/60 via-transparent to-transparent" />
        </motion.div>
      </div>

      <EmberField className="z-10" density={1.1} />

      {/* Lower-left title block — never covers the throne portrait */}
      <div
        id="hero-title"
        className="relative z-20 w-full max-w-2xl px-6 pb-24 sm:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.9 }}
          className="font-body text-xs uppercase tracking-widest2 text-goldLight/80"
        >
          House Sufy · {BRAND.fullName}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-4xl font-black leading-tight text-parchment sm:text-5xl lg:text-6xl"
        >
          Winning the{" "}
          <span className="text-forged">Game of Growth</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="rule-forged mt-6 w-48 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.9 }}
          className="mt-5 max-w-lg font-body text-sm leading-relaxed text-parchment/75 sm:text-base"
        >
          {BRAND.role}. Strategy from the throne, victories on the map.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.9 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#about"
            className="group relative overflow-hidden rounded-sm border border-ember/60 bg-ember/10 px-8 py-3 text-center font-body text-xs uppercase tracking-widest2 text-ember-glow transition hover:bg-ember/20"
          >
            <span className="relative z-10">Enter the Realm</span>
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-gold/30 px-8 py-3 text-center font-body text-xs uppercase tracking-widest2 text-goldLight/90 transition hover:border-gold"
          >
            Summon the Strategist
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-8 right-8 z-20 sm:right-12"
      >
        <div className="flex flex-col items-center gap-2 text-ash">
          <span className="font-body text-[10px] uppercase tracking-widest2">
            Scroll to command
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-goldLight to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
