export type Position = "QB" | "RB" | "WR" | "TE" | "D/ST" | "K";

export type HealthStatus =
  | "Healthy"
  | "Questionable"
  | "Doubtful"
  | "Out"
  | "IR"
  | "Bye";

export type MatchupRating = "Great" | "Good" | "Average" | "Tough";

export type Consistency = "Steady" | "Boom/Bust" | "Unknown";

export type StarterSlotId =
  | "QB"
  | "RB1"
  | "RB2"
  | "WR1"
  | "WR2"
  | "TE"
  | "FLEX"
  | "DST"
  | "K";

export type RosterSlot = StarterSlotId | "BENCH";

export interface Player {
  id: string;
  name: string;
  nflTeam: string;
  position: Position;
  opponent: string;
  projectedPoints: number;
  status: HealthStatus;
  matchup: MatchupRating;
  opportunity: string;
  consistency: Consistency;
  slot: RosterSlot;
  notes: string;
  isSample: boolean;
}

export type WaiverPriority = "High" | "Medium" | "Low";
export type Trend = "Rising" | "Steady" | "Falling";

export interface WaiverTarget {
  id: string;
  name: string;
  nflTeam: string;
  position: Position;
  projectedPoints: number;
  trend: Trend;
  notes: string;
  priority: WaiverPriority;
  potentialDrop: string;
  isSample: boolean;
}

export type Platform = "ESPN" | "Yahoo" | "Sleeper" | "Other";
export type ScoringFormat = "PPR" | "Half PPR" | "Standard";
export type WaiverType =
  | "Rolling Priority"
  | "FAAB"
  | "Reverse Standings"
  | "Not sure yet";

export interface LeagueSettings {
  managerName: string;
  teamName: string;
  platform: Platform;
  scoring: ScoringFormat;
  currentWeek: number;
  currentOpponent: string;
  waiverType: WaiverType;
  beginnerMode: boolean;
  onboardingComplete: boolean;
  openaiApiKey: string;
}

export interface AppState {
  league: LeagueSettings;
  players: Player[];
  waivers: WaiverTarget[];
  completedLessons: string[];
}

/** One row extracted from a screenshot by the AI-assisted import feature. */
export interface ImportedPlayerRow {
  name: string;
  nflTeam: string;
  position: Position;
  status: HealthStatus;
  projectedPoints: number;
  opponent: string;
  slotHint: string | null;
}

export type RecCategory = "doNow" | "watch" | "opportunity";
export type Urgency = "Now" | "Soon" | "FYI";

export interface Recommendation {
  id: string;
  category: RecCategory;
  player?: Player;
  title: string;
  problem: string;
  action: string;
  urgency: Urgency;
  why: string;
  teachMe: string;
  swap?: { outId: string; inId: string; slot: RosterSlot };
}
