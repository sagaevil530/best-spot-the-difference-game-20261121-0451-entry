// audio.js — tiny synthesised sounds, made with the Web Audio API so the game
// needs no audio files at all. Everything is guarded: no AudioContext, no sound.

let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function audio() {
  if (muted || typeof window === 'undefined') return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** One short oscillator note with a quick decay. */
function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo !== null) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** A satisfying two-note chime when a difference is found. */
export function playFound() {
  tone(660, 0.16, 'sine', 0.22);
  tone(990, 0.28, 'sine', 0.2, 0.07);
}

/** A dull buzz for a miss. */
export function playMiss() {
  tone(180, 0.22, 'sawtooth', 0.1, 0, 120);
}

/** A soft shimmer when a hint is spent. */
export function playHint() {
  tone(880, 0.3, 'triangle', 0.12, 0, 1320);
}

/** A little arpeggio when a level is cleared. */
export function playLevelClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'triangle', 0.18, i * 0.09));
}

/** A low phrase for running out of time. */
export function playGameOver() {
  [392, 330, 262].forEach((f, i) => tone(f, 0.35, 'triangle', 0.16, i * 0.14));
}

/** One soft tick when the clock drops under ten seconds. */
export function playTick() {
  tone(1200, 0.05, 'square', 0.05);
}
