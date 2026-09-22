"use client";

import { RosterSlot } from "@/lib/types";
import { SLOT_LABELS, StarterSlotId } from "@/lib/slots";

export default function PlayerActionSheet({
  playerName,
  currentSlot,
  eligibleSlots,
  onMove,
  onEdit,
  onDelete,
  onClose,
}: {
  playerName: string;
  currentSlot: RosterSlot;
  eligibleSlots: StarterSlotId[];
  onMove: (slot: RosterSlot) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-navy-800 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <p className="px-1 text-[13px] font-bold text-white">{playerName}</p>

        <label className="mt-3 block text-[10px] font-bold text-white/50">
          Move to
          <select
            value={currentSlot}
            onChange={(e) => {
              onMove(e.target.value as RosterSlot);
              onClose();
            }}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-[13px] text-white"
          >
            <option value="BENCH">Bench</option>
            {eligibleSlots.map((s) => (
              <option key={s} value={s}>
                {SLOT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="mt-3 block w-full rounded-xl bg-navy-900 py-3 text-left text-[13px] font-bold text-lime-dim"
        >
          <span className="pl-1">Edit player</span>
        </button>
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="mt-2 block w-full rounded-xl bg-navy-900 py-3 text-left text-[13px] font-bold text-status-bad"
        >
          <span className="pl-1">Remove player</span>
        </button>
        <button
          onClick={onClose}
          className="mt-2 block w-full rounded-xl py-3 text-center text-[13px] font-semibold text-white/50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
