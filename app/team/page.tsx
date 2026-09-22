"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Player, RosterSlot } from "@/lib/types";
import { STARTER_SLOT_ORDER, SLOT_LABELS, SLOT_BEGINNER_LABELS, eligibleSlotsForPosition } from "@/lib/slots";
import StatusBadge from "@/components/StatusBadge";
import PlayerFormModal from "@/components/PlayerFormModal";
import SampleDataBadge from "@/components/SampleDataBadge";
import ImportScreenshotModal from "@/components/ImportScreenshotModal";
import PlayerActionSheet from "@/components/PlayerActionSheet";

export default function TeamPage() {
  const { league, players, addPlayer, updatePlayer, deletePlayer, movePlayer, resetSampleRoster } =
    useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const bench = players.filter((p) => p.slot === "BENCH");

  return (
    <main className="page-shell">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">MY TEAM</span>
          <h1 className="mt-0.5 text-[20px] font-extrabold text-white">
            {league.teamName || "Your fantasy team"}
          </h1>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-800 text-base"
          aria-label="Back home"
        >
          🏠
        </Link>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-full bg-lime px-4 py-2 text-[12px] font-extrabold text-navy-950"
        >
          + Add player
        </button>
        <button
          onClick={() => setShowImport(true)}
          className="rounded-full border border-lime/30 bg-lime/8 px-4 py-2 text-[12px] font-bold text-lime-dim"
        >
          📸 Import from ESPN screenshot
        </button>
        <button
          onClick={() => setConfirmReset(true)}
          className="rounded-full border border-white/15 px-4 py-2 text-[12px] font-bold text-white/65"
        >
          Reset to sample roster
        </button>
      </div>

      <div className="mt-4 flex gap-4 px-1 text-[11px] text-white/50">
        <Legend tone="good" label="Healthy" />
        <Legend tone="watch" label="Watch" />
        <Legend tone="bad" label="Needs action" />
      </div>

      <section className="mt-2 overflow-hidden rounded-2xl border border-white/10">
        {STARTER_SLOT_ORDER.map((slot) => {
          const player = players.find((p) => p.slot === slot);
          return (
            <div
              key={slot}
              className={`grid grid-cols-[56px_1fr] items-center gap-2 border-b border-white/8 bg-navy-800 px-3 py-3 last:border-b-0 ${
                !player ? "bg-status-bad/5" : ""
              }`}
            >
              <div className="leading-tight">
                <span className="block text-[11px] font-extrabold text-white/70">
                  {SLOT_LABELS[slot]}
                </span>
                {league.beginnerMode && (
                  <span className="mt-0.5 block text-[8.5px] font-semibold text-white/35">
                    {SLOT_BEGINNER_LABELS[slot]}
                  </span>
                )}
              </div>
              {player ? (
                <PlayerRow
                  player={player}
                  onEdit={() => setEditing(player)}
                  onDelete={() => deletePlayer(player.id)}
                  onMove={(s) => movePlayer(player.id, s)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-status-bad">
                    Empty starting slot
                  </span>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="text-[11px] font-bold text-lime-dim"
                  >
                    Fill it
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="mt-6 flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">BENCH</span>
          <h3 className="mt-0.5 text-[15px] font-bold text-white">Backup players</h3>
        </div>
        <span className="text-[11px] text-white/40">{bench.length} players</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {bench.map((p) => (
          <BenchCard
            key={p.id}
            player={p}
            onEdit={() => setEditing(p)}
            onDelete={() => deletePlayer(p.id)}
            onMove={(s) => movePlayer(p.id, s)}
          />
        ))}
        {bench.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-white/15 p-6 text-center text-[12px] text-white/40">
            No bench players yet. Add one to build depth.
          </div>
        )}
      </div>

      {showAdd && (
        <PlayerFormModal
          onClose={() => setShowAdd(false)}
          onSave={(values) => {
            addPlayer(values);
            setShowAdd(false);
          }}
        />
      )}

      {editing && (
        <PlayerFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(values) => {
            updatePlayer(editing.id, values);
            setEditing(null);
          }}
        />
      )}

      {showImport && <ImportScreenshotModal onClose={() => setShowImport(false)} />}

      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-white/10 bg-navy-800 p-5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 className="text-[15px] font-bold text-white">Reset to sample roster?</h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">
              This replaces your current roster with RosterBuddy&apos;s sample players and
              waiver targets, clearly labeled as demo data. This can&apos;t be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-full px-4 py-2 text-[13px] font-semibold text-white/60"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetSampleRoster();
                  setConfirmReset(false);
                }}
                className="rounded-full bg-lime px-4 py-2 text-[13px] font-bold text-navy-950"
              >
                Reset roster
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Legend({ tone, label }: { tone: "good" | "watch" | "bad"; label: string }) {
  const dot = { good: "bg-status-good", watch: "bg-status-watch", bad: "bg-status-bad" }[tone];
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function PlayerRow({
  player,
  onEdit,
  onDelete,
  onMove,
}: {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (slot: RosterSlot) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const eligible = eligibleSlotsForPosition(player.position);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[13.5px] font-bold text-white">{player.name}</p>
          {player.isSample && <SampleDataBadge />}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-white/45">
          {player.nflTeam} · vs {player.opponent} · {player.matchup} matchup
        </p>
        {player.notes && (
          <p className="mt-0.5 truncate text-[11px] text-white/35">{player.notes}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="text-right">
          <StatusBadge status={player.status} />
          <p className="mt-1 text-[13px] font-extrabold text-white">
            {player.projectedPoints.toFixed(1)}
          </p>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/50"
          aria-label="Player options"
        >
          •••
        </button>
      </div>

      {menuOpen && (
        <PlayerActionSheet
          playerName={player.name}
          currentSlot={player.slot}
          eligibleSlots={eligible}
          onMove={onMove}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

function BenchCard({
  player,
  onEdit,
  onDelete,
  onMove,
}: {
  player: Player;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (slot: RosterSlot) => void;
}) {
  const eligible = eligibleSlotsForPosition(player.position);
  return (
    <article className="rounded-2xl border border-white/10 bg-navy-800 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[13.5px] font-bold text-white">{player.name}</p>
            {player.isSample && <SampleDataBadge />}
          </div>
          <p className="mt-0.5 text-[11px] text-white/45">
            {player.position} · {player.nflTeam}
          </p>
        </div>
        <StatusBadge status={player.status} />
      </div>
      <p className="mt-2 text-[11px] text-white/50">
        {player.projectedPoints.toFixed(1)} proj · {player.matchup} matchup
      </p>
      {player.notes && <p className="mt-1 text-[11px] text-white/35">{player.notes}</p>}
      <div className="mt-3 flex items-center gap-2">
        <select
          value="BENCH"
          onChange={(e) => onMove(e.target.value as RosterSlot)}
          className="flex-1 rounded-lg border border-white/15 bg-navy-900 px-2 py-1.5 text-[11px] text-white"
        >
          <option value="BENCH">Move to starter…</option>
          {eligible.map((s) => (
            <option key={s} value={s}>
              {SLOT_LABELS[s]}
            </option>
          ))}
        </select>
        <button onClick={onEdit} className="text-[11px] font-bold text-lime-dim">
          Edit
        </button>
        <button onClick={onDelete} className="text-[11px] font-bold text-status-bad">
          Remove
        </button>
      </div>
    </article>
  );
}
