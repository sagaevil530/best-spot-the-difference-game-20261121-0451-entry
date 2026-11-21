// game.js — the rules of Lantern Light, with no DOM in it so the logic can be
// tested from Node. The renderer (render.js) only reads this state; main.js
// feeds it clicks, keys and the clock.

import { SCENES } from './scenes.js';

export const MISS_PENALTY_SECONDS = 5;
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;
export const FIND_POINTS = 100;
export const COMBO_STEP = 10;
export const TIME_BONUS_PER_SECOND = 5;

/** Fresh state for a whole run. `best` is stars earned per level, loaded by main.js. */
export function createGame(best = {}) {
  return {
    screen: 'title', // title | playing | levelComplete | gameOver | allComplete
    levelIndex: 0,
    score: 0,
    combo: 0,
    timeLeft: SCENES[0].timeLimit,
    found: [], // indexes into the level's diffs, in find order
    misses: [], // {x, y, ttl} panel-space miss marks, either panel
    hinted: null, // {diffIndex, ttl} the hint ring currently shown
    hintsLeft: HINTS_PER_LEVEL,
    stars: { ...best },
    message: null, // {text, ttl, color}
    shake: 0,
    levelScore: 0,
    levelBonus: 0,
    muted: false,
    hover: null, // {kind: 'button'|'panel', ...} set by the renderer each frame
    time: 0, // seconds since boot, for pulsing animations
  };
}

export function levelOf(game) {
  return SCENES[game.levelIndex];
}

export function foundCount(game) {
  return game.found.length;
}

export function isLevelDone(game) {
  return game.found.length >= levelOf(game).diffs.length;
}

/** Start (or restart) a level, keeping the total score. */
export function startLevel(game, index) {
  game.levelIndex = index;
  game.screen = 'playing';
  game.timeLeft = SCENES[index].timeLimit;
  game.found = [];
  game.misses = [];
  game.hinted = null;
  game.hintsLeft = HINTS_PER_LEVEL;
  game.combo = 0;
  game.levelScore = 0;
  game.levelBonus = 0;
  game.message = null;
  game.shake = 0;
}

/** Back to the title screen. */
export function toTitle(game) {
  game.screen = 'title';
  game.found = [];
  game.misses = [];
  game.hinted = null;
  game.message = null;
  game.shake = 0;
}

/** Advance the clock by dt seconds. Handles the countdown and the timeout. */
export function tick(game, dt) {
  game.time += dt;
  if (game.message) {
    game.message.ttl -= dt;
    if (game.message.ttl <= 0) game.message = null;
  }
  if (game.hinted) {
    game.hinted.ttl -= dt;
    if (game.hinted.ttl <= 0) game.hinted = null;
  }
  for (const miss of game.misses) miss.ttl -= dt;
  game.misses = game.misses.filter((m) => m.ttl > 0);
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 3);
  if (game.screen !== 'playing') return;
  game.timeLeft -= dt;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = 'gameOver';
    game.combo = 0;
  }
}

function say(game, text, color) {
  game.message = { text, ttl: 1.6, color };
}

/**
 * A click inside a panel, in panel space (0..560, 0..400). Returns 'found',
 * 'miss' or null (not playing). Finding a difference awards points and a
 * growing combo; missing costs time and breaks the combo.
 */
export function clickPanel(game, x, y) {
  if (game.screen !== 'playing') return null;
  const scene = levelOf(game);
  for (let i = 0; i < scene.diffs.length; i += 1) {
    if (game.found.includes(i)) continue;
    const d = scene.diffs[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      game.found.push(i);
      game.combo += 1;
      const points = FIND_POINTS + (game.combo - 1) * COMBO_STEP;
      game.score += points;
      game.levelScore += points;
      say(game, `Found it! +${points} — ${d.label}`, '#ffd23d');
      if (game.hinted && game.hinted.diffIndex === i) game.hinted = null;
      if (isLevelDone(game)) finishLevel(game);
      return 'found';
    }
  }
  game.misses.push({ x, y, ttl: 0.7 });
  game.combo = 0;
  game.timeLeft = Math.max(0, game.timeLeft - MISS_PENALTY_SECONDS);
  game.shake = 1;
  say(game, `Not quite — ${MISS_PENALTY_SECONDS}s off the clock`, '#ff8f8f');
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = 'gameOver';
  }
  return 'miss';
}

/** Spend a hint: ring the next unfound difference for a few seconds. */
export function useHint(game) {
  if (game.screen !== 'playing') return false;
  if (game.hintsLeft <= 0) {
    say(game, 'No hints left on this level', '#ff8f8f');
    return false;
  }
  const scene = levelOf(game);
  const remaining = scene.diffs.map((_, i) => i).filter((i) => !game.found.includes(i));
  if (remaining.length === 0) return false;
  // Hint the difference nearest the centre of the ones still hidden, so the
  // ring lands somewhere useful instead of always on the first one.
  const pick = remaining[Math.floor(remaining.length / 2)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.levelScore = Math.max(0, game.levelScore - HINT_COST);
  game.hinted = { diffIndex: pick, ttl: 3.5 };
  say(game, `Hint: look near the ${describeZone(scene.diffs[pick])} (−${HINT_COST})`, '#8fd8ff');
  return true;
}

function describeZone(d) {
  const vertical = d.y < 140 ? 'top' : d.y > 280 ? 'bottom' : 'middle';
  const horizontal = d.x < 190 ? 'left' : d.x > 370 ? 'right' : 'centre';
  return `${vertical} ${horizontal}`;
}

/** Level cleared: time bonus, stars, and the next screen. */
function finishLevel(game) {
  const bonus = Math.round(game.timeLeft) * TIME_BONUS_PER_SECOND;
  game.levelBonus = bonus;
  game.score += bonus;
  const fraction = game.timeLeft / levelOf(game).timeLimit;
  const stars = fraction >= 0.45 ? 3 : fraction >= 0.25 ? 2 : 1;
  const id = levelOf(game).id;
  game.stars[id] = Math.max(game.stars[id] || 0, stars);
  if (game.levelIndex + 1 >= SCENES.length) {
    game.screen = 'allComplete';
  } else {
    game.screen = 'levelComplete';
  }
}

/** Stars (0..3) earned on a level, for the title screen's level cards. */
export function starsFor(game, levelIndex) {
  return game.stars[SCENES[levelIndex].id] || 0;
}

/** Whole-run summary for the final screen. */
export function totalStars(game) {
  return SCENES.reduce((sum, s) => sum + (game.stars[s.id] || 0), 0);
}
