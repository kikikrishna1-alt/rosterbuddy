"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Player } from "@/lib/types";
import { comparePlayers, isUnavailable } from "@/lib/logic";
import StatusBadge from "@/components/StatusBadge";
import { GLOSSARY } from "@/lib/glossary";

const RELEVANT_TERMS = ["Targets", "Touches", "Snap share", "Floor", "Ceiling", "PROJ", "Matchup"];

export default function StartSitPage() {
  const { players } = useApp();
  const [showTeach, setShowTeach] = useState(false);

  const candidates = useMemo(
    () => players.filter((p) => p.position !== "D/ST" && p.position !== "K"),
    [players]
  );

  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");

  const a = candidates.find((p) => p.id === idA) || candidates[0];
  const b = candidates.find((p) => p.id === idB) || candidates[1];

  const comparison = a && b && a.id !== b.id ? comparePlayers(a, b) : null;

  return (
    <main className="page-shell">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">DECISION HELPER</span>
          <h1 className="mt-0.5 text-[20px] font-extrabold text-white">Who should I start?</h1>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-800 text-base"
          aria-label="Back home"
        >
          🏠
        </Link>
      </header>

      {candidates.length < 2 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-center text-[12px] text-white/45">
          Add at least two skill-position players on your Team page to compare them here.
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-start gap-2">
            <PlayerPicker label="Player A" value={a?.id || ""} onChange={setIdA} players={candidates} />
            <div className="pt-8 text-center text-[11px] font-extrabold text-white/40">VS</div>
            <PlayerPicker label="Player B" value={b?.id || ""} onChange={setIdB} players={candidates} />
          </div>

          {!comparison && a && b && a.id === b.id && (
            <p className="mt-4 text-center text-[12px] text-white/40">
              Pick two different players to compare them.
            </p>
          )}

          {comparison && (
            <section className="mt-5 rounded-3xl border border-lime/25 bg-cream p-5 text-navy-900 shadow-card">
              <span className="text-[10px] font-extrabold tracking-wide text-navy-900/50">
                ROSTERBUDDY PICK
              </span>
              <h2 className="mt-1 text-[22px] font-extrabold leading-tight">
                Start {comparison.recommended.name}
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-900/60">
                Based on the information you entered, {comparison.recommended.name} looks like
                the safer start this week. This is a beginner-friendly estimate, not a
                guarantee — real games are unpredictable.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Tag label="SAFER PLAY" value={comparison.saferPlay.name} />
                <Tag label="HIGHER UPSIDE" value={comparison.higherUpside.name} />
                <Tag
                  label="INJURY RISK"
                  value={
                    isUnavailable(a.status) || isUnavailable(b.status) || a.status !== "Healthy" || b.status !== "Healthy"
                      ? [a, b].find((p) => p.status !== "Healthy")?.name || "Low for both"
                      : "Low for both"
                  }
                />
                <Tag
                  label="MATCHUP"
                  value={
                    comparison.recommended.matchup === comparison.other.matchup
                      ? "Similar"
                      : comparison.recommended.name
                  }
                />
              </div>

              <div className="mt-4 space-y-2">
                {comparison.reasoningLines.map((line, i) => (
                  <p
                    key={i}
                    className="rounded-xl bg-navy-900/5 p-3 text-[12px] leading-relaxed text-navy-900/75"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </section>
          )}

          {a && b && (
            <section className="mt-4 grid grid-cols-2 gap-2.5">
              <PlayerStatCard player={a} />
              <PlayerStatCard player={b} />
            </section>
          )}

          <button
            onClick={() => setShowTeach((v) => !v)}
            className="mt-5 w-full rounded-2xl border border-white/12 bg-navy-800 py-3 text-[13px] font-bold text-white/75"
          >
            🎓 Teach me why {showTeach ? "−" : "+"}
          </button>
          {showTeach && (
            <div className="mt-3 space-y-2">
              {GLOSSARY.filter((g) => RELEVANT_TERMS.includes(g.term)).map((g) => (
                <div key={g.term} className="rounded-xl border border-white/10 bg-navy-800 p-3.5">
                  <p className="text-[12.5px] font-bold text-lime-dim">{g.term}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/60">{g.detail}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

function PlayerPicker({
  label,
  value,
  onChange,
  players,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  players: { id: string; name: string; position: string }[];
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-navy-800 p-3">
      <span className="text-[10px] font-bold uppercase tracking-wide text-white/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-white/15 bg-navy-900 px-2 py-2 text-[12.5px] font-semibold text-white"
      >
        {players.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.position})
          </option>
        ))}
      </select>
    </label>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-navy-900/6 p-3">
      <span className="block text-[9px] font-extrabold tracking-wide text-navy-900/45">{label}</span>
      <span className="mt-0.5 block truncate text-[12.5px] font-bold text-navy-900">{value}</span>
    </div>
  );
}

function PlayerStatCard({ player }: { player: Player }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800 p-3.5">
      <p className="truncate text-[13px] font-bold text-white">{player.name}</p>
      <p className="mt-0.5 text-[11px] text-white/45">
        {player.position} · {player.nflTeam}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <StatusBadge status={player.status} full />
        <span className="text-[13px] font-extrabold text-white">{player.projectedPoints.toFixed(1)}</span>
        <span className="text-[10px] text-white/40">proj</span>
      </div>
      <p className="mt-2 text-[11px] text-white/50">{player.matchup} matchup · {player.consistency}</p>
      {player.opportunity && <p className="mt-1 text-[11px] text-white/35">{player.opportunity}</p>}
    </div>
  );
}
