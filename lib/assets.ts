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
  // ── Hero: Saleeth on the Iron Throne (approved Option A) ──
  heroImage: asset(
    "hero-throne.png",
    `${CDN}/hf_20260712_105301_65a0543b-aba1-4d3a-9c68-fb875b487bc6.png`
  ),
  // 4K upscaled hero still (used as poster / fallback).
  heroImage4k: asset(
    "hero-throne-4k.png",
    `${CDN}/hf_20260712_105517_369a7777-eadb-4447-b2b5-1d5e0388f841.png`
  ),
  // Living loop (breathing + embers + camera drift).
  heroVideo: asset(
    "hero-throne-loop.mp4",
    `${CDN}/hf_20260712_105625_e0286d78-d09b-452a-b870-cc1a0b85a3e7.mp4`
  ),

  // ── About: war / strategy table ──
  warTable: asset(
    "war-table.png",
    `${CDN}/hf_20260712_105440_83445210-cd20-4b25-81ae-df04028f5da3.png`
  ),

  // ── Section transition: great-hall walk ──
  hallWalk: asset(
    "great-hall-walk.png",
    `${CDN}/hf_20260712_105445_95dfac23-a517-4433-98d4-91db4e3369a9.png`
  ),

  // ── Brand: the Sufy sigil crest (wordmark variant — swap id once chosen) ──
  sigil: asset(
    "sufy-sigil.png",
    `${CDN}/hf_20260712_105731_1b0af354-e09f-4215-a217-3f3ba85dc98a.png`
  ),
} as const;

export type AssetKey = keyof typeof ASSETS;
