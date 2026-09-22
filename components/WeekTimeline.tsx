"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { days: [1], key: "mon", short: "MON", title: "Review", text: "See what worked, what flopped, and where your roster looks thin." },
  { days: [2, 3], key: "tuewed", short: "TUE–WED", title: "Waivers", text: "Scan for useful available players and submit any claims." },
  { days: [4], key: "thu", short: "THU", title: "Thursday check", text: "Confirm your Thursday-game players are locked in before that game starts." },
  { days: [5, 6], key: "frisat", short: "FRI–SAT", title: "Injuries", text: "Watch questionable players closely as final injury reports come in." },
  { days: [0], key: "sun-am", short: "SUN AM", title: "Final lineup check", text: "Do one last review — injuries, byes, and empty slots — before games lock." },
  { days: [0], key: "sun", short: "SUN", title: "Follow your matchup", text: "Enjoy the games and track your live score against your opponent." },
];

export default function WeekTimeline() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(new Date().getDay());
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800 p-4">
      <div className="mb-3">
        <span className="text-[10px] font-extrabold tracking-wide text-lime">THE WEEKLY RHYTHM</span>
        <h3 className="mt-0.5 text-[15px] font-bold text-white">What happens this week</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map((step) => {
          const isToday = today !== null && step.days.includes(today);
          return (
            <div
              key={step.key}
              className={`w-[150px] shrink-0 rounded-xl border p-3 ${
                isToday
                  ? "border-lime/40 bg-lime/10"
                  : "border-white/10 bg-navy-900/60"
              }`}
            >
              <span
                className={`text-[10px] font-extrabold tracking-wide ${
                  isToday ? "text-lime" : "text-white/40"
                }`}
              >
                {step.short} {isToday ? "· TODAY" : ""}
              </span>
              <p className="mt-1 text-[13px] font-bold text-white">{step.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/55">{step.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
