import { describe, expect, it } from "vitest";

import type { CursorTelemetryPoint } from "../types";
import {
  detectInteractionCandidates,
  detectZoomDwellCandidates,
  suggestInteractionZooms,
} from "./zoomSuggestionUtils";

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

  it("builds non-overlapping zoom suggestions from interaction telemetry", () => {
    const samples: CursorTelemetryPoint[] = [
      { timeMs: 0, cx: 0.2, cy: 0.3, interactionType: "move", cursorType: "pointer" },
      { timeMs: 200, cx: 0.2, cy: 0.3, interactionType: "move", cursorType: "pointer" },
      { timeMs: 450, cx: 0.2, cy: 0.3, interactionType: "move", cursorType: "pointer" },
      { timeMs: 700, cx: 0.2, cy: 0.3, interactionType: "move", cursorType: "pointer" },
      { timeMs: 2400, cx: 0.7, cy: 0.55, interactionType: "click", cursorType: "pointer" },
      { timeMs: 2500, cx: 0.7, cy: 0.55, interactionType: "move", cursorType: "pointer" },
      { timeMs: 2700, cx: 0.7, cy: 0.55, interactionType: "move", cursorType: "pointer" },
    ];

    const suggestions = suggestInteractionZooms({
      telemetry: samples,
      totalMs: 4000,
      defaultDurationMs: 1000,
      existingSpans: [{ start: 1800, end: 2800 }],
      spacingMs: 1200,
    });

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      startMs: 0,
      endMs: 1000,
      focus: expect.objectContaining({ cx: 0.2, cy: 0.3 }),
    });
  });
});
