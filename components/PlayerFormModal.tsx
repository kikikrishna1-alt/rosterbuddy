"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import {
  Consistency,
  HealthStatus,
  MatchupRating,
  Player,
  Position,
  RosterSlot,
} from "@/lib/types";
import { eligibleSlotsForPosition, SLOT_LABELS } from "@/lib/slots";

const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "D/ST", "K"];
const STATUSES: HealthStatus[] = ["Healthy", "Questionable", "Doubtful", "Out", "IR", "Bye"];
const MATCHUPS: MatchupRating[] = ["Great", "Good", "Average", "Tough"];
const CONSISTENCIES: Consistency[] = ["Steady", "Boom/Bust", "Unknown"];

type FormValue = Omit<Player, "id" | "isSample">;

export default function PlayerFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Player;
  onClose: () => void;
  onSave: (values: FormValue) => void;
}) {
  const [values, setValues] = useState<FormValue>(
    initial ?? {
      name: "",
      nflTeam: "",
      position: "WR",
      opponent: "",
      projectedPoints: 10,
      status: "Healthy",
      matchup: "Average",
      opportunity: "",
      consistency: "Unknown",
      slot: "BENCH",
      notes: "",
    }
  );

  const eligibleSlots = eligibleSlotsForPosition(values.position);
  const slotOptions: RosterSlot[] = ["BENCH", ...eligibleSlots];

  function set<K extends keyof FormValue>(key: K, value: FormValue[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "position") {
        const eligible = eligibleSlotsForPosition(value as Position);
        if (next.slot !== "BENCH" && !eligible.includes(next.slot as (typeof eligible)[number])) {
          next.slot = "BENCH";
        }
      }
      return next;
    });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSave({
      ...values,
      name: values.name.trim(),
      nflTeam: values.nflTeam.trim().toUpperCase() || "FA",
      opponent: values.opponent.trim().toUpperCase() || "TBD",
      projectedPoints: Number(values.projectedPoints) || 0,
    });
  }

  return (
    <Modal
      eyebrow={initial ? "EDIT PLAYER" : "ADD TO ROSTER"}
      title={initial ? "Update player details" : "Player details"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Player name
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="e.g. Justin Jefferson"
          />
        </label>

        <label className="text-[11px] font-bold text-white/60">
          NFL team
          <input
            value={values.nflTeam}
            onChange={(e) => set("nflTeam", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="MIN"
          />
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Position
          <select
            value={values.position}
            onChange={(e) => set("position", e.target.value as Position)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {POSITIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Roster slot
          <select
            value={values.slot}
            onChange={(e) => set("slot", e.target.value as RosterSlot)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {slotOptions.map((s) => (
              <option key={s} value={s}>
                {s === "BENCH" ? "Bench" : SLOT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Health status
          <select
            value={values.status}
            onChange={(e) => set("status", e.target.value as HealthStatus)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Projected points
          <input
            type="number"
            step="0.1"
            value={values.projectedPoints}
            onChange={(e) => set("projectedPoints", Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          />
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Opponent
          <input
            value={values.opponent}
            onChange={(e) => set("opponent", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="SEA"
          />
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Matchup rating
          <select
            value={values.matchup}
            onChange={(e) => set("matchup", e.target.value as MatchupRating)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {MATCHUPS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="text-[11px] font-bold text-white/60">
          Consistency
          <select
            value={values.consistency}
            onChange={(e) => set("consistency", e.target.value as Consistency)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {CONSISTENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Recent workload / opportunity
          <input
            value={values.opportunity}
            onChange={(e) => set("opportunity", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="e.g. 8 targets last game"
          />
        </label>

        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Notes
          <textarea
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="mt-1 min-h-[70px] w-full resize-y rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          />
        </label>

        <div className="col-span-2 mt-1 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white/60"
          >
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-lime px-5 py-2 text-sm font-bold text-navy-950">
            {initial ? "Save changes" : "Add player"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
