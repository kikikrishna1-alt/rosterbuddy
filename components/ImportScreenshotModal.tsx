"use client";

import { ChangeEvent, useState } from "react";
import Modal from "./Modal";
import { useApp } from "@/context/AppContext";
import { HealthStatus, ImportedPlayerRow, Position } from "@/lib/types";
import { fileToResizedDataUrl } from "@/lib/image";

const POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "D/ST", "K"];
const STATUSES: HealthStatus[] = ["Healthy", "Questionable", "Doubtful", "Out", "IR", "Bye"];

type Stage = "idle" | "reading" | "loading" | "review" | "error";

interface Row extends ImportedPlayerRow {
  included: boolean;
}

export default function ImportScreenshotModal({ onClose }: { onClose: () => void }) {
  const { league, addPlayer } = useApp();
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [added, setAdded] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setStage("reading");
    setErrorMsg("");
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setPreview(dataUrl);
      setStage("loading");

      const res = await fetch("/api/import-roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, apiKey: league.openaiApiKey }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong reading that screenshot.");
        setStage("error");
        return;
      }

      setRows((data.players as ImportedPlayerRow[]).map((p) => ({ ...p, included: true })));
      setStage("review");
    } catch {
      setErrorMsg("Something went wrong reading that screenshot. Check your connection and try again.");
      setStage("error");
    }
  }

  function updateRow(i: number, partial: Partial<Row>) {
    setRows((current) => current.map((r, idx) => (idx === i ? { ...r, ...partial } : r)));
  }

  function confirmAdd() {
    rows
      .filter((r) => r.included)
      .forEach((r) => {
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
          slot: "BENCH",
          notes: r.slotHint ? `Imported from ESPN screenshot (shown as ${r.slotHint}).` : "Imported from ESPN screenshot.",
        });
      });
    setAdded(true);
  }

  const includedCount = rows.filter((r) => r.included).length;

  return (
    <Modal eyebrow="IMPORT FROM ESPN" title="Read a screenshot" onClose={onClose}>
      {stage !== "review" && !added && (
        <div>
          <p className="text-[12.5px] leading-relaxed text-white/60">
            Screenshot your ESPN roster or players screen, then pick it below. We&apos;ll read
            the players out of it and let you review before anything is added.
          </p>

          {preview && (
            <img
              src={preview}
              alt="Screenshot preview"
              className="mt-3 max-h-48 w-full rounded-xl border border-white/10 object-contain"
            />
          )}

          <label className="mt-4 block cursor-pointer rounded-2xl border border-dashed border-white/25 bg-navy-900/50 py-8 text-center">
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <span className="block text-2xl">📸</span>
            <span className="mt-2 block text-[13px] font-bold text-white">
              {stage === "reading" || stage === "loading" ? "Working…" : "Choose a screenshot"}
            </span>
            <span className="mt-1 block text-[11px] text-white/40">
              From your camera roll or camera
            </span>
          </label>

          {stage === "loading" && (
            <p className="mt-3 text-center text-[12px] text-white/50">
              Reading your screenshot with AI — this can take a few seconds…
            </p>
          )}

          {stage === "error" && (
            <div className="mt-3 rounded-xl border border-status-bad/25 bg-status-bad/8 p-3 text-[12px] text-status-bad">
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {stage === "review" && !added && (
        <div>
          <p className="text-[12.5px] text-white/60">
            Found {rows.length} player{rows.length === 1 ? "" : "s"}. Uncheck any that are wrong,
            and fix anything that looks off before adding them to your bench.
          </p>
          <div className="mt-3 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
            {rows.map((row, i) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="rounded-full px-4 py-2 text-[13px] font-semibold text-white/60">
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              disabled={includedCount === 0}
              className="rounded-full bg-lime px-5 py-2 text-[13px] font-bold text-navy-950 disabled:opacity-40"
            >
              Add {includedCount} to bench
            </button>
          </div>
        </div>
      )}

      {added && (
        <div className="py-4 text-center">
          <span className="text-2xl">✅</span>
          <p className="mt-2 text-[14px] font-bold text-white">
            Added {includedCount} player{includedCount === 1 ? "" : "s"} to your bench.
          </p>
          <p className="mt-1 text-[12px] text-white/50">
            Head to Team to move them into your starting lineup.
          </p>
          <button onClick={onClose} className="mt-4 rounded-full bg-lime px-5 py-2 text-[13px] font-bold text-navy-950">
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
