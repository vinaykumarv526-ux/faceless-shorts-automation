// 2D Flat Architectural Explainer Engine: Core Technical Kit (K)
// Implements blueprint borders, calipers, Fresnel arcs, callout tags & pill badges
import { ctx, C, W, H, TAU, clamp, rr, circle, line } from './lib.js';

export const K = {
  /** Technical Blueprint Grid with Corner Markers */
  drawGrid(alpha = 0.12, color = C.cyan) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha;
    const step = 80;
    for (let x = 0; x <= W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // Technical corner calipers
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.45;
    const m = 60, l = 32;
    // Top-left
    ctx.beginPath(); ctx.moveTo(m, m + l); ctx.lineTo(m, m); ctx.lineTo(m + l, m); ctx.stroke();
    // Top-right
    ctx.beginPath(); ctx.moveTo(W - m - l, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + l); ctx.stroke();
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(m, H - m - l); ctx.lineTo(m, H - m); ctx.lineTo(m + l, H - m); ctx.stroke();
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(W - m - l, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - l); ctx.stroke();
    ctx.restore();
  },

  /** Standard Architectural Blueprint Border: centered box (-450, -360, 900, 720, 28) */
  blueprintFrame(cx = 540, cy = 760, w = 900, h = 720, r = 28, bg = C.blueprintNavy, border = C.cyan) {
    ctx.save();
    ctx.translate(cx, cy);
    rr(-w / 2, -h / 2, w, h, r);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = border;
    ctx.stroke();

    // Inner subtle guide border
    rr(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, r - 8);
    ctx.lineWidth = 1;
    ctx.strokeStyle = border;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    ctx.restore();
  },

  /** Pill Badge: K.pill(text, x, y, size, bg, fg, sc) */
  pill(text, x, y, size = 32, bg = C.navy, fg = C.cyan, sc = 1) {
    if (sc <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.font = `700 ${size}px Inter`;
    ctx.letterSpacing = '1px';
    const tw = ctx.measureText(text).width;
    const w = tw + size * 1.2, h = size * 1.6;
    rr(-w / 2, -h / 2, w, h, 8);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = fg;
    ctx.stroke();
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.letterSpacing = '0px';
    ctx.restore();
  },

  /** Schematic Tag with Leader Line: K.tag(label, x, y, tx, ty, size, bg, fg) */
  tag(label, x, y, tx = null, ty = null, size = 30, bg = '#0E1A2B', fg = C.cyan, sc = 1) {
    if (sc <= 0) return;
    if (tx !== null && ty !== null) {
      ctx.save();
      ctx.globalAlpha = clamp(sc);
      line([[x, y], [tx, ty]], fg, 3, [6, 4]);
      circle(tx, ty, 5, fg);
      ctx.restore();
    }
    K.pill(label, x, y, size, bg, fg, sc);
  },

  /** Measurement Caliper with dashed guides and metric text */
  caliper(x1, y1, x2, y2, label, offset = 40, color = C.cyan) {
    ctx.save();
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 1e-4) { ctx.restore(); return; }
    const nx = -dy / len * offset, ny = dx / len * offset;

    const ox1 = x1 + nx, oy1 = y1 + ny;
    const ox2 = x2 + nx, oy2 = y2 + ny;

    // Witness lines
    line([[x1, y1], [ox1, oy1]], color, 1.5, [4, 4]);
    line([[x2, y2], [ox2, oy2]], color, 1.5, [4, 4]);

    // Dimension line with end ticks
    line([[ox1, oy1], [ox2, oy2]], color, 2);
    const tick = 10;
    line([[ox1 - ny / offset * tick, oy1 + nx / offset * tick], [ox1 + ny / offset * tick, oy1 - nx / offset * tick]], color, 2);
    line([[ox2 - ny / offset * tick, oy2 + nx / offset * tick], [ox2 + ny / offset * tick, oy2 - nx / offset * tick]], color, 2);

    // Label pill in center
    const mx = (ox1 + ox2) / 2, my = (ox1 + ox2) / 2;
    K.pill(label, (ox1 + ox2) / 2, (oy1 + oy2) / 2, 24, C.navy, color);
    ctx.restore();
  },

  /** Red Hazard X Symbol */
  redX(x, y, s = 1, alpha = 1) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    // Dark outline stroke
    ctx.strokeStyle = C.ink; ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.moveTo(-90, -90); ctx.lineTo(90, 90);
    ctx.moveTo(90, -90); ctx.lineTo(-90, 90);
    ctx.stroke();
    // Inner red stroke
    ctx.strokeStyle = C.red; ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(-90, -90); ctx.lineTo(90, 90);
    ctx.moveTo(90, -90); ctx.lineTo(-90, 90);
    ctx.stroke();
    ctx.restore();
  },

  /** Hazard Warning Triangle */
  warning(x, y, s = 1) {
    if (s <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, -90); ctx.lineTo(85, 60); ctx.lineTo(-85, 60); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    // Exclamation point
    ctx.fillStyle = C.ink;
    ctx.fillRect(-6, -45, 12, 50);
    circle(0, 28, 7, C.ink);
    ctx.restore();
  },

  /** Fresnel Lens Groove Arc */
  fresnelArc(cx, cy, r, count = 4, color = C.cyan, alpha = 0.3) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, r + i * 14, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }
};
