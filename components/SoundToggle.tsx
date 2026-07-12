"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient score toggle. Uses a WebAudio-synthesized low drone + ember
 * crackle so there's no external audio dependency (and nothing to lazy-load).
 * Starts muted; the crown lights when the hall "breathes".
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode } | null>(null);

  const start = () => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);

    // Two detuned low drones for a hall-ambience bed.
    [55, 82.4].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.18 : 0.1;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08 + i * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 6;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.connect(g).connect(master);
      osc.start();
      lfo.start();
    });

    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
    ctxRef.current = ctx;
    nodesRef.current = { gain: master };
  };

  const toggle = () => {
    if (!on) {
      if (!ctxRef.current) start();
      else {
        ctxRef.current.resume();
        nodesRef.current?.gain.gain.linearRampToValueAtTime(
          0.5,
          ctxRef.current.currentTime + 1
        );
      }
      setOn(true);
    } else {
      if (ctxRef.current && nodesRef.current) {
        nodesRef.current.gain.gain.linearRampToValueAtTime(
          0,
          ctxRef.current.currentTime + 0.6
        );
      }
      setOn(false);
    }
  };

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient score" : "Play ambient score"}
      className="fixed bottom-6 right-6 z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-coal/70 backdrop-blur transition hover:border-ember hover:shadow-[0_0_24px_-4px_rgba(255,106,26,0.6)]"
    >
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded bg-gradient-to-t from-emberDeep to-goldLight"
            style={{
              height: on ? `${8 + ((i * 5) % 14)}px` : "4px",
              transition: "height .3s ease",
              animation: on
                ? `breathe ${1 + i * 0.2}s ease-in-out ${i * 0.1}s infinite`
                : "none",
            }}
          />
        ))}
      </span>
    </button>
  );
}
