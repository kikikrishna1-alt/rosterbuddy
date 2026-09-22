"use client";

import { FormEvent, useState } from "react";
import Modal from "./Modal";
import { Position, Trend, WaiverPriority, WaiverTarget } from "@/lib/types";

const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "D/ST", "K"];
const TRENDS: Trend[] = ["Rising", "Steady", "Falling"];
const PRIORITIES: WaiverPriority[] = ["High", "Medium", "Low"];

type FormValue = Omit<WaiverTarget, "id" | "isSample">;

export default function WaiverFormModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: FormValue) => void;
}) {
  const [values, setValues] = useState<FormValue>({
    name: "",
    nflTeam: "",
    position: "WR",
    projectedPoints: 10,
    trend: "Steady",
    notes: "",
    priority: "Medium",
    potentialDrop: "",
  });

  function set<K extends keyof FormValue>(key: K, value: FormValue[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) return;
    onSave({
      ...values,
      name: values.name.trim(),
      nflTeam: values.nflTeam.trim().toUpperCase() || "FA",
      projectedPoints: Number(values.projectedPoints) || 0,
    });
  }

  return (
    <Modal eyebrow="WAIVER TARGET" title="Save a player from ESPN's waiver wire" onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-2 gap-3">
        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Player name
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="Player available in your league"
          />
        </label>
        <label className="text-[11px] font-bold text-white/60">
          NFL team
          <input
            value={values.nflTeam}
            onChange={(e) => set("nflTeam", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="SEA"
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
          Trend
          <select
            value={values.trend}
            onChange={(e) => set("trend", e.target.value as Trend)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {TRENDS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Priority
          <div className="mt-1 grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => set("priority", p)}
                className={`rounded-xl border py-2 text-[12px] font-bold ${
                  values.priority === p
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/15 text-white/60"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </label>
        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Potential player to drop (optional)
          <input
            value={values.potentialDrop}
            onChange={(e) => set("potentialDrop", e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="e.g. bench WR you rarely start"
          />
        </label>
        <label className="col-span-2 text-[11px] font-bold text-white/60">
          Why this helps your roster
          <textarea
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            className="mt-1 min-h-[70px] w-full resize-y rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            placeholder="e.g. more targets lately and your WR room needs depth"
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
            Save target
          </button>
        </div>
      </form>
    </Modal>
  );
}
