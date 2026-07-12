"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Forge preloader — the SUFY sigil "forges" in with an ember sweep and a
 * filling molten bar, then lifts like a gate to reveal the throne room.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let val = 0;
    const tick = setInterval(() => {
      val += Math.random() * 12 + 4;
      if (val >= 100) {
        val = 100;
        clearInterval(tick);
        setTimeout(() => setDone(true), 650);
      }
      setPct(Math.min(100, Math.round(val)));
    }, 130);
    return () => clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-obsidian"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="font-display text-6xl font-black tracking-widest2 text-forged sm:text-7xl"
          >
            SUFY
          </motion.div>

          <div className="mt-8 h-[3px] w-56 overflow-hidden rounded bg-iron">
            <motion.div
              className="h-full"
              style={{
                background:
                  "linear-gradient(90deg,#7b1113,#ff6a1a,#e9c877)",
                boxShadow: "0 0 18px rgba(255,106,26,0.8)",
                width: `${pct}%`,
              }}
            />
          </div>
          <div className="mt-4 font-body text-xs uppercase tracking-widest2 text-ash">
            Forging the realm · {pct}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
