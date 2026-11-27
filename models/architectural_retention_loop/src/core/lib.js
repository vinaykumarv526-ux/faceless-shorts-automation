// 2D Flat Architectural Explainer Engine: Canvas, Palette, Math & Primitives
// Dimensions: 1080x1920 (Vertical 9:16, 30 FPS)
export const W = 1080, H = 1920, FPS = 30;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// Signature Palette strictly following the Visual Design Language
export const C = {
  cream: '#F4F1EA',          // Background Cream (Real-world / daytime scenes)
  bg: '#F4F1EA',             // Default background
  navy: '#0E1A2B',           // Blueprint Deep Navy (Internal cutaways)
  blueprintNavy: '#0F172A',  // Secondary Blueprint Slate Navy
  ink: '#1A1A1E',            // Technical Ink (Outlines, borders, text strokes)
  cyan: '#38BDF8',           // Technical Cyan (Flow paths, air/fluid vectors, blueprints)
  yellow: '#FFD43B',         // Attention Yellow (Keyword highlights, primary tags)
  red: '#EF4444',            // Hazard Red (Failure warnings, stress concentrations, Red X)
  green: '#10B981',          // Safety Green (Auto-correction, stability, passing checks)
  white: '#FFFFFF',          // Crisp white
  // Functional derived shades
  cyanDark: '#0284C7',
  cyanLight: '#BAE6FD',
  yellowDark: '#D97706',
  redDark: '#B91C1C',
  greenDark: '#047857',
  gridNavy: '#1E293B'
};

// ---------- Math & Interpolation ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TAU = Math.PI * 2;

// ---------- Primitives ----------
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill, stroke, strokeW = 0) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke && strokeW > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeW; ctx.stroke(); }
}
export function ell(x, y, rx, ry, fill, rot = 0) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
  ctx.fillStyle = fill; ctx.fill();
}
export function line(pts, color, w, dashed = false) {
  ctx.beginPath();
  if (dashed) ctx.setLineDash(Array.isArray(dashed) ? dashed : [10, 8]);
  else ctx.setLineDash([]);
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.setLineDash([]);
}
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-300, -300, W + 600, H + 600); }

/** Outlined bold text centered at (x, y) */
export function bigText(text, x, y, size, fill = C.white, rot = 0, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(6, size * 0.18); ctx.strokeStyle = C.ink; ctx.strokeText(text, 0, 0);
  ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}
