const TONE_STYLES: Record<string, { ring: string; text: string }> = {
  good: { ring: "#3ddc84", text: "text-status-good" },
  watch: { ring: "#ffc94d", text: "text-status-watch" },
  bad: { ring: "#ff6b6b", text: "text-status-bad" },
};

export default function ReadinessRing({
  score,
  tone,
}: {
  score: number;
  tone: "good" | "watch" | "bad";
}) {
  const style = TONE_STYLES[tone];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#101a2c" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={style.ring}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-[28px] font-extrabold leading-none ${style.text}`}>{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-wide text-navy-900/60">/ 100</span>
      </div>
    </div>
  );
}
