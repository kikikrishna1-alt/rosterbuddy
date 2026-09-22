"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { buildRecommendations, computeReadiness } from "@/lib/logic";
import ReadinessRing from "@/components/ReadinessRing";
import RecommendationCard from "@/components/RecommendationCard";
import WeekTimeline from "@/components/WeekTimeline";
import SampleDataBadge from "@/components/SampleDataBadge";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { league, players, waivers } = useApp();
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const readiness = useMemo(() => computeReadiness(players), [players]);
  const recs = useMemo(() => buildRecommendations(players, waivers), [players, waivers]);
  const hasSample = players.some((p) => p.isSample) || waivers.some((w) => w.isSample);

  const totalIssues = recs.doNow.length + recs.watch.length;
  const allGood = totalIssues === 0 && recs.opportunity.length === 0;

  return (
    <main className="page-shell">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-white/55">
            {greeting()}, {league.managerName || "there"} 👋
          </p>
          <h1 className="mt-0.5 text-[19px] font-extrabold tracking-tight text-white">
            Week {league.currentWeek} Game Plan
          </h1>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-800 text-base"
        >
          ⚙️
        </Link>
      </header>

      {hasSample && (
        <div className="mt-3 flex items-center gap-2">
          <SampleDataBadge />
          <span className="text-[11px] text-white/45">
            Demo info to get you started — edit it in Team &amp; Waivers.
          </span>
        </div>
      )}

      <section className="mt-4 rounded-3xl border border-white/10 bg-cream p-5 text-navy-900 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-navy-900/8 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-navy-900/60">
              TEAM READINESS
            </span>
            <h2 className="mt-2 text-[17px] font-extrabold leading-snug">{readiness.label}</h2>
            {league.currentOpponent && (
              <p className="mt-1 text-[12px] text-navy-900/55">
                {league.teamName || "Your team"} vs. {league.currentOpponent}
              </p>
            )}
          </div>
          <ReadinessRing score={readiness.score} tone={readiness.tone} />
        </div>
        <button
          onClick={() => setLastChecked(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))}
          className="mt-4 w-full rounded-2xl bg-navy-900 py-3.5 text-[14px] font-extrabold text-lime"
        >
          Check my lineup
        </button>
        {lastChecked && (
          <p className="mt-2 text-center text-[11px] text-navy-900/45">
            Last checked at {lastChecked}
          </p>
        )}
      </section>

      <section className="mt-6 space-y-3">
        {recs.doNow.length > 0 && (
          <div>
            <SectionLabel label="DO NOW" count={recs.doNow.length} />
            <div className="mt-2 space-y-2.5">
              {recs.doNow.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {recs.watch.length > 0 && (
          <div className="pt-1">
            <SectionLabel label="WATCH" count={recs.watch.length} />
            <div className="mt-2 space-y-2.5">
              {recs.watch.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {recs.opportunity.length > 0 && (
          <div className="pt-1">
            <SectionLabel label="OPPORTUNITIES" count={recs.opportunity.length} />
            <div className="mt-2 space-y-2.5">
              {recs.opportunity.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {allGood && (
          <div className="rounded-2xl border border-status-good/25 bg-status-good/8 p-5 text-center">
            <span className="text-2xl">✅</span>
            <h3 className="mt-2 text-[15px] font-bold text-white">You&apos;re looking good for Sunday.</h3>
            <p className="mt-1 text-[13px] text-white/55">
              Nothing urgent right now. Check back after Friday injury updates.
            </p>
          </div>
        )}
      </section>

      <div className="mt-6">
        <WeekTimeline />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-navy-800 p-4">
        <span className="text-xl">🧠</span>
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">ROSTERBUDDY SAYS</span>
          <p className="mt-1 text-[13px] leading-relaxed text-white/65">
            Fantasy is mostly decision hygiene. You don&apos;t need to know every NFL player —
            just start active players, monitor injuries, use waivers, and make one decision
            at a time.
          </p>
        </div>
      </div>

      <p className="mt-6 px-1 text-center text-[10px] leading-relaxed text-white/30">
        RosterBuddy is a companion, not a replacement for ESPN. Data you enter is stored only
        on this device and is never verified against live NFL stats.
      </p>
    </main>
  );
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  const icon = label === "DO NOW" ? "🚨" : label === "WATCH" ? "👀" : "✨";
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="text-sm">{icon}</span>
      <h3 className="text-[13px] font-extrabold tracking-wide text-white/85">{label}</h3>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/60">
        {count}
      </span>
    </div>
  );
}
