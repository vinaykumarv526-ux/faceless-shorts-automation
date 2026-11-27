// Inside Out: 2D Flat Architectural Explainer Engine (1080x1920)
// Follows the 9-Cut Viral Retention Loop, bespoke vector kits, and strict upper safe zone anchoring
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, rr, circle, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import { K } from './core/archKit.js';
import { BatteryKit } from './core/batteryKit.js';

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

  // Common diagram center in UPPER safe zone (650 to 850 px)
  // Subtitles occupy y ≈ 1250 to 1650 (centered at 1400)
  const DIAG_CX = 540, DIAG_CY = 760;

  // ── Cut 1: The Hook (Counter-Intuitive Question / Clean Hero Entity) ──
  {
    const st = cut(0), tPoint1 = safeWord('eighty', 0, 0.4), tPoint2 = safeWord('forty', 0, 0.8);
    const badge = bp.cut1_badge || '[BATTERY ARCHITECTURE: DUAL-PHASE]';
    const tag1 = bp.cut1_tag1 || 'STAGE 1: 0-80% IN 20 MIN';
    const tag2 = bp.cut1_tag2 || 'STAGE 2: 80-100% IN 40 MIN';
    const metricStr = bp.cut1_metric || '80%';

    add({
      id: 'S01', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Hook: clean hero phone charges to 80% then throttles',
      draw(lt) {
        ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.12, C.cyan);
        K.pill(badge, DIAG_CX, 280, 30, '#0E1A2B', C.cyan);

        let pct = 0;
        if (lt < tPoint1) {
          pct = lerp(0, 80, eo(clamp(lt / (tPoint1 || 1))));
        } else {
          pct = 80 + clamp((lt - tPoint1) / (tPoint2 - tPoint1 + 0.1)) * 3;
        }

        BatteryKit.heroPhone(DIAG_CX, DIAG_CY, 0.95, pct, true, metricStr);

        if (lt > tPoint1) {
          K.tag(tag1, DIAG_CX, 350, DIAG_CX, DIAG_CY - 280, 26, '#0E1A2B', C.cyan);
        }
        if (lt > tPoint2) {
          K.tag(tag2, DIAG_CX, 1140, DIAG_CX, DIAG_CY + 280, 26, '#0E1A2B', C.yellow);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + 0.3, 'zip'); cue(st + tPoint1, 'tock');
  }

  // ── Cut 2: The Flawed Myth (What Most People Intuitively Assume) ────
  {
    const st = cut(1), tFlow = safeWord('water', 1, 0.35);
    const badge = bp.cut2_badge || '[THE FLAWED MYTH: LINEAR SUPPLY]';
    const sub = bp.cut2_sub || 'ASSUMPTION: CONSTANT FLOW VELOCITY';

    add({
      id: 'S02', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Myth: flat linear flow filling container',
      draw(lt) {
        ctx.fillStyle = '#0B1524'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.10, C.cyan);
        K.pill(badge, DIAG_CX, 280, 30, C.navy, C.white);

        const fillRatio = clamp(lt / 3.6);
        BatteryKit.linearSupplyMyth(DIAG_CX, DIAG_CY + 20, 0.95, fillRatio);
        K.pill(sub, DIAG_CX, 1140, 28, '#0E1A2B', C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + tFlow, 'bubbles', { dur: 1.8 });
  }

  // ── Cut 3: The Failure Point (Violent Breakdown / Red Hazard X) ────
  {
    const st = cut(2), tHeat = safeWord('overheat', 2, 0.45);
    const badge = bp.cut3_badge || '[CRITICAL FAILURE: ANODE SATURATION]';
    const alert = bp.cut3_alert || 'CRITICAL OVERHEAT';
    const warning = bp.cut3_warning || 'DANGER: THERMAL RUNAWAY RISK';

    add({
      id: 'S03', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Failure point: ion crowding triggers Red X and hazard',
      draw(lt) {
        const isRed = lt > tHeat;
        ctx.fillStyle = isRed ? '#1E0B10' : '#0B1524'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(isRed ? 0.22 : 0.10, isRed ? C.red : C.cyan);
        K.pill(badge, DIAG_CX, 280, 30, isRed ? '#3D0D14' : C.navy, C.red);

        BatteryKit.anodeOverheatFailure(DIAG_CX, DIAG_CY, 0.95, isRed, lt);

        if (isRed) {
          bigText(alert, DIAG_CX, 760, 56, C.red);
          K.tag(warning, DIAG_CX, 1140, DIAG_CX, DIAG_CY + 180, 26, '#3D0D14', C.red);
        }
      }
    });
    cue(st, 'whoosh'); cue(st + tHeat, 'alarm', { dur: 1.8 }); cue(st + tHeat + 0.3, 'slam');
  }

  // ── Cut 4: The Architectural Secret (Hidden Engine Revealed) ───────
  {
    const st = cut(3), tSwitch = safeWord('flips', 3, 0.45);
    const badge = bp.cut4_badge || '[ARCHITECTURAL SCHEMATIC: PMIC CONTROLLER]';
    const mode1 = bp.cut4_mode1 || 'ACTIVE: PHASE 1 (CC MODE)';
    const mode2 = bp.cut4_mode2 || 'ACTIVE: PHASE 2 (CV MODE)';

    add({
      id: 'S04', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Architectural secret: dual-phase IC motherboard',
      draw(lt) {
        ctx.fillStyle = C.blueprintNavy; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.18, C.cyan);
        K.pill(badge, DIAG_CX, 280, 28, C.navy, C.cyan);

        const isPhase2 = lt > tSwitch;
        BatteryKit.dualPhasePmicCutaway(DIAG_CX, DIAG_CY, 1.0, isPhase2);

        K.pill(isPhase2 ? mode2 : mode1, DIAG_CX, 1140, 28, C.navy, isPhase2 ? C.yellow : C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + tSwitch, 'pop', { gain: 0.8 });
  }

  // ── Cut 5: Dynamics / Flow (Forces / Moving Charge Flux) ────────────
  {
    const st = cut(4), tPoint = safeWord('forty', 4, 0.4);
    const badge = bp.cut5_badge || '[DYNAMICS: HIGH-VELOCITY FLUX]';
    const metricStr = bp.cut5_metric || '40W CONSTANT CURRENT';

    add({
      id: 'S05', at: st, cam: [DIAG_CX, DIAG_CY], note: 'High velocity particles flowing down vertical channels',
      draw(lt) {
        ctx.fillStyle = '#0A1422'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.14, C.cyan);
        K.pill(badge, DIAG_CX, 280, 30, C.navy, C.cyan);

        BatteryKit.constantCurrentFlux(DIAG_CX, DIAG_CY, 1.0, lt);

        K.pill(metricStr, DIAG_CX, 1140, 30, C.navy, C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + tPoint, 'laser');
  }

  // ── Cut 6: Self-Balancing Loop (Auto-Correction Under Load) ─────────
  {
    const st = cut(5), tStep = safeWord('thermal', 5, 0.45);
    const badge = bp.cut6_badge || '[CLOSED-LOOP FEEDBACK GOVERNOR]';
    const tag1 = bp.cut6_tag || 'THERMAL FEEDBACK GOVERNOR ACTIVE';

    add({
      id: 'S06', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Self-balancing governor steps power down as resistance rises',
      draw(lt) {
        ctx.fillStyle = '#081220'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.16, C.cyan);
        K.pill(badge, DIAG_CX, 280, 28, C.navy, C.yellow);

        const stepped = lt > tStep;
        BatteryKit.feedbackGovernorGauge(DIAG_CX, DIAG_CY, 1.0, stepped);

        K.pill(tag1, DIAG_CX, 1140, 26, C.navy, stepped ? C.yellow : C.cyan);
      }
    });
    cue(st, 'whoosh'); cue(st + tStep, 'tock');
  }

  // ── Cut 7: Engine X-Ray (High-Frequency Sub-Component Telemetry) ────
  {
    const st = cut(6), tSixty = safeWord('sixty', 6, 0.45);
    const badge = bp.cut7_badge || '[MICRO-CONTROLLER SENSING GRID]';
    const freqStr = bp.cut7_freq || 'FREQUENCY: 60 CYCLES / SEC';
    const tempStr = bp.cut7_temp || 'THERMAL LIMIT: 38.4°C [STABLE]';

    add({
      id: 'S07', at: st, cam: [DIAG_CX, DIAG_CY], note: 'High frequency telemetry radar sensor grid',
      draw(lt) {
        ctx.fillStyle = '#060E1A'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.20, C.cyan);
        K.pill(badge, DIAG_CX, 280, 28, C.navy, C.cyan);

        BatteryKit.microControllerTelemetry(DIAG_CX, DIAG_CY, 1.0, lt);

        K.pill(freqStr, DIAG_CX, 1080, 26, C.navy, C.cyan);
        K.pill(tempStr, DIAG_CX, 1150, 24, C.navy, C.white);
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
      id: 'S08', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Core efficiency metric gauge with green arc',
      draw(lt) {
        ctx.fillStyle = '#06111E'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.14, C.cyan);
        K.pill(badge, DIAG_CX, 280, 30, C.navy, C.cyan);

        BatteryKit.coreEfficiencyMetricBadge(DIAG_CX, DIAG_CY, 1.0, metricStr, labelStr);

        K.pill(lifespanStr, DIAG_CX, 1140, 28, C.navy, C.green);
      }
    });
    cue(st, 'whoosh'); cue(st + tCycles, 'ding');
  }

  // ── Cut 9: Loop Outro (Punchy Final Principle Looping Back to Hook) ─
  {
    const st = cut(8), tFire = safeWord('fire', 8, 0.45);
    const badge = bp.cut9_badge || '[SYSTEM VERDICT: HARDWARE PROTECTION]';
    const tag1 = bp.cut9_tag1 || 'ACTIVE GOVERNOR SHIELD';
    const tag2 = bp.cut9_tag2 || 'PREVENTS DAMAGE • PROTECTS LIFE';

    add({
      id: 'S09', at: st, cam: [DIAG_CX, DIAG_CY], note: 'Outro phone with safety shield loops cleanly to opening hook',
      draw(lt) {
        ctx.fillStyle = '#050D18'; ctx.fillRect(0, 0, W, H);
        K.drawGrid(0.16, C.cyan);
        K.pill(badge, DIAG_CX, 280, 28, C.navy, C.green);

        BatteryKit.protectiveShieldVerdict(DIAG_CX, DIAG_CY, 0.95, lt, bp.cut1_metric || '80%');

        K.pill(tag1, DIAG_CX, 1080, 26, C.navy, C.green);
        K.pill(tag2, DIAG_CX, 1150, 24, C.navy, C.white);
      }
    });
    cue(st, 'whoosh'); cue(st + tFire, 'thud');
  }

  return { shots: S, cues: CUES };
}
