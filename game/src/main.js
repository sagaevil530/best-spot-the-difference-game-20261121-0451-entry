// main.js — boot, input and the frame loop for Lantern Light.
// The canvas is drawn at a fixed 1280x720 and scaled to the window, so the
// game looks the same at any window size and screenshots are reproducible.

import { createGame, startLevel, toTitle, tick, clickPanel, useHint, foundCount } from './game.js';
import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { drawGame, layoutFor, VIEW_W, VIEW_H } from './render.js';
import { stageShot } from './shots.js';
import * as sound from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const BEST_KEY = 'lantern-light-best';
const STARS_KEY = 'lantern-light-stars';

function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode or no storage: the game still plays, nothing is kept.
  }
}

const game = createGame(loadJson(STARS_KEY, {}));
let best = loadJson(BEST_KEY, 0);
let lastTickSecond = -1;
let layout = layoutFor(game);
let frozen = false; // a staged ?shot= frame never counts down or drifts

function saveProgress() {
  saveJson(STARS_KEY, game.stars);
  if (game.score > best) {
    best = game.score;
    saveJson(BEST_KEY, best);
  }
}

/** Window pixels -> logical 1280x720 coordinates. */
function toLogical(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VIEW_W,
    y: ((clientY - rect.top) / rect.height) * VIEW_H,
  };
}

function hitButton(x, y) {
  for (const b of layout.buttons) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id;
  }
  return null;
}

function hitPanel(x, y) {
  for (const p of layout.panels) {
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
      return { side: p.side, x: x - p.x, y: y - p.y };
    }
  }
  return null;
}

function announce(text) {
  if (statusEl) statusEl.textContent = text;
}

function handleButton(id) {
  if (id.startsWith('level-')) {
    startLevel(game, Number(id.split('-')[1]));
    announce(`Level ${game.levelIndex + 1}: ${SCENES[game.levelIndex].name}. Find ${SCENES[game.levelIndex].diffs.length} differences.`);
    return;
  }
  if (id === 'hint') {
    if (useHint(game)) sound.playHint();
    return;
  }
  if (id === 'sound') {
    game.muted = !game.muted;
    sound.setMuted(game.muted);
    return;
  }
  if (id === 'restart' || id === 'retry' || id === 'replay') {
    startLevel(game, game.levelIndex);
    announce(`Level ${game.levelIndex + 1} restarted.`);
    return;
  }
  if (id === 'next') {
    startLevel(game, game.levelIndex + 1);
    announce(`Level ${game.levelIndex + 1}: ${SCENES[game.levelIndex].name}.`);
    return;
  }
  if (id === 'menu') {
    toTitle(game);
    saveProgress();
  }
}

canvas.addEventListener('click', (event) => {
  const { x, y } = toLogical(event.clientX, event.clientY);
  const buttonId = hitButton(x, y);
  if (buttonId) {
    handleButton(buttonId);
    return;
  }
  if (game.screen !== 'playing') return;
  const panel = hitPanel(x, y);
  if (!panel) return;
  const result = clickPanel(game, panel.x, panel.y);
  if (result === 'found') {
    sound.playFound();
    announce(`Found ${foundCount(game)} of ${SCENES[game.levelIndex].diffs.length} differences.`);
    if (game.screen === 'levelComplete' || game.screen === 'allComplete') {
      sound.playLevelClear();
      saveProgress();
    }
  } else if (result === 'miss') {
    sound.playMiss();
    announce('Not a difference. Five seconds lost.');
  }
});

canvas.addEventListener('mousemove', (event) => {
  const { x, y } = toLogical(event.clientX, event.clientY);
  const buttonId = hitButton(x, y);
  game.hover = buttonId ? { kind: 'button', id: buttonId } : null;
  canvas.style.cursor = buttonId || (game.screen === 'playing' && hitPanel(x, y)) ? 'pointer' : 'default';
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h' && game.screen === 'playing') {
    if (useHint(game)) sound.playHint();
  } else if (key === 'r' && (game.screen === 'playing' || game.screen === 'gameOver')) {
    startLevel(game, game.levelIndex);
  } else if (key === 'm') {
    game.muted = !game.muted;
    sound.setMuted(game.muted);
  } else if (key === 'escape') {
    toTitle(game);
    saveProgress();
  } else if (/^[1-5]$/.test(key) && game.screen === 'title') {
    startLevel(game, Number(key) - 1);
  }
});

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
}

function frame(now) {
  const dt = Math.min(0.1, (now - frame.last) / 1000 || 0.016);
  frame.last = now;
  tick(game, frozen ? 0 : dt);
  if (game.screen === 'playing') {
    const whole = Math.ceil(game.timeLeft);
    if (whole !== lastTickSecond) {
      lastTickSecond = whole;
      if (whole <= 10 && whole > 0) sound.playTick();
    }
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = canvas.width / dpr;
  const ch = canvas.height / dpr;
  const scale = Math.min(cw / VIEW_W, ch / VIEW_H);
  const ox = (cw - VIEW_W * scale) / 2;
  const oy = (ch - VIEW_H * scale) / 2;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
  layout = drawGame(ctx, game);
  requestAnimationFrame(frame);
}
frame.last = 0;

// ?shot=cover|play|title|win stages a fixed frame for screenshots.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, game);
  frozen = true; // the staged frame never counts down or drifts
  tick(game, 0);
} else {
  announce('Lantern Light: spot the difference. Choose a scene to begin.');
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);
