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

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Mouse-driven 3D camera drift — the title floats in depth above the scene.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
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
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Cinematic backplate: living video loop with 4K/1K still fallback.
          #hero-media is scroll-scrubbed by ScrollFx (zoom + dim on exit). */}
      <motion.div
        id="hero-media"
        className="absolute inset-0"
        style={{ x: bgX, y: bgY, scale: 1.04 }}
      >
        {ASSETS.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            src={ASSETS.heroVideo}
            poster={ASSETS.heroImage4k || ASSETS.heroImage}
            autoPlay
            muted
            loop
            playsInline
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
        {/* Grading + legibility gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 via-transparent to-obsidian/60" />
      </motion.div>

      <EmberField className="z-10" density={1.1} />

      {/* Title block — floats in 3D above the scene, scroll-scrubbed on exit */}
      <motion.div
        id="hero-title"
        className="relative z-20 mx-auto max-w-4xl px-6 text-center"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.9 }}
          className="font-body text-xs uppercase tracking-widest2 text-goldLight/80 sm:text-sm"
        >
          House Sufy · {BRAND.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 1.15, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.9, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-7xl font-black leading-none tracking-widest2 text-forged sm:text-8xl md:text-[10rem]"
          style={{ transform: "translateZ(60px)" }}
        >
          {BRAND.name}
        </motion.h1>

        {/* Forged rule reveal */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="rule-forged mx-auto mt-6 w-64 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.9 }}
          className="mx-auto mt-6 max-w-xl font-display text-lg text-parchment/90 sm:text-xl"
        >
          {BRAND.role} — {BRAND.tagline}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="#about"
            className="group relative overflow-hidden rounded-sm border border-ember/60 bg-ember/10 px-8 py-3 font-body text-xs uppercase tracking-widest2 text-ember-glow transition hover:bg-ember/20"
          >
            <span className="relative z-10">Enter the Realm</span>
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-gold/30 px-8 py-3 font-body text-xs uppercase tracking-widest2 text-goldLight/90 transition hover:border-gold"
          >
            Summon the Strategist
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-ash">
          <span className="font-body text-[10px] uppercase tracking-widest2">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-goldLight to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
