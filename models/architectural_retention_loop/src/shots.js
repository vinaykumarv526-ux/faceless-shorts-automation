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

function phoneFrame(cx, cy, scale = 1, batteryPct = 80, isCharging = true, customMetric = '80%') {
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
  ctx.fillText(customMetric, 0, -20);

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

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  const bp = script.blueprint || {};

  function safeWord(word, lineIdx, defaultFraction = 0.45) {
    try {
      return Wd(word, lineIdx) - cut(lineIdx);
    } catch (e) {
      const dur = (Le(lineIdx) || 3.0) - (L(lineIdx) || 0);
      return Math.max(0.1, dur * defaultFraction);
    }
  }

  // ── Cut 1: Hook (Counter-Intuitive Question / Rapid Jump) ───────────
  {
    const st = cut(0), tPoint1 = safeWord('eighty', 0, 0.4), tPoint2 = safeWord('forty', 0, 0.8);
    const badge = bp.cut1_badge || '[SYSTEM ARCHITECTURE: TECHNICAL X-RAY]';
    const tag1 = bp.cut1_tag1 || 'STAGE 1: 0-80% IN 20 MIN (HIGH SPEED)';
    const tag2 = bp.cut1_tag2 || 'STAGE 2: 80-100% IN 40 MIN (THROTTLED)';
    const metricStr = bp.cut1_metric || '80%';

    add({
      id: 'S01', at: st, cam: [540, 960], note: 'Hook: rapid jump to threshold then throttles',
      draw(lt) {
        ctx.fillStyle = '#080E18'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.15);
        let pct = 0;
        if (lt < tPoint1) {
          pct = lerp(0, 80, eo(clamp(lt / (tPoint1 || 1))));
        } else {
          pct = 80 + clamp((lt - tPoint1) / (tPoint2 - tPoint1 + 0.1)) * 3;
        }
        phoneFrame(540, 920, 1.25, pct, true, metricStr);
        techTag(badge, 540, 280, C.cyan);
        if (lt > tPoint1) {
          techTag(tag1, 540, 360, C.cyan);
        }
        if (lt > tPoint2) {
          techTag(tag2, 540, 440, C.yellow);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + 0.3, 'zip'); cue(st + tPoint1, 'tock');
  }

  // ── Cut 2: The Flawed Myth (What Most People Assume) ───────────────
  {
    const st = cut(1), tFlow = safeWord('water', 1, 0.35);
    const badge = bp.cut2_badge || '[THE FLAWED MYTH: LINEAR SUPPLY]';
    const sub = bp.cut2_sub || 'ASSUMPTION: 100% CONSTANT VELOCITY';

    add({
      id: 'S02', at: st, cam: [540, 960], note: 'Myth: linear flow into container',
      draw(lt) {
        ctx.fillStyle = '#0A121F'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.12);
        techTag(badge, 540, 320, C.white);
        
        // Technical Beaker / Container vector
        const bx = 540, by = 980, bw = 320, bh = 540;
        ctx.strokeStyle = '#4A6588'; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(bx - bw / 2, by - bh / 2);
        ctx.lineTo(bx - bw / 2, by + bh / 2);
        ctx.lineTo(bx + bw / 2, by + bh / 2);
        ctx.lineTo(bx + bw / 2, by - bh / 2);
        ctx.stroke();

        // Linear flow stream
        const fill = clamp(lt / 3.8);
        const wh = bh * fill;
        ctx.fillStyle = '#38B6FF';
        ctx.fillRect(bx - bw / 2 + 8, by + bh / 2 - wh, bw - 16, wh);

        if (fill < 0.98) {
          ctx.fillRect(bx - 18, 380, 36, (by + bh / 2 - wh) - 380);
        }
        techTag(sub, 540, 1420, '#38B6FF');
      }
    });
    cue(st, 'whoosh'); cue(st + tFlow, 'bubbles', { dur: 2.0 });
  }

  // ── Cut 3: The Failure Point (Overload / Critical Alert) ───────────
  {
    const st = cut(2), tHeat = safeWord('overheat', 2, 0.45);
    const badge = bp.cut3_badge || '[CRITICAL FAILURE: SYSTEM OVERLOAD]';
    const alert = bp.cut3_alert || 'CRITICAL FAILURE POINT';
    const warning = bp.cut3_warning || 'DANGER: THERMAL RUNAWAY RISK';

    add({
      id: 'S03', at: st, cam: [540, 960], note: 'Failure point: particles saturate, critical alert triggers',
      draw(lt) {
        const isRed = lt > tHeat;
        ctx.fillStyle = isRed ? '#24080B' : '#0B1320'; ctx.fillRect(0, 0, W, H);
        drawGrid(isRed ? 0.25 : 0.12);
        techTag(badge, 540, 300, C.red);

        // Technical Grid Layer
        const gy = 860;
        ctx.strokeStyle = '#4A5B73'; ctx.lineWidth = 4;
        for (let i = -3; i <= 3; i++) {
          line([[240, gy + i * 70], [840, gy + i * 70]], '#4A5B73', 4);
        }

        // Crowding saturation particles
        const numIons = 30;
        for (let i = 0; i < numIons; i++) {
          const ix = 540 + Math.sin(i * 1.7 + lt * 3) * 260;
          const iy = gy + Math.cos(i * 2.3 + lt * 4) * 180;
          circle(ix, iy, 16, isRed ? C.red : C.yellow);
        }

        if (lt > tHeat) {
          techTag(warning, 540, 1340, C.red, '#4A0D14');
          // Red warning pulse box
          ctx.strokeStyle = C.red; ctx.lineWidth = 12;
          const pulse = (lt * 8) % 1;
          rr(180 - pulse * 30, gy - 240 - pulse * 30, 720 + pulse * 60, 480 + pulse * 60, 24);
          ctx.stroke();
          // Alert headline
          bigText(alert, 540, 860, 64, C.red);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + tHeat, 'alarm', { dur: 2.0 }); cue(st + tHeat + 0.3, 'slam');
  }

  // ── Cut 4: The Architectural Secret (Hidden Engine Revealed) ───────
  {
    const st = cut(3), tSwitch = safeWord('flips', 3, 0.45);
    const badge = bp.cut4_badge || '[ARCHITECTURAL SCHEMATIC: PMIC CONTROLLER]';
    const chipText = bp.cut4_chip || 'DUAL-PHASE';
    const labelText = bp.cut4_label || 'POWER IC';
    const mode1 = bp.cut4_mode1 || 'ACTIVE: PHASE 1 (CC MODE)';
    const mode2 = bp.cut4_mode2 || 'ACTIVE: PHASE 2 (CV MODE)';

    add({
      id: 'S04', at: st, cam: [540, 960], note: 'Architectural secret: dual phase controller board',
      draw(lt) {
        ctx.fillStyle = '#06101D'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.2);
        techTag(badge, 540, 300, C.cyan);

        // Core component block
        const cx = 540, cy = 920, sz = 380;
        ctx.fillStyle = '#102238'; ctx.strokeStyle = C.cyan; ctx.lineWidth = 5;
        rr(cx - sz / 2, cy - sz / 2, sz, sz, 20);
        ctx.fill(); ctx.stroke();

        // IC Chip center
        ctx.fillStyle = '#091524';
        rr(cx - 130, cy - 130, 260, 260, 14);
        ctx.fill();
        ctx.fillStyle = C.white; ctx.font = '800 36px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(chipText, cx, cy - 25);
        ctx.fillStyle = C.cyan;
        ctx.fillText(labelText, cx, cy + 25);

        // Mode switch indicators
        const isPhase2 = lt > tSwitch;
        techTag(isPhase2 ? mode2 : mode1, 540, 1360, isPhase2 ? C.yellow : C.cyan);

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

  // ── Cut 5: Dynamics / Flow (Data / Energy Vector Highway) ───────────
  {
    const st = cut(4), tPoint = safeWord('forty', 4, 0.4);
    const badge = bp.cut5_badge || '[DYNAMICS: HIGH-VELOCITY FLUX]';
    const metricStr = bp.cut5_metric || '40 WATTS CONSTANT CURRENT';

    add({
      id: 'S05', at: st, cam: [540, 960], note: 'High velocity energy particles flowing down layers',
      draw(lt) {
        ctx.fillStyle = '#071220'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.16);
        techTag(badge, 540, 300, C.cyan);

        // Vertical bus channels
        for (let col = 0; col < 3; col++) {
          const x = 340 + col * 200;
          ctx.strokeStyle = '#163152'; ctx.lineWidth = 12;
          line([[x, 480], [x, 1260]], '#163152', 12);

          // Fast stream particles
          for (let p = 0; p < 8; p++) {
            const py = 480 + ((lt * 1200 + p * 110) % 780);
            circle(x, py, 14, C.cyan);
            // Particle glow tail
            line([[x, py], [x, Math.max(480, py - 40)]], C.cyan, 6);
          }
        }

        techTag(metricStr, 540, 1380, C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + tPoint, 'laser');
  }

  // ── Cut 6: Self-Balancing Loop (Feedback Governor Step-Down) ───────
  {
    const st = cut(5), tStep = safeWord('thermal', 5, 0.45);
    const badge = bp.cut6_badge || '[CLOSED-LOOP FEEDBACK GOVERNOR]';
    const tag1 = bp.cut6_tag || 'THERMAL FEEDBACK GOVERNOR ACTIVE';

    add({
      id: 'S06', at: st, cam: [540, 960], note: 'Governor steps down power as resistance rises',
      draw(lt) {
        ctx.fillStyle = '#091424'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.18);
        techTag(badge, 540, 300, C.yellow);

        // Circular feedback gauge
        const cx = 540, cy = 840, r = 220;
        ctx.strokeStyle = '#1D3B5C'; ctx.lineWidth = 16;
        circle(cx, cy, r, '#0A1828'); ctx.stroke();

        const stepped = lt > tStep;
        const progress = stepped ? 0.35 : 0.88;
        ctx.strokeStyle = stepped ? C.yellow : C.cyan;
        ctx.lineWidth = 20; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI, -Math.PI + Math.PI * progress);
        ctx.stroke();

        ctx.fillStyle = C.white; ctx.font = '900 72px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(stepped ? '15W' : '45W', cx, cy - 20);
        ctx.fillStyle = stepped ? C.yellow : C.cyan; ctx.font = '700 32px Inter';
        ctx.fillText(stepped ? 'THROTTLED' : 'MAX POWER', cx, cy + 40);

        techTag(tag1, 540, 1260, stepped ? C.yellow : C.cyan);
        techTag(stepped ? 'OUTPUT: STEP-DOWN COMPLETED' : 'MONITORING IMPEDANCE...', 540, 1340, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tStep, 'tock');
  }

  // ── Cut 7: Engine X-Ray (Micro-Controller Radar & Telemetry) ────────
  {
    const st = cut(6), tSixty = safeWord('sixty', 6, 0.45);
    const badge = bp.cut7_badge || '[MICRO-CONTROLLER SENSING GRID]';
    const freqStr = bp.cut7_freq || 'FREQUENCY: 60 CYCLES / SEC';
    const tempStr = bp.cut7_temp || 'THERMAL LIMIT: 38.4°C [STABLE]';

    add({
      id: 'S07', at: st, cam: [540, 960], note: 'High frequency telemetry sensor radar',
      draw(lt) {
        ctx.fillStyle = '#050D18'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.22);
        techTag(badge, 540, 300, C.cyan);

        const cx = 540, cy = 840, maxR = 260;
        // Concentric radar sensor rings
        for (let i = 1; i <= 4; i++) {
          const r = (maxR / 4) * i;
          ctx.strokeStyle = '#14314E'; ctx.lineWidth = 3;
          circle(cx, cy, r); ctx.stroke();
        }

        // Radar sweep arm
        const ang = (lt * 5) % (Math.PI * 2);
        ctx.strokeStyle = C.cyan; ctx.lineWidth = 4;
        line([[cx, cy], [cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR]], C.cyan, 4);

        // Blips
        for (let b = 0; b < 6; b++) {
          const ban = (b * 1.05);
          const br = 90 + (b * 26);
          const bx = cx + Math.cos(ban) * br;
          const by = cy + Math.sin(ban) * br;
          circle(bx, by, 7, C.cyan);
          ctx.strokeStyle = C.cyan; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.stroke();
        }

        techTag(freqStr, 540, 1340, C.cyan);
        techTag(tempStr, 540, 1420, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tSixty, 'pop');
  }

  // ── Cut 8: Efficiency Metric (Core Macro Leverage Point) ────────────
  {
    const st = cut(7), tCycles = safeWord('hundred', 7, 0.45);
    const badge = bp.cut8_badge || '[CORE EFFICIENCY METRIC]';
    const metricStr = bp.cut8_metric || '90%';
    const labelStr = bp.cut8_label || 'HEALTH PRESERVED';
    const lifespanStr = bp.cut8_lifespan || 'LIFESPAN: 800+ RECHARGE CYCLES';

    add({
      id: 'S08', at: st, cam: [540, 960], note: 'Core efficiency metric gauge',
      draw(lt) {
        ctx.fillStyle = '#071322'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.15);
        techTag(badge, 540, 320, C.cyan);

        // Giant metric circle badge
        const cx = 540, cy = 880, r = 240;
        ctx.strokeStyle = '#27476E'; ctx.lineWidth = 14;
        circle(cx, cy, r, '#0D2036'); ctx.stroke();

        // Metric arc
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 18; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.9);
        ctx.stroke();

        ctx.fillStyle = C.white; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(metricStr, cx, cy - 30);
        ctx.fillStyle = '#10B981'; ctx.font = '700 38px Inter';
        ctx.fillText(labelStr, cx, cy + 50);

        techTag(lifespanStr, 540, 1360, '#10B981');
      }
    });
    cue(st, 'whoosh'); cue(st + tCycles, 'tock');
  }

  // ── Cut 9: Loop Outro (Seamless Return to Opening Hook) ─────────────
  {
    const st = cut(8), tFire = safeWord('fire', 8, 0.45);
    const badge = bp.cut9_badge || '[SYSTEM VERDICT: HARDWARE PROTECTION]';
    const tag1 = bp.cut9_tag1 || 'ACTIVE GOVERNOR SHIELD';
    const tag2 = bp.cut9_tag2 || 'PREVENTS DAMAGE • PROTECTS SYSTEM';

    add({
      id: 'S09', at: st, cam: [540, 960], note: 'Protective shield vector loops seamlessly to opening hook',
      draw(lt) {
        ctx.fillStyle = '#060F1C'; ctx.fillRect(0, 0, W, H);
        drawGrid(0.18);
        techTag(badge, 540, 300, '#10B981');

        phoneFrame(540, 920, 1.25, 80, true, bp.cut1_metric || '80%');

        // Green protective shield outline
        const sp = Math.sin(lt * 6) * 10;
        ctx.strokeStyle = '#10B981'; ctx.lineWidth = 6;
        rr(540 - 270 - sp / 2, 920 - 470 - sp / 2, 540 + sp, 940 + sp, 55);
        ctx.stroke();

        techTag(tag1, 540, 1360, '#10B981');
        techTag(tag2, 540, 1440, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tFire, 'thud');
  }

  return { shots: S, cues: CUES };
}
