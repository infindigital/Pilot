/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ASSET REGISTRY  —  single source of truth for every cinematic asset.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  These are Higgsfield-generated, personalized from Saleeth's photo via the
 *  reusable "Sufy-Saleeth" character reference.
 *
 *  They currently point at the Higgsfield CDN so the site runs immediately.
 *  The build environment's egress policy blocked downloading them into the
 *  repo. To make the site fully self-hosted (recommended for production &
 *  Core Web Vitals):
 *
 *    1. Download each URL below into /public/media/ (same filename).
 *    2. Set  const LOCAL = true  below.
 *
 *  Everything else in the app reads from this file, so that one flip swaps
 *  the whole site from CDN → local with no other code changes.
 */

const LOCAL = false;
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3G4bnJPvIHipa5YfpqpDWYcQAig";

/** Resolve an asset: CDN url when remote, /media/<file> when localised. */
function asset(file: string, cdnUrl: string): string {
  return LOCAL ? `/media/${file}` : cdnUrl;
}

export const ASSETS = {
  // ── Hero: Saleeth working on a laptop atop the Iron Throne (approved Hero B) ──
  heroImage: asset(
    "hero-throne.png",
    `${CDN}/hf_20260712_105909_d520b7d3-5fd5-4cf5-a81a-a128f9d7f482.png`
  ),
  // 4K upscaled hero still (poster / fallback).
  heroImage4k: asset(
    "hero-throne-4k.png",
    `${CDN}/hf_20260712_132457_caa8af55-ae0f-4955-9b8a-4df3663360f5.png`
  ),
  // Living loop (working on laptop + breathing + embers + camera push-in).
  heroVideo: asset(
    "hero-throne-loop.mp4",
    `${CDN}/hf_20260712_132458_14c98129-c49f-499f-a90a-1d519d5a03c4.mp4`
  ),

  // ── About: war / strategy table with labeled marketing map (approved Table B) ──
  warTable: asset(
    "war-table.png",
    `${CDN}/hf_20260712_105914_c13c22de-182e-4c44-a23a-63d90d4309a0.png`
  ),
  // Living loop (candle flicker, pulsing map glow, drifting mist).
  warTableVideo: asset(
    "war-table-loop.mp4",
    `${CDN}/hf_20260712_140030_fc543f77-1442-468a-b522-1e79d6b8c39f.mp4`
  ),

  // ── Section transition: great-hall walk ──
  hallWalk: asset(
    "great-hall-walk.png",
    `${CDN}/hf_20260712_105445_95dfac23-a517-4433-98d4-91db4e3369a9.png`
  ),
  // Living loop (walking toward camera, swaying banners, brazier flames).
  hallWalkVideo: asset(
    "great-hall-walk-loop.mp4",
    `${CDN}/hf_20260712_140019_c9e4a903-9147-4a87-8824-0bc5c206579f.mp4`
  ),

  // ── Brand: the Sufy sigil crest (wordmark variant — swap id once chosen) ──
  sigil: asset(
    "sufy-sigil.png",
    `${CDN}/hf_20260712_105731_1b0af354-e09f-4215-a217-3f3ba85dc98a.png`
  ),
} as const;

export type AssetKey = keyof typeof ASSETS;
