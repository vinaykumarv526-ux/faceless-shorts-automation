// Bespoke Vector Kit: Battery Fast Charging Architecture (batteryKit.js)
// Tailored exclusively to the dual-stage fast-charging mechanism
import { ctx, C, TAU, clamp, lerp, rr, circle, line, bigText } from './lib.js';
import { K } from './archKit.js';

export const BatteryKit = {
  /** Cut 1: Clean Hero Phone Exterior Overview */
  heroPhone(cx, cy, scale = 1, batteryPct = 80, isCharging = true, metricStr = '80%') {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    const w = 460, h = 760, r = 44;

    // Phone body
    ctx.fillStyle = '#161922';
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 5;
    rr(-w / 2, -h / 2, w, h, r);
    ctx.fill(); ctx.stroke();

    // Screen area
    ctx.fillStyle = C.blueprintNavy;
    rr(-w / 2 + 18, -h / 2 + 18, w - 36, h - 36, r - 12);
    ctx.fill();

    // Battery outline on screen
    const bw = 220, bh = 360;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    rr(-bw / 2, -bh / 2 - 16, bw, bh, 18);
    ctx.stroke();

    // Terminal nipple
    rr(-35, -bh / 2 - 34, 70, 18, 5);
    ctx.fillStyle = '#334155';
    ctx.fill();

    // Battery fill
    const fillH = (bh - 16) * (batteryPct / 100);
    const col = batteryPct > 80 ? C.yellow : C.cyan;
    ctx.fillStyle = col;
    rr(-bw / 2 + 8, -bh / 2 - 8 + (bh - 16 - fillH), bw - 16, fillH, 10);
    ctx.fill();

    // Large metric percentage
    ctx.fillStyle = C.white;
    ctx.font = '900 76px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(metricStr, 0, -16);

    // Charging bolt
    if (isCharging) {
      ctx.fillStyle = C.yellow;
      ctx.beginPath();
      ctx.moveTo(0, 95);
      ctx.lineTo(22, 60); ctx.lineTo(4, 60); ctx.lineTo(26, 20);
      ctx.lineTo(-22, 55); ctx.lineTo(-4, 55);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },

  /** Cut 2: Flawed Myth (Linear Supply / Water Glass) */
  linearSupplyMyth(cx, cy, scale = 1, fillRatio = 0.5) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Beaker / glass container
    const bw = 280, bh = 460;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-bw / 2, -bh / 2);
    ctx.lineTo(-bw / 2, bh / 2);
    ctx.lineTo(bw / 2, bh / 2);
    ctx.lineTo(bw / 2, -bh / 2);
    ctx.stroke();

    // Liquid fill
    const fill = clamp(fillRatio);
    const wh = (bh - 10) * fill;
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(-bw / 2 + 6, bh / 2 - wh, bw - 12, wh);

    // Stream
    if (fill < 0.98) {
      ctx.fillStyle = C.cyan;
      ctx.fillRect(-14, -bh / 2 - 120, 28, bh / 2 + 120 - wh);
    }
    ctx.restore();
  },

  /** Cut 3: Failure Mode (Anode Saturation & Overheat Warning) */
  anodeOverheatFailure(cx, cy, scale = 1, isRed = false, lt = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Graphite anode layers
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    for (let i = -3; i <= 3; i++) {
      line([[-300, i * 55], [300, i * 55]], '#334155', 4);
    }

    // Crowding Lithium ions
    const numIons = 28;
    for (let i = 0; i < numIons; i++) {
      const ix = Math.sin(i * 1.7 + lt * 3) * 220;
      const iy = Math.cos(i * 2.3 + lt * 4) * 140;
      circle(ix, iy, 14, isRed ? C.red : C.yellow);
    }

    if (isRed) {
      // Red pulsing bounding box
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 10;
      const pulse = (lt * 8) % 1;
      rr(-340 - pulse * 20, -200 - pulse * 20, 680 + pulse * 40, 400 + pulse * 40, 20);
      ctx.stroke();
      K.redX(0, 0, 1.2, 0.85);
    }
    ctx.restore();
  },

  /** Cut 4: Architectural Secret (PMIC Controller Motherboard) */
  dualPhasePmicCutaway(cx, cy, scale = 1, isPhase2 = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const sz = 340;
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 4;
    rr(-sz / 2, -sz / 2, sz, sz, 18);
    ctx.fill(); ctx.stroke();

    // Central IC chip
    ctx.fillStyle = '#020617';
    rr(-110, -110, 220, 220, 12);
    ctx.fill();

    ctx.fillStyle = C.white;
    ctx.font = '800 32px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('DUAL-PHASE', 0, -22);
    ctx.fillStyle = C.cyan;
    ctx.fillText('PMIC CORE', 0, 22);

    // Radiating bus traces
    for (let i = 0; i < 8; i++) {
      const an = (i / 8) * Math.PI * 2;
      const x1 = Math.cos(an) * (sz / 2);
      const y1 = Math.sin(an) * (sz / 2);
      const x2 = Math.cos(an) * (sz / 2 + 90);
      const y2 = Math.sin(an) * (sz / 2 + 90);
      line([[x1, y1], [x2, y2]], isPhase2 ? C.yellow : C.cyan, 3.5);
      circle(x2, y2, 6, isPhase2 ? C.yellow : C.cyan);
    }
    ctx.restore();
  },

  /** Cut 5: Dynamics / Flow (Constant Current Channels) */
  constantCurrentFlux(cx, cy, scale = 1, lt = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    for (let col = -1; col <= 1; col++) {
      const x = col * 160;
      line([[x, -240], [x, 240]], '#1E293B', 10);
      // Fast traveling energy packets
      for (let p = 0; p < 6; p++) {
        const py = -240 + ((lt * 900 + p * 90) % 480);
        circle(x, py, 11, C.cyan);
        line([[x, py], [x, Math.max(-240, py - 35)]], C.cyan, 5);
      }
    }
    ctx.restore();
  },

  /** Cut 6: Self-Balancing Feedback Governor */
  feedbackGovernorGauge(cx, cy, scale = 1, stepped = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const r = 180;
    circle(0, 0, r, '#0A1220', '#1E293B', 12);

    const progress = stepped ? 0.35 : 0.88;
    ctx.strokeStyle = stepped ? C.yellow : C.cyan;
    ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI, -Math.PI + Math.PI * progress);
    ctx.stroke();

    ctx.fillStyle = C.white;
    ctx.font = '900 64px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(stepped ? '15W' : '45W', 0, -18);

    ctx.fillStyle = stepped ? C.yellow : C.cyan;
    ctx.font = '700 28px Inter';
    ctx.fillText(stepped ? 'THROTTLED' : 'MAX FLUX', 0, 36);
    ctx.restore();
  },

  /** Cut 7: Telemetry Radar Sensor Grid */
  microControllerTelemetry(cx, cy, scale = 1, lt = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const maxR = 210;
    for (let i = 1; i <= 3; i++) {
      circle(0, 0, (maxR / 3) * i, null, '#1E293B', 2.5);
    }
    // Radar sweep arm
    const ang = (lt * 5) % TAU;
    line([[0, 0], [Math.cos(ang) * maxR, Math.sin(ang) * maxR]], C.cyan, 3.5);

    // Telemetry blips
    for (let b = 0; b < 5; b++) {
      const ban = b * 1.25;
      const br = 60 + b * 28;
      const bx = Math.cos(ban) * br, by = Math.sin(ban) * br;
      circle(bx, by, 6, C.cyan);
    }
    ctx.restore();
  },

  /** Cut 8: Core Efficiency Metric Gauge */
  coreEfficiencyMetricBadge(cx, cy, scale = 1, metricStr = '90%', labelStr = 'HEALTH PRESERVED') {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const r = 200;
    circle(0, 0, r, '#0B1728', '#1E293B', 12);

    ctx.strokeStyle = C.green;
    ctx.lineWidth = 16; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.9);
    ctx.stroke();

    ctx.fillStyle = C.white;
    ctx.font = '900 96px Inter';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(metricStr, 0, -24);

    ctx.fillStyle = C.green;
    ctx.font = '700 30px Inter';
    ctx.fillText(labelStr, 0, 42);
    ctx.restore();
  },

  /** Cut 9: Protective Shield Verdict (Loops to Cut 1) */
  protectiveShieldVerdict(cx, cy, scale = 1, lt = 0, metricStr = '80%') {
    ctx.save();
    BatteryKit.heroPhone(cx, cy, scale, 80, true, metricStr);

    // Green protective safety shield outline
    const sp = Math.sin(lt * 6) * 8;
    ctx.strokeStyle = C.green;
    ctx.lineWidth = 5;
    rr(cx - 250 - sp / 2, cy - 400 - sp / 2, 500 + sp, 800 + sp, 48);
    ctx.stroke();
    ctx.restore();
  }
};
