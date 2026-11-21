// render.js — draws the whole game on one 1280x720 canvas: header, timer bar,
// the two panels, footer buttons and the title / end screens. It also owns the
// layout, so main.js can hit-test buttons and panels from the same numbers.

import { PANEL_W, PANEL_H, SCENES } from './scenes.js';
import { foundCount, starsFor, totalStars } from './game.js';
import { roundRect, disc, star5 } from './art.js';

export const VIEW_W = 1280;
export const VIEW_H = 720;

const PANEL_Y = 104;
const LEFT_X = 60;
const RIGHT_X = 660;
const HEADER_H = 64;
const TIMER_H = 12;

const TITLE_FONT = 'Georgia, "Times New Roman", serif';
const UI_FONT = '"Trebuchet MS", Verdana, sans-serif';

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function button(ctx, b, hover) {
  ctx.save();
  if (hover) {
    ctx.shadowColor = 'rgba(255, 210, 61, 0.8)';
    ctx.shadowBlur = 14;
  }
  ctx.fillStyle = b.primary ? '#ffb63d' : '#2e2447';
  roundRect(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = b.primary ? '#8a5a1d' : '#6b5a9a';
  ctx.lineWidth = 2;
  roundRect(ctx, b.x, b.y, b.w, b.h, 12);
  ctx.stroke();
  ctx.fillStyle = b.primary ? '#2b1d0a' : '#f5efdd';
  ctx.font = `bold ${b.small ? 15 : 18}px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2 + (b.sub ? -8 : 0));
  if (b.sub) {
    ctx.font = `13px ${UI_FONT}`;
    ctx.fillStyle = b.primary ? '#5d3f1d' : '#b8a8d8';
    ctx.fillText(b.sub, b.x + b.w / 2, b.y + b.h / 2 + 13);
  }
  ctx.restore();
}

function isHover(game, id) {
  return game.hover && game.hover.kind === 'button' && game.hover.id === id;
}

/** The clickable layout for the current screen, in logical coordinates. */
export function layoutFor(game) {
  const footerY = 540;
  const buttons = [];
  if (game.screen === 'playing') {
    buttons.push({ id: 'hint', x: 500, y: footerY, w: 150, h: 52, label: `💡 Hint (${game.hintsLeft})`, sub: 'H key · −50 pts' });
    buttons.push({ id: 'sound', x: 670, y: footerY, w: 120, h: 52, label: game.muted ? '🔇 Sound off' : '🔊 Sound on', small: true });
    buttons.push({ id: 'restart', x: 810, y: footerY, w: 120, h: 52, label: '↻ Restart', small: true });
    buttons.push({ id: 'menu', x: 950, y: footerY, w: 120, h: 52, label: '☰ Levels', small: true });
  } else if (game.screen === 'title') {
    for (let i = 0; i < SCENES.length; i += 1) {
      buttons.push({ id: `level-${i}`, x: 60 + i * 236, y: 470, w: 216, h: 110, label: SCENES[i].name, sub: `${SCENES[i].diffs.length} differences · ${fmtTime(SCENES[i].timeLimit)}` });
    }
  } else if (game.screen === 'levelComplete') {
    buttons.push({ id: 'next', x: 500, y: 520, w: 280, h: 56, label: 'Next level →', primary: true });
    buttons.push({ id: 'replay', x: 500, y: 592, w: 136, h: 48, label: '↻ Replay', small: true });
    buttons.push({ id: 'menu', x: 644, y: 592, w: 136, h: 48, label: '☰ Levels', small: true });
  } else if (game.screen === 'gameOver') {
    buttons.push({ id: 'retry', x: 500, y: 500, w: 280, h: 56, label: 'Try again', primary: true });
    buttons.push({ id: 'menu', x: 500, y: 572, w: 280, h: 48, label: '☰ Back to levels', small: true });
  } else if (game.screen === 'allComplete') {
    buttons.push({ id: 'menu', x: 500, y: 540, w: 280, h: 56, label: '☰ Back to levels', primary: true });
  }
  return {
    buttons,
    panels: [
      { x: LEFT_X, y: PANEL_Y, w: PANEL_W, h: PANEL_H, side: 'left' },
      { x: RIGHT_X, y: PANEL_Y, w: PANEL_W, h: PANEL_H, side: 'right' },
    ],
  };
}

function drawPanelFrame(ctx, x, y) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#0e0a1a';
  roundRect(ctx, x - 6, y - 6, PANEL_W + 12, PANEL_H + 12, 14);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#6b5a9a';
  ctx.lineWidth = 2;
  roundRect(ctx, x - 6, y - 6, PANEL_W + 12, PANEL_H + 12, 14);
  ctx.stroke();
}

function drawMarker(ctx, x, y, r, found, recent, time) {
  const pulse = recent ? 1 + Math.sin(time * 6) * 0.08 : 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);
  ctx.strokeStyle = '#ffd23d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 210, 61, 0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
  ctx.stroke();
  // check mark
  ctx.strokeStyle = '#ffd23d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, 0);
  ctx.lineTo(-r * 0.1, r * 0.4);
  ctx.lineTo(r * 0.5, -r * 0.4);
  ctx.stroke();
  ctx.restore();
}

function drawSceneInto(ctx, game, scene, right, x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, PANEL_W, PANEL_H);
  ctx.clip();
  ctx.translate(x, y);
  const shakeX = game.shake > 0 ? (Math.sin(game.time * 40) * 3 * game.shake) : 0;
  ctx.translate(shakeX, 0);
  scene.draw(ctx, right);
  // found markers on both panels
  game.found.forEach((di, order) => {
    const d = scene.diffs[di];
    drawMarker(ctx, d.x, d.y, d.r, true, order === game.found.length - 1, game.time);
  });
  // hint ring on both panels
  if (game.hinted) {
    const d = scene.diffs[game.hinted.diffIndex];
    const pulse = 1 + Math.sin(game.time * 8) * 0.15;
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = 'rgba(143, 216, 255, 0.95)';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, d.r + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  // fading red X marks for misses
  for (const m of game.misses) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, m.ttl / 0.7);
    ctx.strokeStyle = '#ff6a6a';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m.x - 12, m.y - 12);
    ctx.lineTo(m.x + 12, m.y + 12);
    ctx.moveTo(m.x + 12, m.y - 12);
    ctx.lineTo(m.x - 12, m.y + 12);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawHeader(ctx, game) {
  const scene = SCENES[game.levelIndex];
  ctx.fillStyle = '#1d1533';
  ctx.fillRect(0, 0, VIEW_W, HEADER_H);
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 26px ${TITLE_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏮 Lantern Light', 24, HEADER_H / 2);
  ctx.fillStyle = '#b8a8d8';
  ctx.font = `16px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`Level ${game.levelIndex + 1} · ${scene.name}`, VIEW_W / 2, HEADER_H / 2 - 10);
  ctx.font = `13px ${UI_FONT}`;
  ctx.fillText(scene.blurb, VIEW_W / 2, HEADER_H / 2 + 12);
  ctx.fillStyle = '#f5efdd';
  ctx.font = `bold 22px ${UI_FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(`Score ${game.score}`, VIEW_W - 24, HEADER_H / 2);
}

function drawTimerBar(ctx, game) {
  const scene = SCENES[game.levelIndex];
  const frac = Math.max(0, game.timeLeft / scene.timeLimit);
  ctx.fillStyle = '#0e0a1a';
  ctx.fillRect(0, HEADER_H, VIEW_W, TIMER_H);
  const color = frac > 0.5 ? '#7ac74f' : frac > 0.25 ? '#ffb63d' : '#ff6a6a';
  ctx.fillStyle = color;
  ctx.fillRect(0, HEADER_H, VIEW_W * frac, TIMER_H);
  ctx.fillStyle = frac > 0.25 ? '#2b1d0a' : '#fff';
  ctx.font = `bold 15px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = game.screen === 'playing' ? fmtTime(game.timeLeft) : '—';
  ctx.fillText(label, VIEW_W / 2, HEADER_H + TIMER_H / 2 + 0.5);
  if (game.screen === 'playing' && game.timeLeft <= 10 && Math.floor(game.time * 2) % 2 === 0) {
    ctx.fillStyle = '#ff6a6a';
    ctx.font = `bold 15px ${UI_FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText('Hurry!', VIEW_W - 24, HEADER_H + TIMER_H / 2 + 0.5);
  }
}

function drawFooter(ctx, game, layout) {
  const scene = SCENES[game.levelIndex];
  // found counter
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5efdd';
  ctx.font = `bold 26px ${UI_FONT}`;
  ctx.fillText(`Found ${foundCount(game)} / ${scene.diffs.length}`, 60, 566);
  // dots for each difference
  for (let i = 0; i < scene.diffs.length; i += 1) {
    const cx = 60 + i * 26;
    ctx.beginPath();
    ctx.arc(cx + 8, 600, 8, 0, Math.PI * 2);
    if (game.found.includes(i)) {
      ctx.fillStyle = '#ffd23d';
      ctx.fill();
    } else {
      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.strokeStyle = '#6b5a9a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#b8a8d8';
  ctx.font = `14px ${UI_FONT}`;
  ctx.fillText('Click a difference on either picture. A wrong click costs 5 seconds.', 60, 640);
  ctx.fillText('H — hint   ·   R — restart level   ·   M — sound', 60, 664);
  for (const b of layout.buttons) button(ctx, b, isHover(game, b.id));
  if (game.message) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, game.message.ttl);
    ctx.fillStyle = game.message.color;
    ctx.font = `bold 20px ${UI_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(game.message.text, VIEW_W / 2, 520);
    ctx.restore();
  }
}

function drawPlayScreen(ctx, game, layout) {
  const scene = SCENES[game.levelIndex];
  ctx.fillStyle = '#141021';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawHeader(ctx, game);
  drawTimerBar(ctx, game);
  // panel captions
  ctx.fillStyle = '#b8a8d8';
  ctx.font = `bold 14px ${UI_FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('◀  LEFT', LEFT_X, PANEL_Y - 10);
  ctx.textAlign = 'right';
  ctx.fillText('RIGHT  ▶', RIGHT_X + PANEL_W, PANEL_Y - 10);
  drawPanelFrame(ctx, LEFT_X, PANEL_Y);
  drawPanelFrame(ctx, RIGHT_X, PANEL_Y);
  drawSceneInto(ctx, game, scene, false, LEFT_X, PANEL_Y);
  drawSceneInto(ctx, game, scene, true, RIGHT_X, PANEL_Y);
  drawFooter(ctx, game, layout);
}

function dimBackdrop(ctx) {
  ctx.fillStyle = 'rgba(10, 6, 20, 0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function card(ctx, x, y, w, h) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#241b3d';
  roundRect(ctx, x, y, w, h, 20);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#6b5a9a';
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 20);
  ctx.stroke();
}

function drawStarsRow(ctx, cx, y, earned, size) {
  for (let i = 0; i < 3; i += 1) {
    const x = cx + (i - 1) * (size * 1.5);
    star5(ctx, x, y, size, i < earned ? '#ffd23d' : '#4a3f6b');
  }
}

function drawTitleScreen(ctx, game, layout) {
  // the garden scene behind the title, dimmed
  const scene = SCENES[0];
  const ghost = { ...game, found: [], misses: [], hinted: null, message: null, shake: 0 };
  ctx.fillStyle = '#141021';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.save();
  ctx.globalAlpha = 0.4;
  drawSceneInto(ctx, ghost, scene, false, LEFT_X, 40);
  drawSceneInto(ctx, ghost, scene, true, RIGHT_X, 40);
  ctx.restore();
  ctx.fillStyle = 'rgba(16, 10, 30, 0.55)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 64px ${TITLE_FONT}`;
  ctx.fillText('🏮 Lantern Light', VIEW_W / 2, 150);
  ctx.fillStyle = '#f5efdd';
  ctx.font = `bold 30px ${TITLE_FONT}`;
  ctx.fillText('Spot the Difference', VIEW_W / 2, 200);
  ctx.fillStyle = '#cbbdf0';
  ctx.font = `18px ${UI_FONT}`;
  ctx.fillText('Two pictures hang side by side. Something changed between them — find every difference before the lanterns burn down.', VIEW_W / 2, 248);
  ctx.fillText('Click a difference on either picture. Wrong clicks cost 5 seconds. Hints cost 50 points.', VIEW_W / 2, 276);
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 20px ${UI_FONT}`;
  ctx.fillText('Choose a scene to begin — five nights, five hunts', VIEW_W / 2, 330);
  // level cards
  for (const b of layout.buttons) {
    const i = Number(b.id.split('-')[1]);
    const stars = starsFor(game, i);
    ctx.save();
    if (isHover(game, b.id)) {
      ctx.shadowColor = 'rgba(255, 210, 61, 0.8)';
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = '#2e2447';
    roundRect(ctx, b.x, b.y, b.w, b.h, 14);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#6b5a9a';
    ctx.lineWidth = 2;
    roundRect(ctx, b.x, b.y, b.w, b.h, 14);
    ctx.stroke();
    ctx.fillStyle = '#f5efdd';
    ctx.font = `bold 17px ${UI_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${i + 1}. ${SCENES[i].name}`, b.x + b.w / 2, b.y + 26);
    ctx.fillStyle = '#b8a8d8';
    ctx.font = `14px ${UI_FONT}`;
    ctx.fillText(b.sub, b.x + b.w / 2, b.y + 52);
    drawStarsRow(ctx, b.x + b.w / 2, b.y + 86, stars, 11);
    ctx.restore();
  }
  ctx.fillStyle = '#8a7ab0';
  ctx.font = `14px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Best score is kept on this computer. Every scene is drawn fresh for this game — no two hunts are alike.', VIEW_W / 2, 620);
}

function drawLevelComplete(ctx, game, layout) {
  drawPlayScreen(ctx, game, layout);
  dimBackdrop(ctx);
  const stars = starsFor(game, game.levelIndex);
  card(ctx, 390, 130, 500, 460);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 40px ${TITLE_FONT}`;
  ctx.fillText('Level Complete!', 640, 200);
  drawStarsRow(ctx, 640, 260, stars, 22);
  ctx.fillStyle = '#f5efdd';
  ctx.font = `20px ${UI_FONT}`;
  ctx.fillText(`${SCENES[game.levelIndex].name} — all ${SCENES[game.levelIndex].diffs.length} differences found`, 640, 310);
  ctx.fillStyle = '#cbbdf0';
  ctx.font = `18px ${UI_FONT}`;
  ctx.fillText(`Finds  ${game.levelScore} pts`, 640, 356);
  ctx.fillText(`Time bonus  +${game.levelBonus} pts`, 640, 386);
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 22px ${UI_FONT}`;
  ctx.fillText(`Total score  ${game.score}`, 640, 424);
  for (const b of layout.buttons) button(ctx, b, isHover(game, b.id));
}

function drawGameOver(ctx, game, layout) {
  drawPlayScreen(ctx, game, layout);
  dimBackdrop(ctx);
  card(ctx, 390, 160, 500, 400);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff8f8f';
  ctx.font = `bold 40px ${TITLE_FONT}`;
  ctx.fillText('Out of Time!', 640, 240);
  ctx.fillStyle = '#f5efdd';
  ctx.font = `20px ${UI_FONT}`;
  ctx.fillText(`The lanterns burned down with ${foundCount(game)} of ${SCENES[game.levelIndex].diffs.length} differences found.`, 640, 300);
  ctx.fillStyle = '#cbbdf0';
  ctx.font = `18px ${UI_FONT}`;
  ctx.fillText('The differences are still there, waiting. Try the level again.', 640, 336);
  for (const b of layout.buttons) button(ctx, b, isHover(game, b.id));
}

function drawAllComplete(ctx, game, layout) {
  drawPlayScreen(ctx, game, layout);
  dimBackdrop(ctx);
  card(ctx, 340, 110, 600, 480);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 44px ${TITLE_FONT}`;
  ctx.fillText('🏮 Every Difference Found!', 640, 190);
  drawStarsRow(ctx, 640, 250, Math.min(3, Math.round(totalStars(game) / 5)), 22);
  ctx.fillStyle = '#f5efdd';
  ctx.font = `20px ${UI_FONT}`;
  ctx.fillText('All five nights are solved — the garden, the harbour, the bookshop,', 640, 300);
  ctx.fillText('the picnic and the attic. You are the sharpest eyes in the lantern light.', 640, 330);
  ctx.fillStyle = '#ffd23d';
  ctx.font = `bold 24px ${UI_FONT}`;
  ctx.fillText(`Final score  ${game.score}      ★ ${totalStars(game)} / 15`, 640, 390);
  ctx.fillStyle = '#cbbdf0';
  ctx.font = `17px ${UI_FONT}`;
  ctx.fillText('Play again any time — the scenes are waiting for another careful look.', 640, 430);
  for (const b of layout.buttons) button(ctx, b, isHover(game, b.id));
}

/** Draw the current screen. */
export function drawGame(ctx, game) {
  const layout = layoutFor(game);
  if (game.screen === 'title') drawTitleScreen(ctx, game, layout);
  else if (game.screen === 'levelComplete') drawLevelComplete(ctx, game, layout);
  else if (game.screen === 'gameOver') drawGameOver(ctx, game, layout);
  else if (game.screen === 'allComplete') drawAllComplete(ctx, game, layout);
  else drawPlayScreen(ctx, game, layout);
  return layout;
}
