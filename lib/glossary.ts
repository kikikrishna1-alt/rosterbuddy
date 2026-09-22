export interface GlossaryTerm {
  term: string;
  short: string;
  detail: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "PPR",
    short: "Points Per Reception",
    detail: "You earn 1 extra point every time your player catches a pass, on top of yardage and touchdown points. This makes pass-catching RBs and WRs more valuable.",
  },
  {
    term: "Half PPR",
    short: "Half Point Per Reception",
    detail: "Same idea as PPR, but each catch is only worth 0.5 points instead of 1. A middle ground between PPR and Standard.",
  },
  {
    term: "Standard",
    short: "No points for receptions",
    detail: "Scoring is based only on yardage and touchdowns — catching a pass by itself is not worth extra points.",
  },
  {
    term: "OPRK",
    short: "Opponent Rank",
    detail: "A quick way to see how tough a matchup is. It ranks how well (or poorly) a defense has played against a position, 1 being toughest and 32 being easiest, or vice versa depending on the platform.",
  },
  {
    term: "PROJ",
    short: "Projected points",
    detail: "An estimate of how many fantasy points a player will score this week. It's an educated guess, not a promise.",
  },
  {
    term: "FLEX",
    short: "A flexible starting spot",
    detail: "A starting slot that can usually be filled by an RB, WR, or TE — whichever you think will score the most.",
  },
  {
    term: "IR",
    short: "Injured Reserve",
    detail: "A special roster spot for players with longer-term injuries. Many leagues let you stash an injured player here without using a regular bench spot.",
  },
  {
    term: "Q",
    short: "Questionable",
    detail: "The player has some chance of not playing, often due to a minor injury. Worth checking again closer to kickoff.",
  },
  {
    term: "D",
    short: "Doubtful",
    detail: "The player is unlikely to play. It's a good idea to have a backup plan ready.",
  },
  {
    term: "O",
    short: "Out",
    detail: "The player is confirmed not to play this week. They should not be in your starting lineup.",
  },
  {
    term: "BYE",
    short: "Bye week",
    detail: "Every NFL team has one week off during the season. Any player on a bye scores 0 that week, so you need a substitute.",
  },
  {
    term: "Waiver priority",
    short: "Your order for claiming players",
    detail: "In priority-based leagues, managers take turns claiming available players in order. Using a claim usually sends you to the back of the line.",
  },
  {
    term: "Targets",
    short: "Times a receiver was thrown to",
    detail: "A target is any pass thrown in a player's direction, whether or not it's caught. More targets usually means more fantasy opportunity.",
  },
  {
    term: "Touches",
    short: "Rushes + receptions",
    detail: "The number of times a player carried or caught the ball. More touches generally means a bigger role in the offense.",
  },
  {
    term: "Snap share",
    short: "% of plays a player was on the field",
    detail: "The percentage of their team's offensive plays a player participated in. A rising snap share often signals a growing role.",
  },
  {
    term: "Floor",
    short: "A player's likely low outcome",
    detail: "The realistic worst-case number of points a player might score in a normal week — useful for judging how safe a start is.",
  },
  {
    term: "Ceiling",
    short: "A player's likely high outcome",
    detail: "The realistic best-case number of points a player might score if everything goes right — useful for judging upside.",
  },
  {
    term: "Matchup",
    short: "How tough the opponent is",
    detail: "How well the opposing defense has played against a position recently. A great matchup means the opponent has struggled to stop that position.",
  },
  {
    term: "Boom",
    short: "A much-better-than-expected week",
    detail: "When a player scores far more than their projection — often from a big play or touchdown.",
  },
  {
    term: "Bust",
    short: "A much-worse-than-expected week",
    detail: "When a player scores far less than their projection.",
  },
  {
    term: "Handcuff",
    short: "The backup to your star player",
    detail: "The backup running back (usually) behind a star player. If the starter gets hurt, the handcuff often becomes valuable overnight.",
  },
];
