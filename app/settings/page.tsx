"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Platform, ScoringFormat, WaiverType } from "@/lib/types";
import Toggle from "@/components/Toggle";

const PLATFORMS: Platform[] = ["ESPN", "Yahoo", "Sleeper", "Other"];
const SCORINGS: ScoringFormat[] = ["PPR", "Half PPR", "Standard"];
const WAIVER_TYPES: WaiverType[] = ["Rolling Priority", "FAAB", "Reverse Standings", "Not sure yet"];

export default function SettingsPage() {
  const { league, updateLeague, resetSampleRoster, clearRoster } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <main className="page-shell">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">SETTINGS</span>
          <h1 className="mt-0.5 text-[20px] font-extrabold text-white">Make this yours</h1>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-800 text-base"
          aria-label="Back home"
        >
          🏠
        </Link>
      </header>

      <section className="mt-5 space-y-3.5 rounded-3xl border border-white/10 bg-navy-800 p-5">
        <Field label="Manager name">
          <input
            value={league.managerName}
            onChange={(e) => updateLeague({ managerName: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          />
        </Field>
        <Field label="Team name">
          <input
            value={league.teamName}
            onChange={(e) => updateLeague({ teamName: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Platform">
            <select
              value={league.platform}
              onChange={(e) => updateLeague({ platform: e.target.value as Platform })}
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            >
              {PLATFORMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Scoring">
            <select
              value={league.scoring}
              onChange={(e) => updateLeague({ scoring: e.target.value as ScoringFormat })}
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            >
              {SCORINGS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Current week">
            <input
              type="number"
              min={1}
              max={18}
              value={league.currentWeek}
              onChange={(e) => updateLeague({ currentWeek: Number(e.target.value) || 1 })}
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            />
          </Field>
          <Field label="Current opponent">
            <input
              value={league.currentOpponent}
              onChange={(e) => updateLeague({ currentOpponent: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            />
          </Field>
        </div>
        <Field label="Waiver type">
          <select
            value={league.waiverType}
            onChange={(e) => updateLeague({ waiverType: e.target.value as WaiverType })}
            className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
          >
            {WAIVER_TYPES.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </Field>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-navy-900/60 p-4">
          <div>
            <span className="block text-[13px] font-bold text-white">Beginner Mode</span>
            <span className="mt-0.5 block text-[11.5px] text-white/50">
              Translates fantasy jargon into plain language throughout the app.
            </span>
          </div>
          <Toggle
            on={league.beginnerMode}
            onChange={(v) => updateLeague({ beginnerMode: v })}
            label="Beginner Mode"
          />
        </div>
      </section>

      <section className="mt-6 space-y-2.5">
        <h2 className="px-1 text-[13px] font-extrabold tracking-wide text-white/80">
          AI-assisted import
        </h2>
        <div className="rounded-2xl border border-white/10 bg-navy-800 p-4">
          <span className="block text-[13px] font-bold text-white">OpenAI API key</span>
          <span className="mt-0.5 block text-[11.5px] leading-relaxed text-white/50">
            Optional. Powers &ldquo;Import from ESPN screenshot&rdquo; on the Team page — RosterBuddy
            sends your screenshot and this key to OpenAI to read the players off it. Get a key
            (and add a little credit) at platform.openai.com. This key is stored only in your
            browser and is never sent anywhere except OpenAI, via RosterBuddy&apos;s own import
            function.
          </span>
          <div className="mt-3 flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={league.openaiApiKey}
              onChange={(e) => updateLeague({ openaiApiKey: e.target.value.trim() })}
              placeholder="sk-…"
              className="w-full rounded-xl border border-white/15 bg-navy-900 px-3 py-2.5 text-sm text-white outline-none focus:border-lime"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="shrink-0 rounded-xl border border-white/15 px-3 text-[11px] font-bold text-white/60"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-2.5">
        <h2 className="px-1 text-[13px] font-extrabold tracking-wide text-white/80">Data</h2>
        <button
          onClick={() => setConfirmReset(true)}
          className="w-full rounded-2xl border border-white/10 bg-navy-800 p-4 text-left"
        >
          <span className="block text-[13px] font-bold text-white">Reset sample data</span>
          <span className="mt-0.5 block text-[11.5px] text-white/50">
            Replaces your roster and waiver board with RosterBuddy&apos;s labeled demo data.
          </span>
        </button>
        <button
          onClick={() => setConfirmClear(true)}
          className="w-full rounded-2xl border border-status-bad/25 bg-status-bad/8 p-4 text-left"
        >
          <span className="block text-[13px] font-bold text-status-bad">Start with a blank team</span>
          <span className="mt-0.5 block text-[11.5px] text-white/45">
            Removes every player from your roster so you can build it from scratch.
          </span>
        </button>
      </section>

      <p className="mt-6 px-1 text-[11px] leading-relaxed text-white/35">
        RosterBuddy stores everything only on this device using your browser&apos;s local
        storage. Nothing is uploaded anywhere, and RosterBuddy is never synced live with ESPN.
      </p>

      {confirmReset && (
        <ConfirmDialog
          title="Reset sample data?"
          body="This replaces your current roster and waiver board with sample players and targets, clearly labeled as demo data."
          confirmLabel="Reset data"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetSampleRoster();
            setConfirmReset(false);
          }}
        />
      )}
      {confirmClear && (
        <ConfirmDialog
          title="Start with a blank team?"
          body="This removes every player currently on your roster. This can't be undone."
          confirmLabel="Clear roster"
          danger
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            clearRoster();
            setConfirmClear(false);
          }}
        />
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold text-white/55">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={onCancel}>
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-navy-800 p-5"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-[15px] font-bold text-white">{title}</h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{body}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full px-4 py-2 text-[13px] font-semibold text-white/60">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-[13px] font-bold ${
              danger ? "bg-status-bad text-white" : "bg-lime text-navy-950"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
