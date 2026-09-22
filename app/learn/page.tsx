"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { LESSONS } from "@/lib/lessons";
import { GLOSSARY } from "@/lib/glossary";

export default function LearnPage() {
  const { completedLessons, toggleLessonComplete } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<"lessons" | "glossary">("lessons");
  const [query, setQuery] = useState("");

  const progress = Math.round((completedLessons.length / LESSONS.length) * 100);

  const filteredGlossary = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.short.toLowerCase().includes(q) ||
        g.detail.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="page-shell">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wide text-lime">FANTASY SCHOOL</span>
          <h1 className="mt-0.5 text-[20px] font-extrabold text-white">Learn only what you need</h1>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-800 text-base"
          aria-label="Back home"
        >
          🏠
        </Link>
      </header>

      <div className="mt-4 flex gap-2 rounded-2xl border border-white/10 bg-navy-800 p-1">
        <TabButton active={tab === "lessons"} onClick={() => setTab("lessons")}>
          Lessons
        </TabButton>
        <TabButton active={tab === "glossary"} onClick={() => setTab("glossary")}>
          What does this mean?
        </TabButton>
      </div>

      {tab === "lessons" && (
        <>
          <div className="mt-4 rounded-2xl border border-white/10 bg-navy-800 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white/70">
                {completedLessons.length} of {LESSONS.length} lessons complete
              </span>
              <span className="text-[12px] font-extrabold text-lime">{progress}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-lime" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {LESSONS.map((lesson, i) => {
              const done = completedLessons.includes(lesson.id);
              const open = expanded === lesson.id;
              return (
                <div
                  key={lesson.id}
                  className={`rounded-2xl border p-4 ${
                    open ? "border-lime/30 bg-navy-800" : "border-white/10 bg-navy-800"
                  }`}
                >
                  <button
                    onClick={() => setExpanded(open ? null : lesson.id)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <span className="text-[10px] font-extrabold text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold text-white">{lesson.title}</p>
                      <p className="text-[11px] text-white/40">{lesson.time} read</p>
                    </div>
                    {done && <span className="text-status-good">✓</span>}
                    <span className="text-white/40">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-[13px] leading-relaxed text-white/65">{lesson.body}</p>
                      <button
                        onClick={() => toggleLessonComplete(lesson.id)}
                        className={`mt-3 rounded-full px-4 py-1.5 text-[12px] font-bold ${
                          done ? "bg-white/10 text-white/60" : "bg-lime text-navy-950"
                        }`}
                      >
                        {done ? "Marked complete ✓" : "Mark as complete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "glossary" && (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a term, like FLEX or PPR…"
            className="mt-4 w-full rounded-2xl border border-white/15 bg-navy-800 px-4 py-3 text-[13px] text-white outline-none focus:border-lime"
          />
          <div className="mt-3 space-y-2">
            {filteredGlossary.map((g) => (
              <div key={g.term} className="rounded-2xl border border-white/10 bg-navy-800 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[13.5px] font-extrabold text-lime-dim">{g.term}</p>
                  <p className="text-[11px] font-semibold text-white/45">{g.short}</p>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">{g.detail}</p>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <p className="py-8 text-center text-[12px] text-white/40">
                No terms match &ldquo;{query}&rdquo;.
              </p>
            )}
          </div>
        </>
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl py-2.5 text-[12.5px] font-bold transition-colors ${
        active ? "bg-lime text-navy-950" : "text-white/55"
      }`}
    >
      {children}
    </button>
  );
}
