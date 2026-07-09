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
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error("article is missing its --- frontmatter block");
  const meta = Object.fromEntries(
    fm[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );

  const sections: ArticleSection[] = [];
  const introParas: string[] = [];
  let current: ArticleSection | null = null;

  for (const block of md.slice(fm[0].length).split(/\n{2,}/)) {
    const text = block.trim();
    if (!text) continue;
    if (text.startsWith("## ")) {
      current = { h: text.slice(3).trim() };
      sections.push(current);
    } else if (text.startsWith("- ")) {
      const items = text.split("\n").map((l) => l.replace(/^- /, "").trim());
      if (current) current.list = [...(current.list ?? []), ...items];
    } else if (current) {
      current.p = [...(current.p ?? []), text.replace(/\n/g, " ")];
    } else {
      introParas.push(text.replace(/\n/g, " "));
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
