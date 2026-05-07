import { describe, expect, it } from "vitest";

import type { CursorTelemetryPoint } from "../types";
import { detectInteractionCandidates, detectZoomDwellCandidates } from "./zoomSuggestionUtils";

describe("zoom suggestion cursor detection", () => {
  it("detects pointer hover even when cursor drift breaks dwell detection", () => {
    const samples: CursorTelemetryPoint[] = [
      { timeMs: 0, cx: 0.2, cy: 0.4, interactionType: "move", cursorType: "pointer" },
      { timeMs: 120, cx: 0.235, cy: 0.4, interactionType: "move", cursorType: "pointer" },
      { timeMs: 240, cx: 0.27, cy: 0.4, interactionType: "move", cursorType: "pointer" },
      { timeMs: 360, cx: 0.305, cy: 0.4, interactionType: "move", cursorType: "pointer" },
      { timeMs: 520, cx: 0.34, cy: 0.4, interactionType: "move", cursorType: "pointer" },
    ];

    expect(detectZoomDwellCandidates(samples)).toHaveLength(0);
    expect(detectInteractionCandidates(samples)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "pointer-hover",
          focus: expect.objectContaining({
            cx: expect.any(Number),
            cy: expect.any(Number),
          }),
        }),
      ]),
    );
  });

  it("keeps hover candidates through short cursor-type gaps", () => {
    const samples: CursorTelemetryPoint[] = [
      { timeMs: 0, cx: 0.5, cy: 0.5, interactionType: "move", cursorType: "pointer" },
      { timeMs: 120, cx: 0.505, cy: 0.5, interactionType: "move", cursorType: "arrow" },
      { timeMs: 220, cx: 0.51, cy: 0.5, interactionType: "move", cursorType: "pointer" },
      { timeMs: 460, cx: 0.515, cy: 0.5, interactionType: "move", cursorType: "pointer" },
    ];

    const hoverCandidates = detectInteractionCandidates(samples).filter(
      (candidate) => candidate.kind === "pointer-hover",
    );

    expect(hoverCandidates).toHaveLength(1);
    expect(hoverCandidates[0]?.centerTimeMs).toBe(230);
  });
});
