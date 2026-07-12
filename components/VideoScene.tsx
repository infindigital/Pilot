"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Cinematic video plate with still-image fallback.
 *
 * Modes:
 *  - ambient (default): lazy autoplay loop — playback starts when scrolled
 *    near view and pauses off-screen.
 *  - scrub: playback time is driven by scroll (bound via ScrollFx's
 *    [data-scrub-video] hook) — the scene "moves as you scroll", with no
 *    loop restarts.
 */
export default function VideoScene({
  video,
  poster,
  alt,
  className = "",
  parallax,
  scrub = false,
}: {
  video?: string;
  poster: string;
  alt: string;
  className?: string;
  parallax?: number;
  scrub?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scrub) return; // ScrollFx owns playback in scrub mode
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, scrub]);

  const parallaxProps = parallax ? { "data-parallax": String(parallax) } : {};

  if (!video) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        {...parallaxProps}
      />
    );
  }

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      src={video}
      poster={poster}
      muted
      playsInline
      aria-label={alt}
      {...(scrub
        ? { "data-scrub-video": "", preload: "auto" }
        : { loop: true, preload: "none" })}
      {...parallaxProps}
    />
  );
}
