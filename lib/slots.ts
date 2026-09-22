import { Position, RosterSlot, StarterSlotId } from "./types";

export type { StarterSlotId };

export const STARTER_SLOT_ORDER: StarterSlotId[] = [
  "QB",
  "RB1",
  "RB2",
  "WR1",
  "WR2",
  "TE",
  "FLEX1",
  "FLEX2",
  "DST",
  "K",
];

export const SLOT_LABELS: Record<StarterSlotId, string> = {
  QB: "QB",
  RB1: "RB",
  RB2: "RB",
  WR1: "WR",
  WR2: "WR",
  TE: "TE",
  FLEX1: "FLEX",
  FLEX2: "FLEX",
  DST: "D/ST",
  K: "K",
};

export const SLOT_BEGINNER_LABELS: Record<StarterSlotId, string> = {
  QB: "Starting quarterback",
  RB1: "Starting running back",
  RB2: "Starting running back",
  WR1: "Starting receiver",
  WR2: "Starting receiver",
  TE: "Starting tight end",
  FLEX1: "Flex: RB, WR, or TE",
  FLEX2: "Flex: RB, WR, or TE",
  DST: "Starting defense",
  K: "Starting kicker",
};

const ELIGIBILITY: Record<StarterSlotId, Position[]> = {
  QB: ["QB"],
  RB1: ["RB"],
  RB2: ["RB"],
  WR1: ["WR"],
  WR2: ["WR"],
  TE: ["TE"],
  FLEX1: ["RB", "WR", "TE"],
  FLEX2: ["RB", "WR", "TE"],
  DST: ["D/ST"],
  K: ["K"],
};

export function canFillSlot(position: Position, slot: StarterSlotId): boolean {
  return ELIGIBILITY[slot].includes(position);
}

export function eligibleSlotsForPosition(position: Position): StarterSlotId[] {
  return STARTER_SLOT_ORDER.filter((slot) => canFillSlot(position, slot));
}

function normalizeHint(hint: string | null): string {
  return hint ? hint.trim().toUpperCase().replace(/\s+/g, "") : "";
}

/** Maps a screenshot-derived slot label (e.g. "RB", "FLEX", "Bench") to the
 * specific starter slot group it corresponds to, or "BENCH" for an explicit
 * bench/IR hint, or null if the hint is missing/unrecognized. */
function hintGroup(hint: string | null): StarterSlotId[] | "BENCH" | null {
  const h = normalizeHint(hint);
  if (!h) return null;
  if (h === "BENCH" || h === "BE" || h === "IR") return "BENCH";
  if (h === "QB") return ["QB"];
  if (h.startsWith("RB")) return ["RB1", "RB2"];
  if (h.startsWith("WR")) return ["WR1", "WR2"];
  if (h === "TE") return ["TE"];
  if (h.startsWith("FLEX") || h === "W/R/T" || h === "OP") return ["FLEX1", "FLEX2"];
  if (h === "D/ST" || h === "DST" || h === "DEF") return ["DST"];
  if (h === "K") return ["K"];
  return null;
}

/** Best-effort placement of screenshot-imported players into starting slots
 * that match what ESPN showed, skipping slots already taken (on the real
 * roster or earlier in this same batch) and falling back to the bench. */
export function assignImportSlots(
  rows: { position: Position; slotHint: string | null }[],
  occupiedSlots: RosterSlot[]
): RosterSlot[] {
  const claimed = new Set<string>(occupiedSlots.filter((s) => s !== "BENCH"));

  return rows.map((row) => {
    const hinted = hintGroup(row.slotHint);
    if (hinted === "BENCH") return "BENCH";

    const candidateGroups: StarterSlotId[][] = [];
    if (hinted) candidateGroups.push(hinted);
    candidateGroups.push(eligibleSlotsForPosition(row.position));

    for (const group of candidateGroups) {
      for (const slot of group) {
        if (!claimed.has(slot) && canFillSlot(row.position, slot)) {
          claimed.add(slot);
          return slot;
        }
      }
    }
    return "BENCH";
  });
}
