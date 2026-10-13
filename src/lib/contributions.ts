import "server-only";
import { profile } from "@/content/content";

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: Day[]; mock: boolean };

/** Deterministic PRNG so the fallback graph is identical on every build. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mockContributions(): Contributions {
  const rand = mulberry32(2026);
  const end = new Date(Date.UTC(2026, 9, 11));
  const days: Day[] = [];
  let total = 0;
  for (let i = 364; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    const r = rand();
    const count = r < 0.62 ? 0 : r < 0.8 ? 1 : r < 0.9 ? 3 : r < 0.97 ? 6 : 10;
    const level = (count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 8 ? 3 : 4) as Day["level"];
    total += count;
    days.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return { total, days, mock: true };
}

/**
 * Public contribution calendar for the last year, fetched at build time
 * (revalidated daily) from a credential-free mirror of GitHub's graph.
 * Falls back to seeded sample data, which the UI labels as such.
 */
export async function getContributions(): Promise<Contributions> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { total?: { lastYear?: number }; contributions?: Day[] };
    if (!json.contributions?.length) throw new Error("empty");
    return { total: json.total?.lastYear ?? json.contributions.reduce((s, d) => s + d.count, 0), days: json.contributions, mock: false };
  } catch {
    return mockContributions();
  }
}
