// Inside Out: 9-Cut Viral Architectural Retention Loop
// Clean 2D technical vector cutaways, dark/light contrast, schematic tags, word-synced captions
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, rr, circle, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';

// --- Technical Vector Primitives ---
function drawGrid(alpha = 0.12) {
  ctx.save();
  ctx.strokeStyle = '#4FD1E8';
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha;
  const step = 80;
  for (let x = 0; x <= W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  // Tech corner markers
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.4;
  const m = 60, l = 30;
  // Top-left
  ctx.beginPath(); ctx.moveTo(m, m + l); ctx.lineTo(m, m); ctx.lineTo(m + l, m); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(W - m - l, m); ctx.lineTo(W - m, m); ctx.lineTo(W - m, m + l); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(m, H - m - l); ctx.lineTo(m, H - m); ctx.lineTo(m + l, H - m); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(W - m - l, H - m); ctx.lineTo(W - m, H - m); ctx.lineTo(W - m, H - m - l); ctx.stroke();
  ctx.restore();
}

function techTag(label, x, y, color = C.cyan, bg = '#0E1A2B') {
  ctx.save();
  ctx.font = '700 32px Inter';
  const tw = ctx.measureText(label).width;
  ctx.fillStyle = bg;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  rr(x - tw / 2 - 20, y - 26, tw + 40, 52, 8);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
  ctx.restore();
}

function phoneFrame(cx, cy, scale = 1, batteryPct = 80, isCharging = true) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  const w = 480, h = 880, r = 50;
  // Phone body
  ctx.fillStyle = '#1A1A1E';
  ctx.strokeStyle = C.cyan;
  ctx.lineWidth = 6;
  rr(-w / 2, -h / 2, w, h, r);
  ctx.fill(); ctx.stroke();

  // Screen area
  ctx.fillStyle = '#0B1622';
  rr(-w / 2 + 20, -h / 2 + 20, w - 40, h - 40, r - 15);
  ctx.fill();

  // Battery icon on screen
  const bw = 240, bh = 420;
  ctx.strokeStyle = '#3A4D6B';
  ctx.lineWidth = 6;
  rr(-bw / 2, -bh / 2 - 20, bw, bh, 20);
  ctx.stroke();
  // Terminal tip
  rr(-40, -bh / 2 - 40, 80, 20, 6);
  ctx.fillStyle = '#3A4D6B';
  ctx.fill();

  // Battery fill
  const fillH = (bh - 20) * (batteryPct / 100);
  const col = batteryPct > 80 ? C.yellow : C.cyan;
  ctx.fillStyle = col;
  rr(-bw / 2 + 10, -bh / 2 - 10 + (bh - 20 - fillH), bw - 20, fillH, 12);
  ctx.fill();

  // Percentage text
  ctx.fillStyle = C.white;
  ctx.font = '900 80px Inter';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(batteryPct)}%`, 0, -20);

  // Lightning bolt if charging
  if (isCharging) {
    ctx.fillStyle = C.yellow;
    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.lineTo(25, 70); ctx.lineTo(5, 70); ctx.lineTo(30, 25);
    ctx.lineTo(-25, 65); ctx.lineTo(-5, 65);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── Cut 1: Hook (Jump to 80% then crawls) ───────────────────────────
  {
    const st = cut(0), t80 = Wd('eighty', 0) - st, tRest = Wd('forty', 0) - st;
    add({
      id: 'S01', at: st, cam: [540, 960], note: 'Phone charges to 80% rapidly then crawls',
      draw(lt) {
        ctx.fillStyle = '#080E18'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.15);
        let pct = 0;
        if (lt < t80) {
          pct = lerp(0, 80, eo(clamp(lt / (t80 || 1))));
        } else {
          pct = 80 + clamp((lt - t80) / (tRest - t80 + 0.1)) * 3; // crawls slowly to 83%
        }
        phoneFrame(540, 920, 1.25, pct, true);
        techTag('[DUAL-STAGE BATTERY ARCHITECTURE]', 540, 280, C.cyan);
        if (lt > t80) {
          techTag('STAGE 1: 0-80% IN 20 MIN (HIGH SPEED)', 540, 360, C.cyan);
        }
        if (lt > tRest) {
          techTag('STAGE 2: 80-100% IN 40 MIN (THROTTLED)', 540, 440, C.yellow);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + 0.3, 'zip'); cue(st + t80, 'tock');
  }

  // ── Cut 2: The Flawed Myth (Water filling glass) ───────────────────
  {
    const st = cut(1), tFlow = Wd('water', 1) - st;
    add({
      id: 'S02', at: st, cam: [540, 960], note: 'Myth: linear water filling glass',
      draw(lt) {
        ctx.fillStyle = '#0A121F'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.12);
        techTag('[THE FLAWED MYTH: LINEAR SUPPLY]', 540, 320, C.white);
        // Beaker / glass
        const bx = 540, by = 980, bw = 320, bh = 540;
        ctx.strokeStyle = '#4A6588'; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2, by - bh / 2);
        ctx.lineTo(bx - bw / 2, by + bh / 2);
        ctx.lineTo(bx + bw / 2, by + bh / 2);
        ctx.lineTo(bx + bw / 2, by - bh / 2);
        ctx.stroke();

        // Water stream pouring down
        const fill = clamp(lt / 3.8);
        const wh = bh * fill;
        ctx.fillStyle = '#38B6FF';
        ctx.fillRect(bx - bw / 2 + 8, by + bh / 2 - wh, bw - 16, wh);

        // Pour stream
        if (fill < 0.98) {
          ctx.fillRect(bx - 18, 380, 36, (by + bh / 2 - wh) - 380);
        }
        techTag('ASSUMPTION: 100% CONSTANT VELOCITY', 540, 1420, '#38B6FF');
      }
    });
    cue(st, 'whoosh'); cue(st + tFlow, 'bubbles', { dur: 2.0 });
  }

  // ── Cut 3: The Failure Point (Ions Crowding & Overheat) ────────────
  {
    const st = cut(2), tCrowd = Wd('crowd', 2) - st, tHeat = Wd('overheat', 2) - st;
    add({
      id: 'S03', at: st, cam: [540, 960], note: 'Ions crowd anode, warning flash and Red X',
      draw(lt) {
        const isRed = lt > tHeat;
        ctx.fillStyle = isRed ? '#24080B' : '#0B1320'; ctx.fillRect(0, 0, W, H);
        drawGrid(isRed ? 0.25 : 0.12);
        techTag('[CRITICAL FAILURE: ANODE SATURATION]', 540, 300, C.red);

        // Graphite anode grid
        const gy = 860;
        ctx.strokeStyle = '#4A5B73'; ctx.lineWidth = 4;
        for (let i = -3; i <= 3; i++) {
          line([[240, gy + i * 70], [840, gy + i * 70]], '#4A5B73', 4);
        }

        // Crowding ions
        const numIons = 30;
        for (let i = 0; i < numIons; i++) {
          const ix = 540 + Math.sin(i * 1.7 + lt * 3) * 260;
          const iy = gy + Math.cos(i * 2.3 + lt * 4) * 180;
          circle(ix, iy, 16, isRed ? C.red : C.yellow);
        }

        if (lt > tHeat) {
          techTag('DANGER: THERMAL RUNAWAY RISK', 540, 1340, C.red, '#4A0D14');
          // Red warning pulses
          ctx.strokeStyle = C.red; ctx.lineWidth = 12;
          const pulse = (lt * 8) % 1;
          rr(180 - pulse * 30, gy - 240 - pulse * 30, 720 + pulse * 60, 480 + pulse * 60, 24);
          ctx.stroke();
          // Red X
          bigText('CRITICAL OVERHEAT', 540, 860, 72, C.red);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + tHeat, 'alarm', { dur: 2.0 }); cue(st + tHeat + 0.3, 'slam');
  }

  // ── Cut 4: The Architectural Secret (Dual-Phase Circuit) ───────────
  {
    const st = cut(3), tSwitch = Wd('flips', 3) - st;
    add({
      id: 'S04', at: st, cam: [540, 960], note: 'Dual phase circuit board blueprint',
      draw(lt) {
        ctx.fillStyle = '#06101D'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.2);
        techTag('[ARCHITECTURAL SCHEMATIC: PMIC CONTROLLER]', 540, 300, C.cyan);

        // Motherboard chip
        const cx = 540, cy = 920, sz = 380;
        ctx.fillStyle = '#102238'; ctx.strokeStyle = C.cyan; ctx.lineWidth = 5;
        rr(cx - sz / 2, cy - sz / 2, sz, sz, 20);
        ctx.fill(); ctx.stroke();

        // IC Chip center
        ctx.fillStyle = '#091524';
        rr(cx - 130, cy - 130, 260, 260, 14);
        ctx.fill();
        ctx.fillStyle = C.white; ctx.font = '800 36px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('DUAL-PHASE', cx, cy - 25);
        ctx.fillStyle = C.cyan;
        ctx.fillText('POWER IC', cx, cy + 25);

        // Mode switch indicators
        const isPhase2 = lt > tSwitch;
        techTag(isPhase2 ? 'ACTIVE: PHASE 2 (CV MODE)' : 'ACTIVE: PHASE 1 (CC MODE)', 540, 1360, isPhase2 ? C.yellow : C.cyan);

        // Traces radiating out
        for (let i = 0; i < 8; i++) {
          const an = (i / 8) * Math.PI * 2;
          const x1 = cx + Math.cos(an) * (sz / 2);
          const y1 = cy + Math.sin(an) * (sz / 2);
          const x2 = cx + Math.cos(an) * (sz / 2 + 120);
          const y2 = cy + Math.sin(an) * (sz / 2 + 120);
          line([[x1, y1], [x2, y2]], isPhase2 ? C.yellow : C.cyan, 4);
          circle(x2, y2, 8, isPhase2 ? C.yellow : C.cyan);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + tSwitch, 'pop', { gain: 0.8 });
  }

  // ── Cut 5: Dynamics / Flow (Constant Current) ─────────────────────
  {
    const st = cut(4), tWatts = Wd('forty', 4) - st;
    add({
      id: 'S05', at: st, cam: [540, 960], note: 'Constant current high velocity flow',
      draw(lt) {
        ctx.fillStyle = '#071220'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.15);
        techTag('[PHASE 1: 0-80% CONSTANT CURRENT]', 540, 300, C.cyan);

        // Large high-speed flow pipes
        const py = 920, pw = 760, ph = 400;
        ctx.strokeStyle = '#274468'; ctx.lineWidth = 6;
        rr(540 - pw / 2, py - ph / 2, pw, ph, 16);
        ctx.stroke();

        // High velocity ion particles racing across
        for (let i = 0; i < 28; i++) {
          const speed = 750;
          const px = ((i * 80 + lt * speed) % pw) + (540 - pw / 2);
          const row = (i % 5) - 2;
          circle(px, py + row * 60, 14, C.cyan);
          // Trail
          line([[px - 40, py + row * 60], [px, py + row * 60]], C.cyan, 6);
        }

        techTag('RATE: 45W MAXIMUM FLOW SPEED', 540, 1360, C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + 0.2, 'zip');
  }

  // ── Cut 6: Self-Balancing Loop (Thermal Feedback Governor) ─────────
  {
    const st = cut(5), tDrop = Wd('steps', 5) - st;
    add({
      id: 'S06', at: st, cam: [540, 960], note: 'Governor steps down wattage curve',
      draw(lt) {
        ctx.fillStyle = '#081424'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.18);
        techTag('[PHASE 2: CLOSED-LOOP THERMAL THROTTLING]', 540, 300, C.yellow);

        // Step-down graph
        const gx = 220, gy = 1100, gw = 640, gh = 420;
        // Axes
        line([[gx, gy - gh], [gx, gy], [gx + gw, gy]], '#476385', 5);

        // Power curve steps down
        const progress = clamp(lt / 3.5);
        ctx.strokeStyle = C.yellow; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(gx, gy - gh * 0.85); // 45W
        ctx.lineTo(gx + gw * 0.4, gy - gh * 0.85); // 0-80%
        // Step down
        ctx.lineTo(gx + gw * 0.65, gy - gh * 0.45); // down to 20W
        ctx.lineTo(gx + gw * 0.95, gy - gh * 0.15); // down to 5W trickle
        ctx.stroke();

        // Tracker dot
        const dotX = gx + gw * progress;
        let dotY = gy - gh * 0.85;
        if (progress > 0.4 && progress <= 0.65) dotY = lerp(gy - gh * 0.85, gy - gh * 0.45, (progress - 0.4) / 0.25);
        else if (progress > 0.65) dotY = lerp(gy - gh * 0.45, gy - gh * 0.15, (progress - 0.65) / 0.3);
        circle(dotX, dotY, 18, C.white);

        const currentWatts = progress < 0.4 ? '45W' : progress < 0.65 ? '20W' : '5W';
        techTag(`POWER OUTPUT: ${currentWatts} (AUTO-BALANCED)`, 540, 1380, C.yellow);
      }
    });
    cue(st, 'whoosh'); cue(st + tDrop, 'tock');
  }

  // ── Cut 7: Engine X-Ray (60Hz Microcontroller Sensor) ──────────────
  {
    const st = cut(6), tSixty = Wd('sixty', 6) - st;
    add({
      id: 'S07', at: st, cam: [540, 960], note: 'Microcontroller pulses at 60Hz',
      draw(lt) {
        ctx.fillStyle = '#05101E'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.2);
        techTag('[INTERNAL HARDWARE: THERMAL SENSOR IC]', 540, 300, C.cyan);

        // Central sensor eye
        const cx = 540, cy = 920;
        circle(cx, cy, 90, '#102B47');
        circle(cx, cy, 60, '#1D4A78');
        circle(cx, cy, 30, C.cyan);

        // 60Hz pulse waves radiating outward
        for (let i = 0; i < 4; i++) {
          const r = ((lt * 3 + i * 0.6) % 2.4) * 160;
          ctx.strokeStyle = C.cyan; ctx.lineWidth = 4;
          ctx.globalAlpha = Math.max(0, 1 - r / 380);
          circle(cx, cy, r, 'transparent');
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // HUD telemetry readouts
        techTag('FREQUENCY: 60 CYCLES / SEC', 540, 1340, C.cyan);
        techTag('THERMAL LIMIT: 38.4°C [STABLE]', 540, 1420, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tSixty, 'pop');
  }

  // ── Cut 8: Efficiency Metric (90% Capacity Across 800 Cycles) ──────
  {
    const st = cut(7), tCycles = Wd('hundred', 7) - st;
    add({
      id: 'S08', at: st, cam: [540, 960], note: '90% health metric badge',
      draw(lt) {
        ctx.fillStyle = '#071322'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.15);
        techTag('[CORE EFFICIENCY METRIC]', 540, 320, C.cyan);

        // Giant metric circle badge
        const cx = 540, cy = 880, r = 240;
        ctx.strokeStyle = '#27476E'; ctx.lineWidth = 14;
        circle(cx, cy, r, '#0D2036'); ctx.stroke();

        // 90% arc
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 18; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.9);
        ctx.stroke();

        ctx.fillStyle = C.white; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('90%', cx, cy - 30);
        ctx.fillStyle = '#10B981'; ctx.font = '700 38px Inter';
        ctx.fillText('HEALTH PRESERVED', cx, cy + 50);

        techTag('LIFESPAN: 800+ RECHARGE CYCLES', 540, 1360, '#10B981');
      }
    });
    cue(st, 'whoosh'); cue(st + tCycles, 'tock');
  }

  // ── Cut 9: Loop Outro (Seamless Loop back to Hook) ─────────────────
  {
    const st = cut(8), tFire = Wd('fire', 8) - st;
    add({
      id: 'S09', at: st, cam: [540, 960], note: 'Outro phone with glowing shield, loops to hook',
      draw(lt) {
        ctx.fillStyle = '#060F1C'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.18);
        techTag('[SYSTEM VERDICT: HARDWARE PROTECTION]', 540, 300, '#10B981');

        phoneFrame(540, 920, 1.25, 80, true);

        // Green protective shield outline
        const sp = Math.sin(lt * 6) * 10;
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 6;
        rr(540 - 270 - sp / 2, 920 - 470 - sp / 2, 540 + sp, 940 + sp, 55);
        ctx.stroke();

        techTag('ACTIVE THERMAL GOVERNOR', 540, 1360, '#10B981');
        techTag('PREVENTS OVERHEAT • PROTECTS LIFE', 540, 1440, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tFire, 'thud');
  }

  return { shots: S, cues: CUES };
}
