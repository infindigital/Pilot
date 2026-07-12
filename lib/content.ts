/**
 * Site content — all copy lives here so it's easy to edit without touching
 * component code. Written in the "House Sufy" voice: regal, cinematic, but
 * every metaphor maps to a real SEO / performance-marketing capability.
 */

export const BRAND = {
  name: "SUFY",
  fullName: "Saleeth Sufiyan",
  role: "SEO & Performance Marketing",
  tagline: "Winning the Game of Growth",
  words: "Words are wind — results are steel.",
  email: "work@infindigital.net",
};

export const NAV = [
  { id: "hero", label: "Throne" },
  { id: "about", label: "Strategist" },
  { id: "services", label: "Arsenal" },
  { id: "results", label: "Conquests" },
  { id: "process", label: "Campaign" },
  { id: "testimonials", label: "Allies" },
];

export const ABOUT = {
  kicker: "The Strategist",
  title: "I don't chase rankings.\nI conquer them.",
  body: [
    "From the war table, every campaign is a battle plan. I read the terrain — search demand, competitor strongholds, wasted ad spend — and I move with intent.",
    "As an SEO and performance-marketing specialist, I turn scattered budgets into disciplined armies: organic territory claimed page by page, paid campaigns that return their weight in gold, and data that never lies.",
    "When you play the game of search, you win — or your competitor takes the throne. I make sure it's you.",
  ],
};

export const SERVICES = {
  kicker: "The Arsenal",
  title: "My Arsenal",
  items: [
    {
      sigil: "⚔️",
      name: "Search Engine Optimization",
      house: "Claim the Map",
      desc: "Technical SEO, content strategy, and authority building that seizes page-one territory and holds it.",
    },
    {
      sigil: "🐉",
      name: "Performance Marketing",
      house: "Unleash the Dragons",
      desc: "Google & Meta paid campaigns engineered for ROAS — scorched-earth reach with surgical targeting.",
    },
    {
      sigil: "🗺️",
      name: "Analytics & Insight",
      house: "The Master of Whisperers",
      desc: "GA4, attribution, and dashboards that turn raw signal into the intelligence your next move depends on.",
    },
    {
      sigil: "🏰",
      name: "Conversion Rate Optimization",
      house: "Fortify the Keep",
      desc: "Landing pages and funnels rebuilt to convert — so every visitor you win is a visitor you keep.",
    },
  ],
};

export const RESULTS = {
  kicker: "Conquests",
  title: "Battles Won",
  stats: [
    { value: 6.4, suffix: "x", label: "Average ROAS delivered", decimals: 1 },
    { value: 312, suffix: "%", label: "Peak organic traffic growth", decimals: 0 },
    { value: 1.2, prefix: "$", suffix: "M+", label: "Ad spend commanded", decimals: 1 },
    { value: 40, suffix: "+", label: "Campaigns led to victory", decimals: 0 },
  ],
  note: "Illustrative figures — swap for your real numbers in lib/content.ts.",
};

export const PROCESS = {
  kicker: "The Campaign",
  title: "The March to Victory",
  steps: [
    {
      n: "I",
      name: "Scout the Terrain",
      desc: "Audit, keyword & competitor recon, funnel diagnosis. Know the battlefield before the first move.",
    },
    {
      n: "II",
      name: "Draw the Battle Plan",
      desc: "Strategy on the war table — priorities, channels, budgets, and the metrics that decide the war.",
    },
    {
      n: "III",
      name: "March the Armies",
      desc: "Launch SEO and paid campaigns in formation — content, technical fixes, ad sets, creative.",
    },
    {
      n: "IV",
      name: "Hold & Advance",
      desc: "Test, optimize, scale. Defend the gains, press the advantage, compound the returns.",
    },
  ],
};

export const TESTIMONIALS = {
  kicker: "Allies' Words",
  title: "Spoken by the Houses I've Served",
  items: [
    {
      quote:
        "Saleeth took our ad spend and turned it into an engine. ROAS more than doubled in a single quarter.",
      name: "House of a D2C Brand",
      title: "Founder",
    },
    {
      quote:
        "We were invisible on search. Within months we held page one for the terms that actually sell.",
      name: "House of a SaaS Startup",
      title: "Head of Growth",
    },
    {
      quote:
        "Finally, a marketer who speaks in outcomes, not vanity metrics. The reporting alone was worth it.",
      name: "House of a Local Enterprise",
      title: "Managing Director",
    },
  ],
  note: "Placeholder testimonials — replace with real client words in lib/content.ts.",
};

export const CONTACT = {
  kicker: "Send a Raven",
  title: "Summon the Strategist",
  body: "Have a kingdom to grow? Send word. Every great conquest begins with a single raven.",
  socials: [
    { label: "Email", handle: "work@infindigital.net", href: "mailto:work@infindigital.net" },
    { label: "LinkedIn", handle: "/in/saleeth", href: "#" },
    { label: "Instagram", handle: "@sufy", href: "#" },
    { label: "X", handle: "@sufy", href: "#" },
  ],
};
