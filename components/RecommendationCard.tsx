"use client";

import { useState } from "react";
import { Recommendation } from "@/lib/types";
import { useApp } from "@/context/AppContext";

const CATEGORY_STYLES: Record<
  Recommendation["category"],
  { border: string; iconBg: string; icon: string; label: string; labelColor: string }
> = {
  doNow: {
    border: "border-status-bad/30",
    iconBg: "bg-status-bad/15",
    icon: "🚨",
    label: "DO NOW",
    labelColor: "text-status-bad",
  },
  watch: {
    border: "border-status-watch/30",
    iconBg: "bg-status-watch/15",
    icon: "👀",
    label: "WATCH",
    labelColor: "text-status-watch",
  },
  opportunity: {
    border: "border-lime/30",
    iconBg: "bg-lime/15",
    icon: "✨",
    label: "OPPORTUNITY",
    labelColor: "text-lime-dim",
  },
};

const URGENCY_STYLES: Record<Recommendation["urgency"], string> = {
  Now: "bg-status-bad/15 text-status-bad",
  Soon: "bg-status-watch/15 text-status-watch",
  FYI: "bg-white/10 text-white/60",
};

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { applySwap } = useApp();
  const [showWhy, setShowWhy] = useState(false);
  const [showTeach, setShowTeach] = useState(false);
  const [applied, setApplied] = useState(false);
  const style = CATEGORY_STYLES[rec.category];

  return (
    <article
      className={`rounded-2xl border bg-cream p-4 text-navy-900 shadow-soft ${style.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${style.iconBg}`}>
          {style.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-extrabold tracking-wide ${style.labelColor}`}>
              {style.label}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${URGENCY_STYLES[rec.urgency]}`}>
              {rec.urgency}
            </span>
          </div>
          <h4 className="mt-1 text-[15px] font-bold leading-snug">{rec.title}</h4>
          <p className="mt-1 text-[13px] leading-relaxed text-navy-900/65">{rec.problem}</p>
          <p className="mt-2 text-[13px] font-semibold leading-relaxed text-navy-900/85">
            {rec.action}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {rec.swap && !applied && (
              <button
                onClick={() => {
                  applySwap(rec.swap!.outId, rec.swap!.inId, rec.swap!.slot);
                  setApplied(true);
                }}
                className="rounded-full bg-navy-900 px-3.5 py-1.5 text-[12px] font-bold text-lime"
              >
                Make this swap
              </button>
            )}
            {applied && (
              <span className="text-[12px] font-semibold text-status-good">Swap applied ✓</span>
            )}
            <button
              onClick={() => setShowWhy((v) => !v)}
              className="rounded-full border border-navy-900/15 px-3 py-1.5 text-[12px] font-semibold text-navy-900/70"
            >
              Why? {showWhy ? "−" : "+"}
            </button>
            <button
              onClick={() => setShowTeach((v) => !v)}
              className="rounded-full border border-navy-900/15 px-3 py-1.5 text-[12px] font-semibold text-navy-900/70"
            >
              Teach me {showTeach ? "−" : "+"}
            </button>
          </div>

          {showWhy && (
            <p className="mt-2 rounded-xl bg-navy-900/5 p-3 text-[12px] leading-relaxed text-navy-900/75">
              {rec.why}
            </p>
          )}
          {showTeach && (
            <p className="mt-2 rounded-xl bg-lime/10 p-3 text-[12px] leading-relaxed text-navy-900/75">
              🎓 {rec.teachMe}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
