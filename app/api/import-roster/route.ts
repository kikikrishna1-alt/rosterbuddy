import { NextRequest, NextResponse } from "next/server";
import { HealthStatus, ImportedPlayerRow, Position } from "@/lib/types";

export const runtime = "nodejs";

// Roughly 6MB of base64 text (~4.5MB decoded), safely under typical
// serverless request body limits.
const MAX_IMAGE_DATA_URL_LENGTH = 6_000_000;

const VALID_POSITIONS: Position[] = ["QB", "RB", "WR", "TE", "D/ST", "K"];
const VALID_STATUSES: HealthStatus[] = [
  "Healthy",
  "Questionable",
  "Doubtful",
  "Out",
  "IR",
  "Bye",
];

const SYSTEM_PROMPT = `You extract fantasy football roster data from a screenshot of a fantasy football app (usually ESPN Fantasy Football) on a phone.

Look at every player row visible in the image and, for each one, return:
- name: the player's full name, exactly as shown. Never invent a player that isn't visible.
- nflTeam: their NFL team abbreviation (2-4 letters) if visible, else "".
- position: your best guess at one of exactly: "QB", "RB", "WR", "TE", "D/ST", "K". If it's a defense/special teams row, use "D/ST".
- status: one of exactly "Healthy", "Questionable", "Doubtful", "Out", "IR", "Bye". Infer this from any injury badge/letter (Q, D, O, IR) or bye-week indicator next to the player. If there is no such indicator, use "Healthy".
- projectedPoints: the projected points number shown for this player this week, as a plain number. If none is visible, use 0.
- opponent: the opponent shown (e.g. "vs SEA", "@ DAL" -> just the team abbreviation like "SEA" or "DAL"), or "" if not visible.
- slotHint: the roster slot label shown next to the row if any (e.g. "QB", "RB", "WR", "TE", "FLEX", "D/ST", "K", "Bench", "IR"), else null.

Skip anything that is clearly not a player row (navigation, ads, headers, buttons).

Respond with ONLY a JSON object of the exact shape {"players": [...]}, no other text, no markdown code fences.`;

function coercePosition(value: unknown): Position {
  return VALID_POSITIONS.includes(value as Position) ? (value as Position) : "WR";
}

function coerceStatus(value: unknown): HealthStatus {
  return VALID_STATUSES.includes(value as HealthStatus) ? (value as HealthStatus) : "Healthy";
}

function coerceRow(raw: unknown): ImportedPlayerRow | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!name) return null;
  return {
    name,
    nflTeam: typeof row.nflTeam === "string" ? row.nflTeam.trim().toUpperCase() : "",
    position: coercePosition(row.position),
    status: coerceStatus(row.status),
    projectedPoints: typeof row.projectedPoints === "number" && Number.isFinite(row.projectedPoints)
      ? row.projectedPoints
      : Number(row.projectedPoints) || 0,
    opponent: typeof row.opponent === "string" ? row.opponent.trim().toUpperCase() : "",
    slotHint: typeof row.slotHint === "string" && row.slotHint.trim() ? row.slotHint.trim() : null,
  };
}

export async function POST(req: NextRequest) {
  let body: { image?: unknown; apiKey?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const image = typeof body.image === "string" ? body.image : "";
  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";

  if (!apiKey) {
    return NextResponse.json(
      { error: "No OpenAI API key found. Add one in Settings first." },
      { status: 400 }
    );
  }
  if (!image.startsWith("data:image/")) {
    return NextResponse.json({ error: "No valid image was provided." }, { status: 400 });
  }
  if (image.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return NextResponse.json(
      { error: "That image is too large. Try a screenshot instead of a full-resolution photo." },
      { status: 400 }
    );
  }

  let openaiRes: Response;
  try {
    openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        max_tokens: 4096,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract every fantasy football player row visible in this screenshot as JSON.",
              },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach OpenAI. Check your connection and try again." },
      { status: 502 }
    );
  }

  if (!openaiRes.ok) {
    if (openaiRes.status === 401) {
      return NextResponse.json(
        { error: "OpenAI rejected that API key. Double-check it in Settings." },
        { status: 401 }
      );
    }
    if (openaiRes.status === 429) {
      return NextResponse.json(
        { error: "OpenAI rate-limited this key, or it's out of credit." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: `OpenAI returned an error (status ${openaiRes.status}).` },
      { status: 502 }
    );
  }

  let payload: any;
  try {
    payload = await openaiRes.json();
  } catch {
    return NextResponse.json({ error: "OpenAI returned an unreadable response." }, { status: 502 });
  }

  const content: string = payload?.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Couldn't understand the screenshot. Try a clearer or less cropped image." },
      { status: 422 }
    );
  }

  const rawPlayers = Array.isArray((parsed as any)?.players) ? (parsed as any).players : [];
  const players = rawPlayers.map(coerceRow).filter((p: ImportedPlayerRow | null): p is ImportedPlayerRow => p !== null);

  if (players.length === 0) {
    return NextResponse.json(
      { error: "No players were recognized in that screenshot. Try a clearer roster view." },
      { status: 422 }
    );
  }

  return NextResponse.json({ players });
}
