"use client";

import { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/context/AppContext";
import { HealthStatus, ImportedPlayerRow, Position, RosterSlot } from "@/lib/types";
import { assignImportSlots, eligibleSlotsForPosition, SLOT_LABELS, StarterSlotId } from "@/lib/slots";
import { fileToResizedDataUrl } from "@/lib/image";

const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "D/ST", "K"];
const STATUSES: HealthStatus[] = ["Healthy", "Questionable", "Doubtful", "Out", "IR", "Bye"];

interface Row extends ImportedPlayerRow {
  included: boolean;
  targetSlot: RosterSlot;
}

export default function ImportScreenshotModal({ onClose }: { onClose: () => void }) {
  const { league, players, addPlayer } = useApp();
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState<{ starters: number; bench: number } | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      const dataUrl = await fileToResizedDataUrl(file);

      const res = await fetch("/api/import-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, apiKey: league.openaiApiKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong reading that screenshot.");
        setBusy(false);
        return;
      }

      const extracted = data.players as ImportedPlayerRow[];
      setRows((current) => {
        const occupied: RosterSlot[] = [
          ...players.map((p) => p.slot),
          ...current.map((r) => r.targetSlot),
        ];
        const assigned = assignImportSlots(extracted, occupied);
        const newRows: Row[] = extracted.map((p, i) => ({
          ...p,
          included: true,
          targetSlot: assigned[i],
        }));
        return [...current, ...newRows];
      });
      setBusy(false);
    } catch {
      setError("Something went wrong reading that screenshot. Check your connection and try again.");
      setBusy(false);
    }
  }

  function updateRow(i: number, partial: Partial<Row>) {
    setRows((current) =>
      current.map((r, idx) => {
        if (idx !== i) return r;
        const next = { ...r, ...partial };
        if (partial.position) {
          const eligible = eligibleSlotsForPosition(partial.position);
          if (next.targetSlot !== "BENCH" && !eligible.includes(next.targetSlot as StarterSlotId)) {
            next.targetSlot = "BENCH";
          }
        }
        return next;
      })
    );
  }

  function confirmAdd() {
    const claimed = new Set<string>(players.filter((p) => p.slot !== "BENCH").map((p) => p.slot));
    let starters = 0;
    let bench = 0;

    rows
      .filter((r) => r.included)
      .forEach((r) => {
        let slot: RosterSlot = r.targetSlot;
        if (slot !== "BENCH") {
          if (claimed.has(slot)) {
            slot = "BENCH";
          } else {
            claimed.add(slot);
          }
        }
        if (slot === "BENCH") bench += 1;
        else starters += 1;

        addPlayer({
          name: r.name,
          nflTeam: r.nflTeam || "FA",
          position: r.position,
          opponent: r.opponent || "TBD",
          projectedPoints: r.projectedPoints,
          status: r.status,
          matchup: "Average",
          opportunity: "",
          consistency: "Unknown",
          slot,
          notes: "Imported from ESPN screenshot.",
        });
      });
    setAdded({ starters, bench });
  }

  const includedCount = rows.filter((r) => r.included).length;

  return (
    <Modal eyebrow="IMPORT FROM ESPN" title="Read a screenshot" onClose={onClose}>
      {!added && rows.length === 0 && (
        <div>
          <p className="text-[12.5px] leading-relaxed text-white/60">
            Screenshot your ESPN roster or players screen, then pick it below. If your whole
            roster doesn&apos;t fit on one screen, that&apos;s fine — you can add more
            screenshots before confirming.
          </p>

          <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-white/25 bg-navy-900/50 py-8 text-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <span className="block text-2xl">📸</span>
            <span className="mt-2 block text-[13px] font-bold text-white">
              {busy ? "Reading your screenshot…" : "Choose a screenshot"}
            </span>
            <span className="mt-1 block text-[11px] text-white/40">
              From your camera roll or camera
            </span>
          </label>

          {error && (
            <div className="mt-3 rounded-xl border border-status-bad/25 bg-status-bad/8 p-3 text-[12px] text-status-bad">
              {error}
            </div>
          )}
        </div>
      )}

      {!added && rows.length > 0 && (
        <div>
          <p className="text-[12.5px] text-white/60">
            Found {rows.length} player{rows.length === 1 ? "" : "s"}. We matched each one to the
            slot ESPN showed where we could — uncheck any that are wrong, and fix or reassign
            anything that looks off before adding them.
          </p>
          <div className="mt-3 max-h-[46vh] space-y-2 overflow-y-auto pr-1">
            {rows.map((row, i) => {
              const slotOptions = eligibleSlotsForPosition(row.position);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${row.included ? "border-white/12 bg-navy-900/60" : "border-white/5 bg-navy-900/25 opacity-50"}`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={row.included}
                      onChange={(e) => updateRow(i, { included: e.target.checked })}
                      className="mt-1.5 h-4 w-4 shrink-0 accent-lime"
                    />
                    <div className="grid flex-1 grid-cols-2 gap-2">
                      <input
                        value={row.name}
                        onChange={(e) => updateRow(i, { name: e.target.value })}
                        className="col-span-2 rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[12.5px] font-bold text-white outline-none focus:border-lime"
                      />
                      <select
                        value={row.position}
                        onChange={(e) => updateRow(i, { position: e.target.value as Position })}
                        className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[11.5px] text-white"
                      >
                        {POSITIONS.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                      <select
                        value={row.status}
                        onChange={(e) => updateRow(i, { status: e.target.value as HealthStatus })}
                        className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[11.5px] text-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <input
                        value={row.nflTeam}
                        onChange={(e) => updateRow(i, { nflTeam: e.target.value.toUpperCase() })}
                        placeholder="Team"
                        className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[11.5px] text-white"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={row.projectedPoints}
                        onChange={(e) => updateRow(i, { projectedPoints: Number(e.target.value) || 0 })}
                        placeholder="Proj"
                        className="rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[11.5px] text-white"
                      />
                      <label className="col-span-2 text-[9.5px] font-bold text-white/40">
                        Goes to
                        <select
                          value={row.targetSlot}
                          onChange={(e) => updateRow(i, { targetSlot: e.target.value as RosterSlot })}
                          className="mt-1 w-full rounded-lg border border-white/12 bg-navy-900 px-2 py-1.5 text-[11.5px] text-white"
                        >
                          <option value="BENCH">Bench</option>
                          {slotOptions.map((s) => (
                            <option key={s} value={s}>
                              {SLOT_LABELS[s]} (starter)
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <label className="mt-3 block cursor-pointer rounded-xl border border-dashed border-white/20 py-3 text-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <span className="text-[12px] font-bold text-lime-dim">
              {busy ? "Reading…" : "+ Add another screenshot"}
            </span>
          </label>

          {error && (
            <div className="mt-2 rounded-xl border border-status-bad/25 bg-status-bad/8 p-3 text-[12px] text-status-bad">
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-full px-4 py-2 text-[13px] font-semibold text-white/60">
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              disabled={includedCount === 0}
              className="rounded-full bg-lime px-5 py-2 text-[13px] font-bold text-navy-950 disabled:opacity-40"
            >
              Add {includedCount} player{includedCount === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}

      {added && (
        <div className="py-4 text-center">
          <span className="text-2xl">✅</span>
          <p className="mt-2 text-[14px] font-bold text-white">
            Added {added.starters + added.bench} player{added.starters + added.bench === 1 ? "" : "s"}.
          </p>
          <p className="mt-1 text-[12px] text-white/50">
            {added.starters > 0
              ? `${added.starters} went straight into your starting lineup, ${added.bench} to your bench.`
              : "All went to your bench — head to Team to move anyone into a starting slot."}
          </p>
          <button onClick={onClose} className="mt-4 rounded-full bg-lime px-5 py-2 text-[13px] font-bold text-navy-950">
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
