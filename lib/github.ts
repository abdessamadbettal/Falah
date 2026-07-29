/** The repo's public face — contributors and a couple of headline numbers.
 *
 * Read at build time (the site is a static export), so the names are baked
 * into the HTML: no API call from the visitor's browser, no rate limit to
 * hit, nothing to wait for. A failed request is never a failed build — the
 * section simply falls back to its invitation with no names on it. */

import { GITHUB_URL } from "./site";

export type Contributor = {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
};

export type Community = {
  contributors: Contributor[];
  stars: number | null;
  forks: number | null;
};

export const EMPTY_COMMUNITY: Community = { contributors: [], stars: null, forks: null };

/** "abdessamadbettal/falah" — derived so a fork only edits `site.ts`. */
export const REPO_SLUG = GITHUB_URL.replace(/^https?:\/\/github\.com\//, "");

const API = "https://api.github.com";

/** Bots author real commits but aren't people — the wall is for people. */
const isPerson = (c: { type?: string; login?: string }) =>
  c.type === "User" && !c.login?.endsWith("[bot]");

async function get<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      cache: "force-cache",
      headers: {
        accept: "application/vnd.github+json",
        "user-agent": "falah-site-build",
        // Optional: lifts the 60/hour anonymous limit on busy CI runners.
        ...(process.env.GITHUB_TOKEN
          ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchCommunity(): Promise<Community> {
  const [people, repo] = await Promise.all([
    get<{ login: string; type: string; avatar_url: string; html_url: string; contributions: number }[]>(
      `${API}/repos/${REPO_SLUG}/contributors?per_page=100`,
    ),
    get<{ stargazers_count: number; forks_count: number }>(`${API}/repos/${REPO_SLUG}`),
  ]);

  return {
    contributors: (Array.isArray(people) ? people : [])
      .filter(isPerson)
      .sort((a, b) => b.contributions - a.contributions)
      .map((c) => ({
        login: c.login,
        // `avatar_url` already carries a query string, so `&s=` sizes it down.
        avatarUrl: `${c.avatar_url}&s=160`,
        profileUrl: c.html_url,
        contributions: c.contributions,
      })),
    stars: repo?.stargazers_count ?? null,
    forks: repo?.forks_count ?? null,
  };
}
