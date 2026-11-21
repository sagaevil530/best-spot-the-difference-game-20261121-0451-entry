// scenes.js — the five original levels. Each scene draws itself twice: once for
// the left panel (right = false) and once for the right panel (right = true).
// A difference is a small branch inside the draw: the left variant and the right
// variant of one detail, at the x/y/r the diffs list records for hit-testing.
// Panel space is 560 x 400. Nothing here is random, so both panels always match
// except for the planted differences, and screenshots are reproducible.

import { disc, sparkle, star5, crescent, paperLantern, sittingCat, roundTree, flower, gull, sailboat, bookRow, gear, candle, roundRect } from './art.js';

export const PANEL_W = 560;
export const PANEL_H = 400;

function nightSky(ctx, top, bottom, stars) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  for (const [x, y, r] of stars) sparkle(ctx, x, y, r, 'rgba(255, 244, 200, 0.9)');
}

function ground(ctx, y, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, y, PANEL_W, PANEL_H - y);
}

// ---------------------------------------------------------------------------
// Level 1 — Lantern Garden (5 differences, 150 seconds)
// ---------------------------------------------------------------------------
const gardenStars = [[40, 40, 4], [120, 70, 3], [200, 36, 4], [330, 52, 3], [520, 90, 3], [90, 130, 2.5], [250, 110, 2.5], [420, 140, 2.5], [500, 200, 2.5], [30, 200, 2.5]];

function drawGarden(ctx, right) {
  nightSky(ctx, '#1b1440', '#3d2b6b', gardenStars);
  crescent(ctx, 470, 62, 30, '#ffeeb0');
  if (right) disc(ctx, 452, 52, 4, '#d9b96a'); // difference: extra moon crater
  // distant hills
  ctx.fillStyle = '#2c2154';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(140, 240, 300, 292);
  ctx.quadraticCurveTo(440, 330, 560, 282);
  ctx.lineTo(560, 400);
  ctx.lineTo(0, 400);
  ctx.closePath();
  ctx.fill();
  // pond, bottom left
  ctx.fillStyle = '#2f6f8f';
  ctx.beginPath();
  ctx.ellipse(110, 352, 96, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(220, 240, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(96, 348, 40, 9, 0, 0.2, Math.PI * 1.4);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(128, 362, 26, 6, 0, 0.4, Math.PI * 1.2);
  ctx.stroke();
  // stone wall
  ctx.fillStyle = '#6b5a72';
  ctx.fillRect(0, 306, PANEL_W, 94);
  ctx.fillStyle = '#7d6c84';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(i * 72 + 6, 312, 60, 10);
  ctx.fillStyle = '#5d4f63';
  ctx.fillRect(0, 306, PANEL_W, 6);
  // fence posts and lanterns
  for (const lx of [90, 280, 470]) {
    ctx.fillStyle = '#3a2b22';
    ctx.fillRect(lx - 3, 216, 6, 92);
  }
  paperLantern(ctx, 90, 196, 1, '#ffb63d', true);
  paperLantern(ctx, 280, 196, 1, right ? '#ff7d9c' : '#ffb63d', true); // difference: middle lantern colour
  paperLantern(ctx, 470, 196, 1, '#ffb63d', true);
  // cat on the wall, right side — ginger, so it reads against the purple wall
  sittingCat(ctx, 500, 300, 0.9, '#e8a34a', !right); // difference: tail up (left) vs curled (right)
  // flowers along the wall base
  flower(ctx, 60, 356, 0.9, '#ff8fb0', '#ffd23d');
  flower(ctx, 200, 366, 0.8, '#c9a7ff', '#ffd23d');
  if (!right) flower(ctx, 340, 360, 0.9, '#ff8fb0', '#ffd23d'); // difference: a flower missing on the right
  flower(ctx, 420, 368, 0.8, '#8fd8ff', '#ffd23d');
  flower(ctx, 540, 360, 0.9, '#c9a7ff', '#ffd23d');
  // fireflies
  disc(ctx, 150, 250, 3, '#ffe97a');
  disc(ctx, 330, 270, 3, '#ffe97a');
  disc(ctx, 420, 240, 2.5, '#ffe97a');
  if (right) disc(ctx, 205, 176, 3, '#ffe97a'); // difference: an extra firefly
  // grass tufts
  ctx.strokeStyle = '#4d8a52';
  ctx.lineWidth = 2;
  for (const [gx, gy] of [[30, 392], [250, 394], [380, 390], [510, 394]]) {
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx - 4, gy - 10);
    ctx.moveTo(gx + 4, gy);
    ctx.lineTo(gx + 6, gy - 9);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Level 2 — Harbour at Dusk (6 differences, 140 seconds)
// ---------------------------------------------------------------------------
function drawHarbour(ctx, right) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, '#3a2a63');
  g.addColorStop(0.55, '#c65f6e');
  g.addColorStop(1, '#f2a35e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // low sun
  disc(ctx, 420, 190, 34, '#ffd98a');
  disc(ctx, 420, 190, 46, 'rgba(255, 217, 138, 0.25)');
  // clouds
  ctx.fillStyle = 'rgba(255, 205, 170, 0.5)';
  ctx.beginPath();
  ctx.ellipse(140, 70, 70, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(300, 46, 54, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // gulls — one extra on the right
  gull(ctx, 250, 80, 1, '#2c2138');
  gull(ctx, 330, 60, 0.8, '#2c2138');
  if (right) gull(ctx, 440, 84, 0.9, '#2c2138'); // difference: an extra gull
  // sea
  ctx.fillStyle = '#2e4a72';
  ctx.fillRect(0, 210, PANEL_W, 190);
  ctx.strokeStyle = 'rgba(255, 220, 170, 0.55)';
  ctx.lineWidth = 2;
  for (const [wx, wy, wl] of [[60, 250, 70], [200, 290, 90], [380, 260, 80], [480, 320, 70], [120, 340, 80]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 7, wx + wl, wy);
    ctx.stroke();
  }
  // lighthouse on the left rocks
  ctx.fillStyle = '#5b4a68';
  ctx.beginPath();
  ctx.moveTo(30, 400);
  ctx.lineTo(60, 250);
  ctx.lineTo(140, 250);
  ctx.lineTo(170, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#efe6d8';
  ctx.beginPath();
  ctx.moveTo(72, 250);
  ctx.lineTo(78, 200);
  ctx.lineTo(122, 200);
  ctx.lineTo(128, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c65f6e';
  ctx.beginPath();
  ctx.moveTo(75, 225);
  ctx.lineTo(125, 225);
  ctx.lineTo(127, 250);
  ctx.lineTo(73, 250);
  ctx.closePath();
  ctx.fill();
  // lighthouse lamp room
  ctx.fillStyle = '#3a2b22';
  ctx.fillRect(74, 168, 52, 32);
  ctx.fillStyle = right ? '#4a4038' : '#ffe27a'; // difference: lamp window lit (left) vs dark (right)
  ctx.fillRect(82, 174, 36, 20);
  ctx.fillStyle = '#3a2b22';
  ctx.beginPath();
  ctx.moveTo(70, 168);
  ctx.lineTo(100, 146);
  ctx.lineTo(130, 168);
  ctx.closePath();
  ctx.fill();
  // flag on the lighthouse — points left on the left panel, right on the right
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 146);
  ctx.lineTo(100, 128);
  ctx.stroke();
  ctx.fillStyle = '#ff5a5a';
  ctx.beginPath();
  if (right) {
    ctx.moveTo(100, 128);
    ctx.lineTo(122, 133);
    ctx.lineTo(100, 138);
  } else {
    ctx.moveTo(100, 128);
    ctx.lineTo(78, 133);
    ctx.lineTo(100, 138);
  }
  ctx.closePath();
  ctx.fill();
  // light beam — only on the left panel
  if (!right) {
    const beam = ctx.createLinearGradient(118, 184, 320, 150);
    beam.addColorStop(0, 'rgba(255, 226, 122, 0.5)');
    beam.addColorStop(1, 'rgba(255, 226, 122, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(118, 172);
    ctx.lineTo(320, 132);
    ctx.lineTo(320, 196);
    ctx.lineTo(118, 196);
    ctx.closePath();
    ctx.fill();
  }
  // boats
  sailboat(ctx, 330, 250, 1, '#7a3b2e', right ? '#ff5a5a' : '#f5efdd'); // difference: sail colour
  sailboat(ctx, 470, 300, 0.7, '#3e5a7a', '#f5efdd');
  // pier and crates, bottom right
  ctx.fillStyle = '#6b4a30';
  ctx.fillRect(380, 330, 180, 16);
  ctx.fillStyle = '#5d3f28';
  for (const px of [400, 460, 520]) ctx.fillRect(px, 346, 8, 30);
  ctx.fillStyle = '#b98a4a';
  ctx.fillRect(420, 296, 34, 34);
  ctx.fillRect(456, 296, 34, 34);
  ctx.strokeStyle = '#7a5a30';
  ctx.lineWidth = 2;
  ctx.strokeRect(420, 296, 34, 34);
  ctx.strokeRect(456, 296, 34, 34);
  if (right) { // difference: a third crate stacked on the right
    ctx.fillStyle = '#b98a4a';
    ctx.fillRect(438, 262, 34, 34);
    ctx.strokeRect(438, 262, 34, 34);
  }
  // anchor leaning on the pier
  ctx.strokeStyle = '#2c2138';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(530, 300, 12, 0.4, Math.PI * 2.4);
  ctx.moveTo(530, 288);
  ctx.lineTo(530, 322);
  ctx.moveTo(518, 312);
  ctx.lineTo(542, 312);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 3 — The Old Bookshop (7 differences, 130 seconds)
// ---------------------------------------------------------------------------
function drawBookshop(ctx, right) {
  // warm interior wall and floor
  ctx.fillStyle = '#8a5f43';
  ctx.fillRect(0, 0, PANEL_W, 290);
  ctx.fillStyle = '#6b4a30';
  ctx.fillRect(0, 290, PANEL_W, 110);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let y = 310; y < 400; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }
  // window with the moon
  ctx.fillStyle = '#2c2138';
  roundRect(ctx, 30, 36, 120, 130, 8);
  ctx.fill();
  ctx.fillStyle = '#1b1440';
  ctx.fillRect(38, 44, 104, 114);
  crescent(ctx, 96, 84, 22, '#ffeeb0');
  sparkle(ctx, 120, 60, 3, '#fff4c8');
  sparkle(ctx, 60, 120, 2.5, '#fff4c8');
  ctx.strokeStyle = '#2c2138';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(90, 44);
  ctx.lineTo(90, 158);
  ctx.moveTo(38, 101);
  ctx.lineTo(142, 101);
  ctx.stroke();
  // framed picture: a moon on the left, a sun on the right
  ctx.fillStyle = '#d9b96a';
  ctx.fillRect(170, 50, 70, 54);
  ctx.fillStyle = '#f5efdd';
  ctx.fillRect(175, 55, 60, 44);
  if (right) {
    disc(ctx, 205, 77, 12, '#ffb63d'); // difference: sun instead of moon
    ctx.strokeStyle = '#ffb63d';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(205 + Math.cos(a) * 16, 77 + Math.sin(a) * 16);
      ctx.lineTo(205 + Math.cos(a) * 21, 77 + Math.sin(a) * 21);
      ctx.stroke();
    }
  } else {
    crescent(ctx, 205, 77, 12, '#7a86c9');
  }
  // wall clock
  disc(ctx, 470, 74, 30, '#f5efdd');
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(470, 74, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (right) { // difference: the clock reads 4:30 on the right, 3:00 on the left
    ctx.moveTo(470, 74);
    ctx.lineTo(470, 54);
    ctx.moveTo(470, 74);
    ctx.lineTo(452, 74);
  } else {
    ctx.moveTo(470, 74);
    ctx.lineTo(470, 56);
    ctx.moveTo(470, 74);
    ctx.lineTo(486, 74);
  }
  ctx.stroke();
  disc(ctx, 470, 74, 3, '#3a2b22');
  // shelves with books
  ctx.fillStyle = '#5d3f28';
  ctx.fillRect(160, 140, 240, 10);
  ctx.fillRect(160, 220, 240, 10);
  bookRow(ctx, 168, 108, 224, 32, ['#c65f6e', '#3e7a5a', '#c9a227', '#3e5a7a', '#7a4a8a', '#b95a2e'], -1);
  // one book changes colour on the right panel
  ctx.fillStyle = right ? '#3e5a7a' : '#c65f6e';
  ctx.fillRect(168, 108, 35, 32);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(171, 113, 29, 3);
  bookRow(ctx, 168, 188, 224, 32, ['#3e7a5a', '#c9a227', '#7a4a8a', '#c65f6e', '#3e5a7a', '#b95a2e'], 3);
  // rug
  ctx.fillStyle = '#a34a4a';
  roundRect(ctx, 150, 320, 260, 56, 10);
  ctx.fill();
  ctx.fillStyle = right ? '#3e7a5a' : '#d9b96a'; // difference: rug stripe colour
  ctx.fillRect(170, 340, 220, 10);
  ctx.fillStyle = '#f5efdd';
  ctx.fillRect(170, 330, 220, 3);
  ctx.fillRect(170, 356, 220, 3);
  // sleeping cat on the rug
  ctx.save();
  ctx.translate(280, 348);
  ctx.fillStyle = '#e8a34a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(30, -6, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(20, -14);
  ctx.lineTo(23, -24);
  ctx.lineTo(29, -15);
  ctx.closePath();
  ctx.fill();
  if (right) { // difference: the cat's ear is folded on the right
    ctx.beginPath();
    ctx.moveTo(36, -14);
    ctx.lineTo(40, -16);
    ctx.lineTo(42, -8);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(36, -15);
    ctx.lineTo(40, -25);
    ctx.lineTo(44, -14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#7a5a30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-6, 4, 8, 0.3, Math.PI * 1.2);
  ctx.stroke();
  ctx.restore();
  // table with teapot
  ctx.fillStyle = '#5d3f28';
  ctx.fillRect(420, 250, 110, 10);
  ctx.fillRect(428, 260, 8, 60);
  ctx.fillRect(514, 260, 8, 60);
  ctx.fillStyle = '#3e7a5a';
  ctx.beginPath();
  ctx.ellipse(475, 240, 26, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3e7a5a';
  ctx.beginPath();
  ctx.moveTo(498, 232);
  ctx.quadraticCurveTo(514, 232, 510, 246);
  ctx.stroke();
  ctx.strokeStyle = '#3e7a5a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(498, 234);
  ctx.quadraticCurveTo(512, 234, 508, 248);
  ctx.stroke();
  ctx.fillStyle = '#2f5a44';
  ctx.fillRect(471, 220, 8, 6);
  if (!right) { // difference: steam rises from the teapot only on the left
    ctx.strokeStyle = 'rgba(245, 239, 221, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(468, 214);
    ctx.quadraticCurveTo(462, 202, 468, 192);
    ctx.moveTo(480, 214);
    ctx.quadraticCurveTo(486, 202, 480, 190);
    ctx.stroke();
  }
  // potted plant, bottom right corner — one extra leaf on the right
  ctx.fillStyle = '#b95a2e';
  ctx.beginPath();
  ctx.moveTo(500, 356);
  ctx.lineTo(540, 356);
  ctx.lineTo(534, 388);
  ctx.lineTo(506, 388);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2f6b3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(520, 356);
  ctx.quadraticCurveTo(500, 330, 492, 312);
  ctx.moveTo(520, 356);
  ctx.quadraticCurveTo(520, 326, 520, 306);
  ctx.moveTo(520, 356);
  ctx.quadraticCurveTo(540, 330, 548, 314);
  ctx.stroke();
  if (right) {
    ctx.beginPath();
    ctx.moveTo(520, 356);
    ctx.quadraticCurveTo(530, 332, 556, 330);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------------------
// Level 4 — Starlight Picnic (8 differences, 120 seconds)
// ---------------------------------------------------------------------------
function drawPicnic(ctx, right) {
  nightSky(ctx, '#141033', '#2c4a5e', [[50, 50, 4], [150, 40, 3], [260, 70, 3.5], [380, 44, 3], [500, 60, 4], [90, 110, 2.5], [320, 110, 2.5], [450, 130, 2.5]]);
  // one star is five-pointed on the right, a sparkle on the left
  if (right) star5(ctx, 486, 52, 7, '#fff4c8');
  else sparkle(ctx, 486, 52, 7, '#fff4c8');
  // moon
  disc(ctx, 80, 60, 24, '#ffeeb0');
  // big tree on the left
  roundTree(ctx, 90, 250, 1.4, '#2f6b3a', '#4a3226');
  // tent on the right
  ctx.fillStyle = '#c65f6e';
  ctx.beginPath();
  ctx.moveTo(400, 300);
  ctx.lineTo(470, 180);
  ctx.lineTo(540, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8a3a4a';
  ctx.beginPath();
  ctx.moveTo(470, 180);
  ctx.lineTo(470, 300);
  ctx.lineTo(500, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2b22';
  ctx.beginPath();
  ctx.moveTo(448, 300);
  ctx.lineTo(470, 252);
  ctx.lineTo(492, 300);
  ctx.closePath();
  ctx.fill();
  // tent flag — red on the left, gold on the right
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(470, 180);
  ctx.lineTo(470, 156);
  ctx.stroke();
  ctx.fillStyle = right ? '#ffd23d' : '#ff5a5a';
  ctx.beginPath();
  ctx.moveTo(470, 156);
  ctx.lineTo(492, 161);
  ctx.lineTo(470, 166);
  ctx.closePath();
  ctx.fill();
  // telescope beside the tent — points up on the left, level on the right
  ctx.save();
  ctx.translate(400, 260);
  ctx.rotate(right ? 0.05 : -0.5);
  ctx.fillStyle = '#7a86c9';
  roundRect(ctx, -8, -34, 16, 68, 6);
  ctx.fill();
  ctx.fillStyle = '#3e5a7a';
  ctx.fillRect(-8, -40, 16, 8);
  ctx.restore();
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(400, 260);
  ctx.lineTo(392, 300);
  ctx.moveTo(400, 260);
  ctx.lineTo(408, 300);
  ctx.stroke();
  // meadow
  ground(ctx, 300, '#2f6b3a');
  ctx.fillStyle = '#357a40';
  ctx.beginPath();
  ctx.ellipse(280, 310, 220, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // picnic blanket
  ctx.fillStyle = '#f5efdd';
  ctx.save();
  ctx.translate(280, 348);
  ctx.rotate(-0.03);
  ctx.fillRect(-110, -26, 220, 52);
  ctx.fillStyle = '#c65f6e';
  ctx.fillRect(-110, -26, 220, 10);
  if (!right) ctx.fillRect(-110, 6, 220, 10); // difference: a red stripe missing on the right
  ctx.fillStyle = '#c65f6e';
  ctx.fillRect(-110, 16, 220, 10);
  ctx.restore();
  // sandwiches on the blanket — three on the left, two on the right
  for (const sx of [212, 240, 268]) {
    if (right && sx === 268) continue;
    ctx.fillStyle = '#f3e6c8';
    ctx.save();
    ctx.translate(sx, 336);
    ctx.rotate(0.4);
    ctx.fillRect(-11, -7, 22, 14);
    ctx.restore();
    ctx.fillStyle = '#7a9a4a';
    ctx.fillRect(sx - 9, 332, 18, 3);
  }
  // basket with a handle that stands up on the left and lies flat on the right
  ctx.fillStyle = '#b98a4a';
  roundRect(ctx, 330, 330, 46, 26, 6);
  ctx.fill();
  ctx.strokeStyle = '#7a5a30';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (right) {
    ctx.moveTo(334, 332);
    ctx.lineTo(372, 332);
  } else {
    ctx.moveTo(334, 332);
    ctx.quadraticCurveTo(353, 306, 372, 332);
  }
  ctx.stroke();
  // firefly jar — glowing on the left, dark on the right
  ctx.fillStyle = right ? 'rgba(120, 140, 160, 0.5)' : 'rgba(255, 233, 122, 0.85)';
  roundRect(ctx, 396, 326, 26, 32, 6);
  ctx.fill();
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2;
  roundRect(ctx, 396, 326, 26, 32, 6);
  ctx.stroke();
  ctx.fillStyle = '#3a2b22';
  ctx.fillRect(400, 320, 18, 6);
  // mushroom near the tree — only on the right
  if (right) {
    ctx.fillStyle = '#f5efdd';
    ctx.fillRect(128, 344, 8, 16);
    ctx.fillStyle = '#ff5a5a';
    ctx.beginPath();
    ctx.arc(132, 344, 13, Math.PI, 0);
    ctx.fill();
    disc(ctx, 128, 338, 2, '#fff');
    disc(ctx, 137, 341, 2, '#fff');
  }
  // fireflies over the meadow
  disc(ctx, 180, 300, 3, '#ffe97a');
  disc(ctx, 330, 296, 2.5, '#ffe97a');
  disc(ctx, 520, 330, 3, '#ffe97a');
}

// ---------------------------------------------------------------------------
// Level 5 — Clockwork Attic (9 differences, 110 seconds)
// ---------------------------------------------------------------------------
function drawAttic(ctx, right) {
  // attic wall and floor
  ctx.fillStyle = '#7a5a40';
  ctx.fillRect(0, 0, PANEL_W, 300);
  ctx.fillStyle = '#5d4028';
  ctx.fillRect(0, 300, PANEL_W, 100);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1;
  for (let y = 320; y < 400; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(PANEL_W, y);
    ctx.stroke();
  }
  // roof beams
  ctx.fillStyle = '#4a3226';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(120, 0);
  ctx.lineTo(0, 90);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(PANEL_W, 0);
  ctx.lineTo(PANEL_W - 120, 0);
  ctx.lineTo(PANEL_W, 90);
  ctx.closePath();
  ctx.fill();
  // round window with the moon — a star on the right instead
  disc(ctx, 486, 66, 34, '#2c2138');
  disc(ctx, 486, 66, 28, '#1b1440');
  if (right) star5(ctx, 486, 66, 14, '#fff4c8');
  else crescent(ctx, 486, 66, 14, '#ffeeb0');
  // cobweb in the top-left corner — only on the left
  if (!right) {
    ctx.strokeStyle = 'rgba(245, 239, 221, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i += 1) {
      const a = (i * Math.PI) / 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 64, Math.sin(a) * 64);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI / 2);
    ctx.arc(0, 0, 44, 0, Math.PI / 2);
    ctx.arc(0, 0, 62, 0, Math.PI / 2);
    ctx.stroke();
  }
  // the big clock
  disc(ctx, 280, 120, 64, '#f5efdd');
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(280, 120, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 0; i < 12; i += 1) {
    const a = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.moveTo(280 + Math.cos(a) * 54, 120 + Math.sin(a) * 54);
    ctx.lineTo(280 + Math.cos(a) * 60, 120 + Math.sin(a) * 60);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // difference: the clock reads 10:10 on the left, 2:40 on the right
  if (right) {
    ctx.moveTo(280, 120);
    ctx.lineTo(306, 92);
    ctx.moveTo(280, 120);
    ctx.lineTo(252, 142);
  } else {
    ctx.moveTo(280, 120);
    ctx.lineTo(256, 94);
    ctx.moveTo(280, 120);
    ctx.lineTo(304, 94);
  }
  ctx.stroke();
  disc(ctx, 280, 120, 5, '#3a2b22');
  // gears — one tooth missing on the right's small gear
  gear(ctx, 130, 250, 42, 8, '#c9a227', '#7a5a30');
  gear(ctx, 200, 300, 30, right ? 7 : 8, '#8a97a8', '#4a3226'); // difference: a missing tooth
  gear(ctx, 420, 280, 36, 8, '#b95a2e', '#5d3f28');
  // owl on the beam
  ctx.fillStyle = '#4a3226';
  ctx.fillRect(380, 150, 110, 12);
  ctx.fillStyle = '#8a6a4a';
  ctx.beginPath();
  ctx.ellipse(436, 128, 20, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(436, 100, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(424, 90);
  ctx.lineTo(426, 80);
  ctx.lineTo(432, 88);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(440, 88);
  ctx.lineTo(446, 80);
  ctx.lineTo(448, 90);
  ctx.closePath();
  ctx.fill();
  if (right) { // difference: the owl's eyes are closed on the right
    ctx.strokeStyle = '#1d1420';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(430, 100, 4, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(442, 100, 4, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  } else {
    disc(ctx, 430, 100, 4.5, '#ffd23d');
    disc(ctx, 442, 100, 4.5, '#ffd23d');
    disc(ctx, 430, 100, 2, '#1d1420');
    disc(ctx, 442, 100, 2, '#1d1420');
  }
  ctx.fillStyle = '#ffb63d';
  ctx.beginPath();
  ctx.moveTo(432, 108);
  ctx.lineTo(440, 108);
  ctx.lineTo(436, 114);
  ctx.closePath();
  ctx.fill();
  // workbench with tools
  ctx.fillStyle = '#5d3f28';
  ctx.fillRect(60, 330, 240, 12);
  ctx.fillRect(70, 342, 10, 46);
  ctx.fillRect(280, 342, 10, 46);
  // a key on the bench — only on the left
  if (!right) {
    ctx.strokeStyle = '#d9b96a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(220, 322, 6, 0, Math.PI * 2);
    ctx.moveTo(226, 322);
    ctx.lineTo(244, 322);
    ctx.moveTo(238, 322);
    ctx.lineTo(238, 328);
    ctx.stroke();
  }
  // book stack — three books on the left, two on the right
  ctx.fillStyle = '#3e7a5a';
  ctx.fillRect(330, 316, 56, 14);
  ctx.fillStyle = '#c65f6e';
  ctx.fillRect(334, 302, 48, 14);
  if (!right) {
    ctx.fillStyle = '#3e5a7a';
    ctx.fillRect(338, 288, 40, 14);
  }
  // lantern on the floor — amber on the left, teal on the right
  paperLantern(ctx, 90, 360, 0.9, right ? '#5ac9c9' : '#ffb63d', true);
  // candle on the bench — lit on the left, out on the right
  candle(ctx, 500, 322, 1, !right);
}

// ---------------------------------------------------------------------------
// The level list, in play order.
// ---------------------------------------------------------------------------
export const SCENES = [
  {
    id: 'garden', name: 'Lantern Garden', timeLimit: 150, draw: drawGarden,
    blurb: 'A quiet garden under the moon. Five small things changed.',
    diffs: [
      { x: 280, y: 196, r: 26, label: 'the middle lantern turned rose' },
      { x: 500, y: 290, r: 24, label: 'the cat curled its tail down' },
      { x: 340, y: 360, r: 18, label: 'a flower went missing' },
      { x: 452, y: 52, r: 20, label: 'a new crater on the moon' },
      { x: 205, y: 176, r: 15, label: 'an extra firefly' },
    ],
  },
  {
    id: 'harbour', name: 'Harbour at Dusk', timeLimit: 140, draw: drawHarbour,
    blurb: 'The sun is setting over the pier. Six things changed.',
    diffs: [
      { x: 200, y: 165, r: 30, label: 'the lighthouse beam went dark' },
      { x: 330, y: 240, r: 26, label: 'the sail turned red' },
      { x: 440, y: 84, r: 16, label: 'an extra gull' },
      { x: 455, y: 279, r: 22, label: 'a third crate appeared' },
      { x: 100, y: 133, r: 18, label: 'the flag blows the other way' },
      { x: 100, y: 184, r: 14, label: 'the lamp window went dark' },
    ],
  },
  {
    id: 'bookshop', name: 'The Old Bookshop', timeLimit: 130, draw: drawBookshop,
    blurb: 'Dust, books and a sleeping cat. Seven things changed.',
    diffs: [
      { x: 470, y: 74, r: 26, label: 'the clock moved to half past four' },
      { x: 186, y: 124, r: 16, label: 'a book changed colour' },
      { x: 475, y: 202, r: 18, label: 'the teapot stopped steaming' },
      { x: 312, y: 334, r: 16, label: 'the cat folded an ear' },
      { x: 280, y: 345, r: 20, label: 'the rug stripe turned green' },
      { x: 540, y: 330, r: 16, label: 'the plant grew an extra leaf' },
      { x: 205, y: 77, r: 22, label: 'the moon picture became a sun' },
    ],
  },
  {
    id: 'picnic', name: 'Starlight Picnic', timeLimit: 120, draw: drawPicnic,
    blurb: 'Supper under the stars. Eight things changed.',
    diffs: [
      { x: 268, y: 336, r: 18, label: 'a sandwich vanished' },
      { x: 400, y: 226, r: 24, label: 'the telescope points level now' },
      { x: 481, y: 161, r: 16, label: 'the tent flag turned gold' },
      { x: 486, y: 52, r: 14, label: 'a star grew five points' },
      { x: 353, y: 322, r: 18, label: 'the basket handle lies flat' },
      { x: 132, y: 346, r: 16, label: 'a mushroom sprouted' },
      { x: 280, y: 354, r: 18, label: 'a blanket stripe went missing' },
      { x: 409, y: 342, r: 16, label: 'the firefly jar went dark' },
    ],
  },
  {
    id: 'attic', name: 'Clockwork Attic', timeLimit: 110, draw: drawAttic,
    blurb: 'Gears, an owl and one big clock. Nine things changed.',
    diffs: [
      { x: 280, y: 120, r: 30, label: 'the big clock reads a new time' },
      { x: 436, y: 100, r: 20, label: 'the owl closed its eyes' },
      { x: 200, y: 300, r: 24, label: 'a gear lost a tooth' },
      { x: 40, y: 40, r: 22, label: 'the cobweb vanished' },
      { x: 500, y: 304, r: 14, label: 'the candle went out' },
      { x: 232, y: 322, r: 14, label: 'a key vanished from the bench' },
      { x: 358, y: 295, r: 20, label: 'a book left the stack' },
      { x: 90, y: 360, r: 18, label: 'the lantern turned teal' },
      { x: 486, y: 66, r: 18, label: 'the moon became a star' },
    ],
  },
];
