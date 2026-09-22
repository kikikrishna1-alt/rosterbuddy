export interface Lesson {
  id: string;
  title: string;
  time: string;
  body: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "l-101",
    title: "Fantasy Football 101",
    time: "60 sec",
    body: "You draft real NFL players onto your fantasy team. Each week, the players you 'start' earn you points based on how they perform in their real games. Whoever scores more points than their opponent wins the week.",
  },
  {
    id: "l-scoring",
    title: "How fantasy scoring works",
    time: "45 sec",
    body: "Players earn points for yards, touchdowns, and (in PPR leagues) catches. Your team's score is just the total of your starters' points — bench players never count, no matter how well they play.",
  },
  {
    id: "l-starter-bench",
    title: "Starter vs. Bench",
    time: "35 sec",
    body: "Starters are the players in your active lineup slots — only they score points for you. Bench players stay on your roster as backups you can swap in later.",
  },
  {
    id: "l-flex",
    title: "What is FLEX?",
    time: "35 sec",
    body: "FLEX is a starting slot that isn't locked to one position. Most leagues let you fill it with an RB, WR, or TE — use it for whichever of those players you expect to score the most.",
  },
  {
    id: "l-projections",
    title: "What are projections?",
    time: "45 sec",
    body: "A projection is an estimate of how many points a player will score, based on their role, matchup, and recent play. It's a helpful guide, not a guarantee — real games are unpredictable.",
  },
  {
    id: "l-matchups",
    title: "What are matchups?",
    time: "40 sec",
    body: "A matchup describes how tough the opposing defense is against a position. A great matchup means that defense has struggled to stop players like yours — a tough one means the opposite.",
  },
  {
    id: "l-waivers",
    title: "Waivers",
    time: "50 sec",
    body: "Waivers are how you add players who aren't on anyone's roster. Instead of first-come-first-served, there's a short claim period where managers can submit requests, and priority or a budget decides who gets the player.",
  },
  {
    id: "l-free-agents",
    title: "Free agents",
    time: "35 sec",
    body: "Once the waiver period passes and a player is unclaimed, they usually become a free agent — meaning anyone can add them immediately, no waiting required.",
  },
  {
    id: "l-injuries",
    title: "Injuries",
    time: "45 sec",
    body: "Players get injury tags like Questionable, Doubtful, or Out. These tell you the odds they'll play. Always double check status close to kickoff, since things can change fast.",
  },
  {
    id: "l-ir",
    title: "IR (Injured Reserve)",
    time: "35 sec",
    body: "IR is a special roster spot for players with longer injuries. In leagues that offer it, stashing an injured player on IR frees up a regular bench spot for someone else.",
  },
  {
    id: "l-bye",
    title: "Bye weeks",
    time: "35 sec",
    body: "Every NFL team gets one week off per season. Any of your players on a bye won't play — and won't score — so you'll need someone else ready to start in their place.",
  },
  {
    id: "l-trades",
    title: "Trades",
    time: "40 sec",
    body: "You can trade players directly with another manager. Good trades usually solve a weakness on your team (like RB depth) in exchange for a position where you have extra depth.",
  },
  {
    id: "l-depth",
    title: "Roster depth",
    time: "40 sec",
    body: "Depth means having quality backup options at each position, not just strong starters. Good depth protects you when a starter gets hurt, has a bye, or hits a tough matchup.",
  },
  {
    id: "l-playoffs",
    title: "Fantasy playoffs",
    time: "40 sec",
    body: "Most leagues end the regular season a couple weeks before the NFL playoffs, then run their own fantasy playoff bracket among the top teams to decide a champion.",
  },
];
