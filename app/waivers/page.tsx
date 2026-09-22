"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { WaiverTarget } from "@/lib/types";
import WaiverFormModal from "@/components/WaiverFormModal";
import SampleDataBadge from "@/components/SampleDataBadge";

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };
const PRIORITY_STYLES: Record<string, string> = {
  High: "bg-status-bad/15 text-status-bad",
  Medium: "bg-status-watch/15 text-status-watch",
  Low: "bg-status-good/15 text-status-good",
};
const TREND_ICON: Record<string, string> = { Rising: "📈", Steady: "➡️", Falling: "📉" };

const FAQ = [
  {
    q: "What are waivers?",
    a: "Waivers are a short claim period for players who aren't on any team. Instead of first-come-first-served, everyone submits requests and the league's rules decide who gets the player.",
  },
  {
    q: "What is waiver priority?",
    a: "Your order in line for claiming players. In priority-based leagues, successfully claiming a player usually sends you to the back of the line for next time.",
  },
  {
    q: "What is a free agent?",
    a: "Once the waiver period passes and nobody claims a player, they typically become a free agent — anyone can add them immediately, no waiting required.",
  },
  {
    q: "Waiver claim vs. free agent add — what's the difference?",
    a: "A waiver claim goes through a review period and is awarded by priority or budget. A free agent add happens instantly, first-come-first-served, with no waiting period.",
  },
];

export default function WaiversPage() {
  const { league, waivers, addWaiver, removeWaiver, addWaiverToRoster } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sorted = useMemo(
    () =>
      [...waivers].sort(
        (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.projectedPoints - a.projectedPoints
      ),
    [waivers]
  );
  const topTargets = sorted.slice(0, 3);

  return (
    <main className="page-shell">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">FREE PLAYER SHOPPING</span>
          <h1 className="mt-0.5 text-[20px] font-extrabold text-white">Waiver Assistant</h1>
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
        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/60">
          Waiver type: {league.waiverType}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-lime/20 bg-lime/5 p-3.5 text-[12px] leading-relaxed text-white/70">
        <strong className="text-white">Beginner rule:</strong> your draft isn&apos;t your final
        team. Use waivers to replace injuries, cover bye weeks, and grab players whose roles
        are growing — check ESPN&apos;s available players, then track your favorites here.
      </div>

      {topTargets.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm">🏆</span>
            <h2 className="text-[13px] font-extrabold tracking-wide text-white/85">
              TOP WAIVER TARGETS
            </h2>
          </div>
          <div className="mt-2 space-y-2.5">
            {topTargets.map((w, i) => (
              <WaiverCard
                key={w.id}
                target={w}
                rank={i + 1}
                onAdd={() => addWaiverToRoster(w.id)}
                onRemove={() => removeWaiver(w.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[13px] font-extrabold tracking-wide text-white/85">
            All saved targets ({sorted.length})
          </h2>
          <button onClick={() => setShowAdd(true)} className="text-[12px] font-bold text-lime-dim">
            + Add target
          </button>
        </div>
        <div className="mt-2 space-y-2.5">
          {sorted.slice(3).map((w, i) => (
            <WaiverCard
              key={w.id}
              target={w}
              rank={i + 4}
              onAdd={() => addWaiverToRoster(w.id)}
              onRemove={() => removeWaiver(w.id)}
            />
          ))}
          {sorted.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-[12px] text-white/40">
              No saved waiver targets yet. Add players you spot available in ESPN.
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 w-full rounded-2xl border border-dashed border-white/20 py-3 text-[12.5px] font-bold text-white/60"
        >
          + Add a player from ESPN&apos;s waiver wire
        </button>
      </section>

      <section className="mt-7">
        <h2 className="px-1 text-[13px] font-extrabold tracking-wide text-white/85">
          Waivers, explained
        </h2>
        <div className="mt-2 space-y-2">
          {FAQ.map((item, i) => (
            <button
              key={item.q}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="block w-full rounded-2xl border border-white/10 bg-navy-800 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-bold text-white">{item.q}</span>
                <span className="text-white/40">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && (
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{item.a}</p>
              )}
            </button>
          ))}
        </div>
      </section>

      {showAdd && (
        <WaiverFormModal
          onClose={() => setShowAdd(false)}
          onSave={(values) => {
            addWaiver(values);
            setShowAdd(false);
          }}
        />
      )}
    </main>
  );
}

function WaiverCard({
  target,
  rank,
  onAdd,
  onRemove,
}: {
  target: WaiverTarget;
  rank: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-navy-800 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-700 text-[11px] font-extrabold text-white/60">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-[14px] font-bold text-white">{target.name}</p>
            <span className="text-[11px] text-white/45">
              {target.position} · {target.nflTeam}
            </span>
            {target.isSample && <SampleDataBadge />}
          </div>
          {target.notes && (
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/55">{target.notes}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10.5px]">
            <span className="font-bold text-white/70">{target.projectedPoints.toFixed(1)} proj</span>
            <span className="text-white/40">
              {TREND_ICON[target.trend]} {target.trend}
            </span>
            <span className={`rounded-full px-2 py-0.5 font-extrabold uppercase ${PRIORITY_STYLES[target.priority]}`}>
              {target.priority} priority
            </span>
          </div>
          {target.potentialDrop && (
            <p className="mt-1.5 text-[11px] text-white/40">
              Possible drop: {target.potentialDrop}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button onClick={onAdd} className="rounded-full bg-lime px-3.5 py-1.5 text-[11.5px] font-extrabold text-navy-950">
              + Add
            </button>
            <button onClick={onRemove} className="text-[11.5px] font-bold text-white/40">
              Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
