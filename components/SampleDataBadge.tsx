export default function SampleDataBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white/50 ${className}`}
    >
      Sample data
    </span>
  );
}
