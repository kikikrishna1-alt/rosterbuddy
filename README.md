# RosterBuddy

RosterBuddy is a mobile-first fantasy football companion built for complete
beginners. It does **not** try to replace ESPN, Yahoo, or Sleeper — it doesn't
sync with them at all. Instead, it answers one question every week:

> **"What do I need to do with my fantasy team right now?"**

Where your league app tells you *what's happening*, RosterBuddy tells you
*what to pay attention to* — and explains *why*, in plain language, for
someone who has never played fantasy football before.

## V1 capabilities

- **Guided onboarding** — manager name, team name, platform, scoring format,
  current week/opponent, waiver type, and a Beginner Mode toggle, with brief
  explanations of unfamiliar terms along the way.
- **Home / Game Plan** — a Team Readiness score (0–100) computed from your
  roster, plus recommendations sorted into 🚨 **Do Now**, 👀 **Watch**,
  ✨ **Opportunities**, and a friendly ✅ **All Good** state. Every
  recommendation includes the problem, the recommended action, a "Why?"
  explanation, and a "Teach me" beginner explanation — some support a
  one-tap lineup swap.
- **My Team** — a full roster editor with 9 starter slots (QB, RB, RB, WR,
  WR, TE, FLEX, D/ST, K) and a bench. Add, edit, delete, and move players
  between bench and starting slots, with position eligibility enforced
  (e.g. a kicker can't fill a WR slot). Includes a one-tap reset to sample
  data.
- **Start/Sit** — pick two players and get a RosterBuddy Pick with plain-
  language reasoning (Safer Play, Higher Upside, Injury Risk, Matchup) plus
  a "Teach me why" glossary of targets, touches, snap share, floor, ceiling,
  projections, and matchups.
- **Waivers** — a manual waiver-target board with priority ranking, trend,
  notes, and a "Top Waiver Targets" section. Add a target straight onto your
  bench, or dismiss it. Includes plain-language explanations of waivers,
  waiver priority, free agents, and claims vs. free-agent adds.
- **Learn (Fantasy School)** — fourteen 30–60 second lessons with completion
  tracking, plus a searchable "What does this mean?" glossary (PPR, FLEX,
  OPRK, snap share, handcuff, and more).
- **Beginner Mode** — a global toggle that translates jargon (slot names,
  status labels) into plain language throughout the app, with the option to
  reveal the original term.
- **This Week timeline** — a small weekly-rhythm strip (Monday review →
  Tuesday/Wednesday waivers → Thursday check → Friday/Saturday injury watch
  → Sunday final lineup check) that highlights today.
- **LocalStorage persistence** — your whole setup (league settings, roster,
  waiver board, completed lessons) is saved to your browser's local storage.
  No account, no backend, no database.
- Ships with clearly labeled **SAMPLE DATA** so the app feels alive on first
  launch, with a one-tap reset back to that sample data at any time.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Browser `localStorage` for all persistence — no database, no auth
- Deploys as a static-friendly Next.js app, ready for Vercel

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

Import this GitHub repository directly into Vercel — no environment
variables or extra configuration are required for V1. Vercel will detect
the Next.js App Router project automatically.

## Current limitations

- RosterBuddy V1 has **no live data**. It does not sync with ESPN, Yahoo,
  or Sleeper, and does not fetch live scores, injuries, projections, or NFL
  news. Every player's stats, status, matchup, and projection are entered
  manually by you (or come from the clearly labeled sample data).
- There is no authentication and no multi-device sync — everything lives in
  your browser's local storage on the device you're using.
- The Start/Sit and readiness-score logic are simple, transparent heuristics
  meant to teach fantasy fundamentals — they are not predictive models and
  are never presented as guarantees.

## V2 roadmap

- Optional live NFL/player data (scores, injuries, projections) from a
  supported data source.
- Optional ESPN league import, if a reliable, authorized integration
  becomes available.
- Reminders for waiver deadlines, Thursday locks, and Sunday lineup checks.
- A personalized AI coach that knows your roster, league settings, and
  weekly context.
- A trade analyzer.
- Automated weekly recaps.
- Opponent scouting reports.
