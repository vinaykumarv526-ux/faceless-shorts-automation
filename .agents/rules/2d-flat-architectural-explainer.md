# Rule: 2D Flat Architectural Explainer Engine (1080x1920)

Follow the specification in `SYSTEM_PROMPT.md` for all short-form explainer video generation tasks.

Key Constraints:
- Dimensions: 1080x1920 vertical 9:16 (30 FPS).
- Strictly adhere to the signature palette:
  - Background Cream: `#F4F1EA`
  - Blueprint Deep Navy: `#0E1A2B` / `#0F172A`
  - Technical Ink: `#1A1A1E`
  - Technical Cyan: `#38BDF8`
  - Attention Yellow: `#FFD43B`
  - Hazard Red: `#EF4444`
  - Safety Green: `#10B981`
- Safe Zone:
  - Diagrams centered at upper safe area ($y \approx 650$ to $850$, `cam: [540, 760]`).
  - Subtitles occupy bottom zone ($y \approx 1250$ to $1650$).
  - Never allow technical callouts or cutaway geometry to overlap the caption zone.
- Bespoke Vector Kit:
  - Never reuse another topic's vector components.
  - Every project has its own `<topic>Kit.js` in `src/core/` tailored exclusively to that topic's physical mechanism.
- 9-Cut Viral Retention Loop:
  - Cut 1: Hook (clean hero entity)
  - Cut 2: Flawed Myth (intuitive simple assumption)
  - Cut 3: Failure Point (violent breakdown / Red X / hazard)
  - Cut 4: Architectural Secret (high-contrast cutaway of hidden engine)
  - Cut 5: Dynamics / Flow (traveling vectors / forces / fluid / electrons)
  - Cut 6: Self-Balancing Loop (auto-correction / load dissipation)
  - Cut 7: Engine X-Ray (sub-component internal view)
  - Cut 8: Efficiency Metric (macro leverage point)
  - Cut 9: Loop Outro (punchy principle looping back to Cut 1)
