"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient score toggle — "The Ballad of House Sufy".
 *
 * A procedural dark-medieval score synthesized live in WebAudio:
 *   1. String-section drone — D+A open fifth, filtered saws, slow swell
 *   2. Solo cello — an ORIGINAL minor-mode motif with vibrato + echo
 *   3. War drums — deep taiko pulse every second bar
 *   4. Hall wind — filtered noise breathing under everything
 *
 * Composed in code, so it is copyright-free by construction and weighs
 * zero bytes. To use a licensed/CC0 epic track instead, set SCORE_SRC to
 * e.g. "/media/score.mp3" (drop the file in public/media/) — the toggle
 * then streams the file and skips the synth entirely.
 */
const SCORE_SRC = "";

/* D natural-minor motif (Hz), phrased as [note, beats] pairs.
   An original theme — slow, mournful, resolving down to the tonic. */
const D3 = 146.83, E3 = 164.81, F3 = 174.61, G3 = 196.0, A3 = 220.0,
  Bb3 = 233.08, C4 = 261.63, D4 = 293.66, A2 = 110.0, D2 = 73.42;
const PHRASE: [number, number][] = [
  [D3, 2], [F3, 1], [A3, 2], [G3, 1], [F3, 2], [E3, 1], [F3, 3],
  [D3, 2], [F3, 1], [A3, 2], [Bb3, 1], [A3, 2], [G3, 1], [A3, 3],
  [C4, 2], [Bb3, 1], [A3, 2], [G3, 1], [F3, 2], [E3, 1], [D3, 4],
];
const BPM = 72;
const BEAT = 60 / BPM;

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  timer: ReturnType<typeof setInterval>;
};

function buildEngine(): Engine {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Cathedral echo: feedback delay with darkened tail.
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.45;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const darken = ctx.createBiquadFilter();
  darken.type = "lowpass";
  darken.frequency.value = 900;
  delay.connect(darken).connect(feedback).connect(delay);
  delay.connect(master);

  /* 1 ── String drone: D2 + A2 fifth, two detuned saws each. */
  [D2, D2 * 1.005, A2, A2 * 0.996].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 260;
    lp.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.value = i < 2 ? 0.05 : 0.035;
    // Slow filter breathing so the bed never sits still.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.017;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 90;
    lfo.connect(lfoG).connect(lp.frequency);
    osc.connect(lp).connect(g).connect(master);
    g.connect(delay);
    osc.start();
    lfo.start();
  });

  /* 4 ── Hall wind: looped noise through a swept lowpass. */
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // cheap pink-ish noise
    last = last * 0.97 + (Math.random() * 2 - 1) * 0.03;
    data[i] = last * 6;
  }
  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuf;
  wind.loop = true;
  const windLp = ctx.createBiquadFilter();
  windLp.type = "lowpass";
  windLp.frequency.value = 320;
  const windG = ctx.createGain();
  windG.gain.value = 0.05;
  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.07;
  const windLfoG = ctx.createGain();
  windLfoG.gain.value = 140;
  windLfo.connect(windLfoG).connect(windLp.frequency);
  wind.connect(windLp).connect(windG).connect(master);
  wind.start();
  windLfo.start();

  /* 2+3 ── Lookahead scheduler for cello melody + war drums. */
  let noteIdx = 0;
  let nextNote = ctx.currentTime + 1.2;
  let nextDrum = ctx.currentTime + 0.8;
  const barLen = BEAT * 6; // drums every 2 bars of 3/4

  const scheduleCello = (t: number, freq: number, beats: number) => {
    const dur = beats * BEAT;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    // Vibrato that blooms in after the bow settles.
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.2;
    const vibG = ctx.createGain();
    vibG.gain.setValueAtTime(0, t);
    vibG.gain.linearRampToValueAtTime(freq * 0.006, t + dur * 0.5);
    vib.connect(vibG).connect(osc.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 850;
    lp.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16, t + Math.min(0.35, dur * 0.3));
    g.gain.setValueAtTime(0.16, t + dur - 0.25);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.1);
    osc.connect(lp).connect(g).connect(master);
    g.connect(delay);
    osc.start(t);
    osc.stop(t + dur + 0.2);
    vib.start(t);
    vib.stop(t + dur + 0.2);
  };

  const scheduleDrum = (t: number) => {
    // Deep taiko: pitch-dropping sine + noise slap.
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.25);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(g).connect(master);
    g.connect(delay);
    osc.start(t);
    osc.stop(t + 0.7);
    const slap = ctx.createBufferSource();
    slap.buffer = noiseBuf;
    const slapLp = ctx.createBiquadFilter();
    slapLp.type = "lowpass";
    slapLp.frequency.value = 500;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.18, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    slap.connect(slapLp).connect(sg).connect(master);
    slap.start(t);
    slap.stop(t + 0.25);
  };

  const timer = setInterval(() => {
    const horizon = ctx.currentTime + 0.6;
    while (nextNote < horizon) {
      const [freq, beats] = PHRASE[noteIdx % PHRASE.length];
      scheduleCello(nextNote, freq, beats);
      nextNote += beats * BEAT;
      noteIdx++;
      // Breathe between full phrases.
      if (noteIdx % PHRASE.length === 0) nextNote += BEAT * 2;
    }
    while (nextDrum < horizon) {
      scheduleDrum(nextDrum);
      nextDrum += barLen;
    }
  }, 200);

  return { ctx, master, timer };
}

export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (SCORE_SRC) {
      if (!audioRef.current) {
        audioRef.current = new Audio(SCORE_SRC);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.55;
      }
      if (!on) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
      setOn(!on);
      return;
    }

    if (!on) {
      if (!engineRef.current) engineRef.current = buildEngine();
      const { ctx, master } = engineRef.current;
      ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 2.5);
      setOn(true);
    } else {
      const eng = engineRef.current;
      if (eng) {
        eng.master.gain.cancelScheduledValues(eng.ctx.currentTime);
        eng.master.gain.linearRampToValueAtTime(0, eng.ctx.currentTime + 0.8);
      }
      setOn(false);
    }
  };

  useEffect(() => {
    return () => {
      const eng = engineRef.current;
      if (eng) {
        clearInterval(eng.timer);
        eng.ctx.close();
      }
      audioRef.current?.pause();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient score" : "Play ambient score"}
      title={on ? "Silence the hall" : "Let the hall sing"}
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
