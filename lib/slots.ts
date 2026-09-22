import { Position, StarterSlotId } from "./types";

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
