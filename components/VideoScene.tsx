"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Cinematic video plate with still-image fallback.
 * - Lazy: video element only starts loading/playing when scrolled near view
 *   (IntersectionObserver), pauses when off-screen — keeps 60fps and data lean.
 * - Falls back to the poster still when no video URL is provided yet.
 */
export default function VideoScene({
  video,
  poster,
  alt,
  className = "",
  parallax,
}: {
  video?: string;
  poster: string;
  alt: string;
  className?: string;
  parallax?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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
  }, [video]);

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
      loop
      playsInline
      preload="none"
      aria-label={alt}
      {...parallaxProps}
    />
  );
}
