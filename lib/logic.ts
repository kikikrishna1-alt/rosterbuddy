import { Player, HealthStatus, MatchupRating, Recommendation, WaiverTarget } from "./types";
import { STARTER_SLOT_ORDER, SLOT_LABELS, canFillSlot, StarterSlotId } from "./slots";

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function healthWeight(status: HealthStatus): number {
  switch (status) {
    case "Healthy":
      return 4;
    case "Questionable":
      return 0;
    case "Doubtful":
      return -10;
    case "Out":
      return -25;
    case "IR":
      return -25;
    case "Bye":
      return -25;
    default:
      return 0;
  }
}

export function matchupWeight(matchup: MatchupRating): number {
  switch (matchup) {
    case "Great":
      return 3;
    case "Good":
      return 1.5;
    case "Average":
      return 0;
    case "Tough":
      return -2.5;
    default:
      return 0;
  }
}

export function isUnavailable(status: HealthStatus): boolean {
  return status === "Out" || status === "IR" || status === "Bye";
}

/** A single number used to rank two players against each other. Higher = better start. */
export function decisionScore(player: Player): number {
  return player.projectedPoints + healthWeight(player.status) + matchupWeight(player.matchup);
}

export function statusTone(status: HealthStatus): "good" | "watch" | "bad" | "neutral" {
  if (status === "Healthy") return "good";
  if (status === "Questionable") return "watch";
  if (status === "Doubtful" || status === "Out" || status === "IR") return "bad";
  return "neutral"; // Bye
}

export interface ReadinessResult {
  score: number;
  label: string;
  tone: "good" | "watch" | "bad";
}

export function computeReadiness(players: Player[]): ReadinessResult {
  let score = 100;

  STARTER_SLOT_ORDER.forEach((slotId) => {
    const starter = players.find((p) => p.slot === slotId);
    if (!starter) {
      score -= 14;
      return;
    }
    if (starter.status === "Out" || starter.status === "IR") score -= 22;
    else if (starter.status === "Bye") score -= 20;
    else if (starter.status === "Doubtful") score -= 13;
    else if (starter.status === "Questionable") score -= 5;
  });

  score = Math.max(5, Math.min(100, Math.round(score)));

  let label = "Almost ready for Sunday";
  let tone: "good" | "watch" | "bad" = "good";
  if (score >= 90) {
    label = "You're locked in for Sunday";
    tone = "good";
  } else if (score >= 70) {
    label = "Almost ready for Sunday";
    tone = "good";
  } else if (score >= 45) {
    label = "A few things need your attention";
    tone = "watch";
  } else {
    label = "Your lineup needs work now";
    tone = "bad";
  }

  return { score, label, tone };
}

function bestReplacement(players: Player[], slot: StarterSlotId, excludeId: string): Player | undefined {
  return players
    .filter(
      (p) =>
        p.slot === "BENCH" &&
        p.id !== excludeId &&
        canFillSlot(p.position, slot) &&
        !isUnavailable(p.status) &&
        p.status !== "Doubtful"
    )
    .sort((a, b) => decisionScore(b) - decisionScore(a))[0];
}

export interface Recommendations {
  doNow: Recommendation[];
  watch: Recommendation[];
  opportunity: Recommendation[];
}

export function buildRecommendations(players: Player[], waivers: WaiverTarget[]): Recommendations {
  const doNow: Recommendation[] = [];
  const watch: Recommendation[] = [];
  const opportunity: Recommendation[] = [];

  STARTER_SLOT_ORDER.forEach((slotId) => {
    const starter = players.find((p) => p.slot === slotId);
    const label = SLOT_LABELS[slotId];

    if (!starter) {
      doNow.push({
        id: uid("rec"),
        category: "doNow",
        title: `Your ${label} spot is empty`,
        problem: `You don't have anyone starting at ${label} this week.`,
        action: "Move a bench player into this slot, or grab someone from waivers.",
        urgency: "Now",
        why: "Empty starting slots score zero points automatically, so this is the easiest lost points to fix.",
        teachMe:
          "Every league requires you to fill each starting slot before games lock. An empty slot always scores 0, no matter how good the rest of your team is.",
      });
      return;
    }

    if (isUnavailable(starter.status) || starter.status === "Doubtful") {
      const replacement = bestReplacement(players, slotId, starter.id);
      const statusWord = starter.status === "Bye" ? "on a bye week" : starter.status.toLowerCase();
      doNow.push({
        id: uid("rec"),
        category: "doNow",
        player: starter,
        title: `${starter.name} is ${statusWord}`,
        problem: `${starter.name} is starting at ${label} but is ${statusWord}.`,
        action: replacement
          ? `Swap in ${replacement.name} from your bench before kickoff.`
          : `You don't have a healthy bench player who fits ${label}. Check waivers for a replacement.`,
        urgency: "Now",
        why: replacement
          ? `${replacement.name} is healthy, eligible for ${label}, and projected for ${replacement.projectedPoints.toFixed(1)} points — a real starter who can actually score for you.`
          : `A player who is ${statusWord} is very unlikely to score meaningful points, so leaving them in this slot risks losing easy points.`,
        teachMe:
          "Players marked Out, IR, or on a Bye will not play, so they score 0. Doubtful players are unlikely to play. Starting one of these instead of an available bench player almost always costs you points.",
        swap: replacement ? { outId: starter.id, inId: replacement.id, slot: slotId } : undefined,
      });
    } else if (starter.status === "Questionable") {
      watch.push({
        id: uid("rec"),
        category: "watch",
        player: starter,
        title: `${starter.name} is questionable`,
        problem: `${starter.name} (${label}) is listed as questionable for this week's game.`,
        action: "Recheck their status Friday through Sunday morning before your lineup locks.",
        urgency: "Soon",
        why: "Questionable players sometimes play limited snaps or sit out entirely, so their outlook can change right up until kickoff.",
        teachMe:
          "Questionable (Q) means a player has some chance of missing the game, often due to a minor injury. It's not a reason to bench them yet — just a reason to check back before your lineup locks.",
      });
    } else {
      const replacement = players
        .filter(
          (p) =>
            p.slot === "BENCH" &&
            canFillSlot(p.position, slotId) &&
            !isUnavailable(p.status) &&
            p.status !== "Doubtful"
        )
        .sort((a, b) => decisionScore(b) - decisionScore(a))[0];

      if (replacement && decisionScore(replacement) - decisionScore(starter) >= 3) {
        opportunity.push({
          id: uid("rec"),
          category: "opportunity",
          player: replacement,
          title: `${replacement.name} may be a stronger start than ${starter.name}`,
          problem: `${replacement.name} is on your bench but is projected higher than your current ${label} starter.`,
          action: `Consider starting ${replacement.name} over ${starter.name} at ${label}.`,
          urgency: "FYI",
          why: `${replacement.name} projects for ${replacement.projectedPoints.toFixed(1)} points with a ${replacement.matchup.toLowerCase()} matchup, compared to ${starter.projectedPoints.toFixed(1)} for ${starter.name}.`,
          teachMe:
            "Projections and matchups change week to week. It's worth a quick check before kickoff to make sure your best players are actually in your starting lineup.",
          swap: { outId: starter.id, inId: replacement.id, slot: slotId },
        });
      }
    }
  });

  const highWaivers = waivers.filter((w) => w.priority === "High").slice(0, 2);
  highWaivers.forEach((w) => {
    opportunity.push({
      id: uid("rec"),
      category: "opportunity",
      title: `Consider adding ${w.name} off waivers`,
      problem: `You saved ${w.name} (${w.position}, ${w.nflTeam}) as a high-priority waiver target.`,
      action: w.potentialDrop
        ? `Consider adding ${w.name} and dropping ${w.potentialDrop}.`
        : `Consider submitting a waiver claim for ${w.name} in ESPN.`,
      urgency: "FYI",
      why: w.notes || "You flagged this player as a high-priority target on your waiver board.",
      teachMe:
        "Waivers let you add players who aren't on any team. Acting on your high-priority targets before the waiver deadline is how you improve your roster during the season.",
    });
  });

  const positionCounts: Record<string, number> = {};
  players.forEach((p) => {
    positionCounts[p.position] = (positionCounts[p.position] || 0) + 1;
  });
  const depthTargets: { position: string; min: number }[] = [
    { position: "RB", min: 4 },
    { position: "WR", min: 5 },
  ];
  depthTargets.forEach(({ position, min }) => {
    const count = positionCounts[position] || 0;
    if (count < min) {
      opportunity.push({
        id: uid("rec"),
        category: "opportunity",
        title: `Your ${position} depth is thin`,
        problem: `You only have ${count} ${position}${count === 1 ? "" : "s"} on your roster.`,
        action: `Keep an eye on waivers for another ${position} in case of a bye week or injury.`,
        urgency: "FYI",
        why: "Having at least one extra player at each position protects you when a starter gets hurt or has a bye week.",
        teachMe:
          "Roster depth means having backup options at each position, not just your starters. Thin depth is fine until someone gets hurt — then it becomes a problem fast.",
      });
    }
  });

  return { doNow, watch, opportunity };
}

export interface Comparison {
  recommended: Player;
  other: Player;
  saferPlay: Player;
  higherUpside: Player;
  reasoningLines: string[];
}

function ceilingEstimate(player: Player): number {
  const boost = player.consistency === "Boom/Bust" ? 1.35 : player.consistency === "Steady" ? 1.12 : 1.2;
  return player.projectedPoints * boost;
}

export function comparePlayers(a: Player, b: Player): Comparison {
  const scoreA = decisionScore(a);
  const scoreB = decisionScore(b);
  const recommended = scoreA >= scoreB ? a : b;
  const other = recommended.id === a.id ? b : a;

  const saferPlay =
    healthWeight(a.status) === healthWeight(b.status)
      ? a.projectedPoints >= b.projectedPoints
        ? a
        : b
      : healthWeight(a.status) > healthWeight(b.status)
      ? a
      : b;

  const higherUpside = ceilingEstimate(a) >= ceilingEstimate(b) ? a : b;

  const reasoningLines: string[] = [];
  reasoningLines.push(
    `${recommended.name} is projected for ${recommended.projectedPoints.toFixed(1)} points, compared to ${other.projectedPoints.toFixed(1)} for ${other.name}.`
  );
  if (recommended.status !== "Healthy" || other.status !== "Healthy") {
    reasoningLines.push(
      `Health check: ${recommended.name} is ${recommended.status}, ${other.name} is ${other.status}.`
    );
  }
  reasoningLines.push(
    `Matchup: ${recommended.name} has a ${recommended.matchup.toLowerCase()} matchup, ${other.name} has a ${other.matchup.toLowerCase()} matchup.`
  );
  if (recommended.opportunity || other.opportunity) {
    const trim = (s: string) => s.replace(/\.+$/, "");
    reasoningLines.push(
      `Recent opportunity: ${recommended.name} — ${trim(recommended.opportunity || "no notes yet")}. ${other.name} — ${trim(other.opportunity || "no notes yet")}.`
    );
  }

  return { recommended, other, saferPlay, higherUpside, reasoningLines };
}
