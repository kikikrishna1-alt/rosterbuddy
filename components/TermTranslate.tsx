"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

/**
 * Shows a plain-language explanation when Beginner Mode is on, with the option
 * to reveal the original fantasy jargon. When Beginner Mode is off, shows the
 * jargon directly.
 */
export default function TermTranslate({
  jargon,
  beginner,
  className = "",
}: {
  jargon: string;
  beginner: string;
  className?: string;
}) {
  const { league } = useApp();
  const [revealed, setRevealed] = useState(false);

  if (!league.beginnerMode) {
    return <span className={className}>{jargon}</span>;
  }

  return (
    <span className={className}>
      {revealed ? jargon : beginner}{" "}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        className="ml-1 text-[10px] font-bold uppercase tracking-wide text-lime-dim underline underline-offset-2"
      >
        {revealed ? "Simpler" : "Show term"}
      </button>
    </span>
  );
}
