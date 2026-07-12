import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Forged, atmospheric palette
        obsidian: "#07070a",
        coal: "#0d0d12",
        iron: "#1a1b20",
        steel: "#2a2c34",
        ash: "#5b5d66",
        parchment: "#e8dcc0",
        ember: "#ff6a1a",
        emberDeep: "#c2410c",
        gold: "#c9a227",
        goldLight: "#e9c877",
        blood: "#7b1113",
        frost: "#7fb0c4",
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "Trajan Pro", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "42%": { opacity: "0.86" },
          "45%": { opacity: "0.72" },
          "48%": { opacity: "0.9" },
          "70%": { opacity: "0.82" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "100%": { transform: "translateY(-120px) translateX(30px)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },
      animation: {
        flicker: "flicker 4s infinite",
        shimmer: "shimmer 6s linear infinite",
        breathe: "breathe 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
