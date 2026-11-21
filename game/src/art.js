// art.js — small shared vector-drawing helpers for the hand-drawn scenes.
// Every scene is drawn with these primitives plus its own composition, so both
// panels of a level share one style and only the planted differences vary.

/** Rounded-rectangle path, ready to fill or stroke. */
export function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** Filled circle. */
export function disc(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Four-point sparkle star, the kind drawn in storybooks. */
export function sparkle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Five-point star, for flags, jars and the night sky. */
export function star5(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Crescent moon. */
export function crescent(ctx, x, y, r, fill) {
  disc(ctx, x, y, r, fill);
  ctx.globalCompositeOperation = 'destination-out';
  disc(ctx, x + r * 0.45, y - r * 0.2, r * 0.85, '#000');
  ctx.globalCompositeOperation = 'source-over';
}

/** A paper lantern on a short string, glowing when lit. */
export function paperLantern(ctx, x, y, s, body, lit) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  if (lit) {
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 46);
    glow.addColorStop(0, 'rgba(255, 214, 130, 0.55)');
    glow.addColorStop(1, 'rgba(255, 214, 130, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-46, -46, 92, 92);
  }
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(0, -24);
  ctx.stroke();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(58, 43, 34, 0.55)';
  ctx.lineWidth = 1.5;
  for (const dy of [-14, -7, 0, 7, 14]) {
    ctx.beginPath();
    ctx.ellipse(0, dy, 19 - Math.abs(dy) * 0.28, 3.4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#3a2b22';
  ctx.fillRect(-7, -28, 14, 5);
  ctx.fillRect(-7, 23, 14, 5);
  ctx.restore();
}

/** A sitting cat silhouette, tail up or curled around its paws. */
export function sittingCat(ctx, x, y, s, coat, tailUp) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = coat;
  // body
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 26, 0, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -2, 24, 16, 0, 0, Math.PI);
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.arc(2, -34, 15, 0, Math.PI * 2);
  ctx.fill();
  // ears
  ctx.beginPath();
  ctx.moveTo(-9, -44);
  ctx.lineTo(-6, -56);
  ctx.lineTo(0, -46);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, -46);
  ctx.lineTo(12, -56);
  ctx.lineTo(15, -44);
  ctx.closePath();
  ctx.fill();
  // tail
  ctx.strokeStyle = coat;
  ctx.lineCap = 'round';
  if (tailUp) {
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(20, 8);
    ctx.quadraticCurveTo(38, 0, 34, -26);
    ctx.stroke();
  } else {
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(20, 8);
    ctx.quadraticCurveTo(34, 16, 12, 16);
    ctx.stroke();
  }
  // closed happy eye
  ctx.strokeStyle = '#1d1420';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(6, -35, 3, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.restore();
}

/** A round leafy tree with a short trunk. */
export function roundTree(ctx, x, y, s, leaf, trunk) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = trunk;
  ctx.fillRect(-5, -6, 10, 34);
  ctx.fillStyle = leaf;
  disc(ctx, -16, -22, 20, leaf);
  disc(ctx, 16, -22, 20, leaf);
  disc(ctx, 0, -38, 24, leaf);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  disc(ctx, -8, -44, 7, 'rgba(255,255,255,0.18)');
  ctx.restore();
}

/** A simple five-petal flower on a stem. */
export function flower(ctx, x, y, s, petal, centre) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#2f6b3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 18);
  ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i += 1) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    disc(ctx, Math.cos(a) * 7, Math.sin(a) * 7 - 4, 6, petal);
  }
  disc(ctx, 0, -4, 5, centre);
  ctx.restore();
}

/** A gull in flight: two curved wings. */
export function gull(ctx, x, y, s, ink) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.quadraticCurveTo(-5, -7, 0, 0);
  ctx.quadraticCurveTo(5, -7, 12, 0);
  ctx.stroke();
  ctx.restore();
}

/** A little sailboat with one triangular sail. */
export function sailboat(ctx, x, y, s, hull, sail) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#4a3226';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(0, 2);
  ctx.stroke();
  ctx.fillStyle = sail;
  ctx.beginPath();
  ctx.moveTo(2, -32);
  ctx.lineTo(2, -2);
  ctx.lineTo(24, -2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(-26, 2);
  ctx.lineTo(28, 2);
  ctx.lineTo(20, 14);
  ctx.lineTo(-18, 14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** A row of book spines on a shelf. */
export function bookRow(ctx, x, y, w, h, colors, leanAt) {
  const n = colors.length;
  const bw = w / n;
  for (let i = 0; i < n; i += 1) {
    const bx = x + i * bw;
    ctx.save();
    if (leanAt === i) {
      ctx.translate(bx + bw / 2, y + h);
      ctx.rotate(0.16);
      ctx.translate(-bw / 2, -h);
      ctx.fillStyle = colors[i];
      ctx.fillRect(0, 0, bw - 2, h);
    } else {
      ctx.fillStyle = colors[i];
      ctx.fillRect(bx, y, bw - 2, h);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(bx + 3, y + 5, bw - 8, 3);
    ctx.restore();
  }
}

/** A cog/gear with teeth. */
export function gear(ctx, x, y, r, teeth, fill, hole) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < teeth; i += 1) {
    const a = (i * Math.PI * 2) / teeth;
    const a2 = ((i + 0.5) * Math.PI * 2) / teeth;
    const a3 = ((i + 1) * Math.PI * 2) / teeth;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(a2) * r * 1.22, Math.sin(a2) * r * 1.22);
    ctx.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
  }
  ctx.closePath();
  ctx.fill();
  disc(ctx, 0, 0, r * 0.38, hole);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.62, Math.PI * 0.9, Math.PI * 1.5);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.stroke();
  ctx.restore();
}

/** A candle with a flame (or an unlit wick). */
export function candle(ctx, x, y, s, lit) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = '#f3e6c8';
  roundRect(ctx, -7, -4, 14, 30, 3);
  ctx.fill();
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(-9, 24, 18, 4);
  ctx.strokeStyle = '#3a2b22';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, -10);
  ctx.stroke();
  if (lit) {
    const glow = ctx.createRadialGradient(0, -18, 2, 0, -18, 26);
    glow.addColorStop(0, 'rgba(255, 196, 90, 0.7)');
    glow.addColorStop(1, 'rgba(255, 196, 90, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-26, -44, 52, 52);
    ctx.fillStyle = '#ffb63d';
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(7, -18, 0, -10);
    ctx.quadraticCurveTo(-7, -18, 0, -28);
    ctx.fill();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath();
    ctx.moveTo(0, -23);
    ctx.quadraticCurveTo(3.5, -17, 0, -12);
    ctx.quadraticCurveTo(-3.5, -17, 0, -23);
    ctx.fill();
  }
  ctx.restore();
}
