import { HealthStatus } from "@/lib/types";
import { statusTone } from "@/lib/logic";

const TONE_CLASSES: Record<string, string> = {
  good: "bg-status-good/15 text-status-good",
  watch: "bg-status-watch/15 text-status-watch",
  bad: "bg-status-bad/15 text-status-bad",
  neutral: "bg-status-neutral/15 text-status-neutral",
};

const SHORT: Record<HealthStatus, string> = {
  Healthy: "Healthy",
  Questionable: "Q",
  Doubtful: "D",
  Out: "Out",
  IR: "IR",
  Bye: "Bye",
};

export default function StatusBadge({
  status,
  full = false,
}: {
  status: HealthStatus;
  full?: boolean;
}) {
  const tone = statusTone(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${TONE_CLASSES[tone]}`}
    >
      {full ? status : SHORT[status]}
    </span>
  );
}

export function StatusDot({ status }: { status: HealthStatus }) {
  const tone = statusTone(status);
  const dotClass: Record<string, string> = {
    good: "bg-status-good",
    watch: "bg-status-watch",
    bad: "bg-status-bad",
    neutral: "bg-status-neutral",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${dotClass[tone]}`} />;
}
