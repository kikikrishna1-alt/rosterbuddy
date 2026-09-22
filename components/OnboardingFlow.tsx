"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LeagueSettings, Platform, ScoringFormat, WaiverType } from "@/lib/types";
import { DEFAULT_LEAGUE } from "@/lib/sampleData";
import Toggle from "./Toggle";

const PLATFORMS: Platform[] = ["ESPN", "Yahoo", "Sleeper", "Other"];
const SCORINGS: { value: ScoringFormat; blurb: string }[] = [
  { value: "PPR", blurb: "1 point per catch — pass-catchers score extra." },
  { value: "Half PPR", blurb: "0.5 points per catch — a middle ground." },
  { value: "Standard", blurb: "No points for catches, only yards & TDs." },
];
const WAIVER_TYPES: { value: WaiverType; blurb: string }[] = [
  { value: "Rolling Priority", blurb: "Managers take turns claiming players in order." },
  { value: "FAAB", blurb: "You bid a budget of fake dollars on players." },
  { value: "Reverse Standings", blurb: "Worse records get first pick of free players." },
  { value: "Not sure yet", blurb: "No worries — you can change this anytime in Settings." },
];

const TOTAL_STEPS = 5;

export default function OnboardingFlow() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Omit<LeagueSettings, "onboardingComplete">>({
    ...DEFAULT_LEAGUE,
  });

  function next() {
    if (step === TOTAL_STEPS - 1) {
      completeOnboarding(form);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const canContinue = step !== 0 || form.managerName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy-radial bg-navy-950">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-10">
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-lime" : "bg-white/10"}`}
            />
          ))}
        </div>

        <div className="flex-1">
          {step === 0 && (
            <div>
              <span className="text-3xl">🏈</span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white">
                Welcome to RosterBuddy
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                Your fantasy football companion for beginners. We&apos;ll ask a few quick
                questions, then tell you exactly what to pay attention to each week.
              </p>
              <div className="mt-6 space-y-4">
                <label className="block text-[12px] font-bold text-white/60">
                  What&apos;s your name?
                  <input
                    autoFocus
                    value={form.managerName}
                    onChange={(e) => setForm((f) => ({ ...f, managerName: e.target.value }))}
                    placeholder="Cesar"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-[15px] text-white outline-none focus:border-lime"
                  />
                </label>
                <label className="block text-[12px] font-bold text-white/60">
                  Your fantasy team name
                  <input
                    value={form.teamName}
                    onChange={(e) => setForm((f) => ({ ...f, teamName: e.target.value }))}
                    placeholder="e.g. Cesar's Cool Team"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-[15px] text-white outline-none focus:border-lime"
                  />
                </label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <span className="text-[11px] font-extrabold tracking-wide text-lime">STEP 2 OF 5</span>
              <h2 className="mt-1 text-xl font-extrabold text-white">Where&apos;s your league?</h2>
              <p className="mt-1.5 text-[13px] text-white/60">
                RosterBuddy doesn&apos;t sync live yet — this just helps us speak your platform&apos;s language.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm((f) => ({ ...f, platform: p }))}
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold ${
                      form.platform === p
                        ? "border-lime bg-lime/10 text-lime"
                        : "border-white/12 bg-navy-800 text-white/70"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="text-[11px] font-extrabold tracking-wide text-lime">STEP 3 OF 5</span>
              <h2 className="mt-1 text-xl font-extrabold text-white">How does your league score?</h2>
              <p className="mt-1.5 text-[13px] text-white/60">
                Check your league settings on {form.platform} if you&apos;re not sure.
              </p>
              <div className="mt-5 space-y-2.5">
                {SCORINGS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setForm((f) => ({ ...f, scoring: s.value }))}
                    className={`block w-full rounded-2xl border px-4 py-3.5 text-left ${
                      form.scoring === s.value
                        ? "border-lime bg-lime/10"
                        : "border-white/12 bg-navy-800"
                    }`}
                  >
                    <span
                      className={`block text-sm font-bold ${
                        form.scoring === s.value ? "text-lime" : "text-white"
                      }`}
                    >
                      {s.value}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-white/55">{s.blurb}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="text-[11px] font-extrabold tracking-wide text-lime">STEP 4 OF 5</span>
              <h2 className="mt-1 text-xl font-extrabold text-white">This week&apos;s matchup</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-[12px] font-bold text-white/60">
                  Current fantasy week
                  <input
                    type="number"
                    min={1}
                    max={18}
                    value={form.currentWeek}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, currentWeek: Number(e.target.value) || 1 }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-[15px] text-white outline-none focus:border-lime"
                  />
                </label>
                <label className="block text-[12px] font-bold text-white/60">
                  Current opponent (optional)
                  <input
                    value={form.currentOpponent}
                    onChange={(e) => setForm((f) => ({ ...f, currentOpponent: e.target.value }))}
                    placeholder="e.g. Asha's Team"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-3 text-[15px] text-white outline-none focus:border-lime"
                  />
                </label>
                <div>
                  <span className="block text-[12px] font-bold text-white/60">
                    Waiver type (if you know it)
                  </span>
                  <div className="mt-1.5 space-y-2">
                    {WAIVER_TYPES.map((w) => (
                      <button
                        key={w.value}
                        onClick={() => setForm((f) => ({ ...f, waiverType: w.value }))}
                        className={`block w-full rounded-xl border px-3.5 py-2.5 text-left ${
                          form.waiverType === w.value
                            ? "border-lime bg-lime/10"
                            : "border-white/12 bg-navy-800"
                        }`}
                      >
                        <span
                          className={`block text-[13px] font-bold ${
                            form.waiverType === w.value ? "text-lime" : "text-white"
                          }`}
                        >
                          {w.value}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-white/50">{w.blurb}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="text-[11px] font-extrabold tracking-wide text-lime">STEP 5 OF 5</span>
              <h2 className="mt-1 text-xl font-extrabold text-white">One last thing</h2>
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/12 bg-navy-800 p-4">
                <div>
                  <span className="block text-sm font-bold text-white">Beginner Mode</span>
                  <span className="mt-0.5 block text-[12px] text-white/55">
                    Translates fantasy jargon into plain language everywhere in the app. You
                    can turn it off anytime once you&apos;re comfortable.
                  </span>
                </div>
                <Toggle
                  on={form.beginnerMode}
                  onChange={(v) => setForm((f) => ({ ...f, beginnerMode: v }))}
                  label="Beginner Mode"
                />
              </div>
              <div className="mt-5 rounded-2xl border border-lime/20 bg-lime/5 p-4 text-[13px] leading-relaxed text-white/70">
                You&apos;re all set, {form.managerName || "there"}. RosterBuddy will load with
                clearly labeled sample data so the app feels alive immediately — jump into
                Team to replace it with your real roster whenever you&apos;re ready.
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={back}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/70"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canContinue}
            className="flex-1 rounded-full bg-lime py-3.5 text-sm font-extrabold text-navy-950 disabled:opacity-40"
          >
            {step === TOTAL_STEPS - 1 ? "Enter RosterBuddy" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
