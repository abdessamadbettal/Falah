import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ArticleSection } from "@/components/article";

/** Long-form tool guides live as plain markdown in content/tools/<slug>/
 * <locale>.md so translators and contributors can edit prose without
 * touching TypeScript. Read with node:fs at build time (server-only) and
 * parsed into the shape <Article> renders. */
export type ToolArticle = {
  eyebrow: string;
  heading: string;
  intro?: string;
  sections: ArticleSection[];
};

/** The subset of markdown the guides use: `key: value` frontmatter,
 * `## ` section headings, `- ` bullets, blank-line-separated paragraphs. */
export function parseArticle(md: string): ToolArticle {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) throw new Error("article is missing its --- frontmatter block");
  const meta = Object.fromEntries(
    fm[1].split(/\r?\n/).map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );

  const sections: ArticleSection[] = [];
  const introParas: string[] = [];
  let current: ArticleSection | null = null;

  for (const block of md.slice(fm[0].length).split(/(?:\r?\n){2,}/)) {
    const text = block.trim();
    if (!text) continue;
    if (text.startsWith("## ")) {
      current = { h: text.slice(3).trim() };
      sections.push(current);
    } else if (text.startsWith("- ")) {
      const items = text.split(/\r?\n/).map((l) => l.replace(/^- /, "").trim());
      if (current) current.list = [...(current.list ?? []), ...items];
    } else if (current) {
      current.p = [...(current.p ?? []), text.replace(/\r?\n/g, " ")];
    } else {
      introParas.push(text.replace(/\r?\n/g, " "));
    }
  }

  return {
    eyebrow: meta.eyebrow ?? "",
    heading: meta.heading ?? "",
    intro: introParas.join(" ") || undefined,
    sections,
  };
}

export function getToolArticle(slug: string, locale: string): ToolArticle {
  const file = join(process.cwd(), "content", "tools", slug, `${locale}.md`);
  return parseArticle(readFileSync(file, "utf8"));
}

/** One of the 99 names, written per locale in content/names/<slug>/<locale>.md.
 *
 * The frontmatter is optional here — the page already knows the name, its
 * number and its meaning, so the file carries only what the page cannot
 * derive: the prose. A missing file returns null rather than throwing, so a
 * name whose translation has not landed yet still renders its heading,
 * meaning and Quran references instead of failing the build. */
export type NameArticle = { summary?: string; sections: ArticleSection[] };

export function getNameArticle(slug: string, locale: string): NameArticle | null {
  const file = join(process.cwd(), "content", "names", slug, `${locale}.md`);
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const sections: ArticleSection[] = [];
  const lead: string[] = [];
  let current: ArticleSection | null = null;

  for (const block of body.split(/(?:\r?\n){2,}/)) {
    const text = block.trim();
    if (!text) continue;
    if (text.startsWith("## ")) {
      current = { h: text.slice(3).trim() };
      sections.push(current);
    } else if (text.startsWith("- ")) {
      const items = text.split(/\r?\n/).map((l) => l.replace(/^- /, "").trim());
      if (current) current.list = [...(current.list ?? []), ...items];
    } else if (current) {
      current.p = [...(current.p ?? []), text.replace(/\r?\n/g, " ")];
    } else {
      lead.push(text.replace(/\r?\n/g, " "));
    }
  }

  return { summary: lead.join(" ") || undefined, sections };
}
