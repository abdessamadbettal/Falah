# Contributing to Falah.io

Thank you for helping build Falah.io! Every contribution — code, translation, bug report, or documentation — counts as part of this Sadaqah Jariyah. This guide gets you from clone to merged PR without guesswork.

## Local setup

- **Node.js 20+** and **npm** (pnpm and yarn work too).

```bash
git clone https://github.com/abdessamadbettal/falah.git
cd falah
npm install
npm run dev        # http://localhost:3000
```

The site is a **static export** (`output: "export"` in `next.config.ts`): there is no server, no middleware, and no API routes. Every tool runs entirely in the browser.

## Project layout

```text
app/
  [locale]/         The one route tree: /en/… and /ar/… (page.tsx + client.tsx per tool)
  (redirect)/       "/" picks the visitor's language; legacy URLs forward to /en/…
components/
  ui/               Design system — one component per file (button, input, header, …)
content/
  tools/<slug>/     Long-form tool guides as markdown, one file per language
lib/
  dict/<locale>/    UI strings split by feature: common, home, about, tools/<tool>.ts
  seo.tsx           Tool registry (TOOL_PATHS) + metadata & JSON-LD builders
  tool-page.tsx     Shared page helpers every route wraps
  articles.ts       Markdown guide loader (build-time)
  site.ts           SITE_URL / GITHUB_URL — the single source of identity
```

**How i18n routing works:** every locale lives under its prefix (`/en/zakat`, `/ar/zakat`) from the single `app/[locale]` tree. The bare root `/` is a tiny page that redirects to the visitor's saved or browser language (English for crawlers and no-JS visitors). Adding a locale never adds a route file.

## Before opening a PR

Run the same checks CI runs:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Keep each PR focused on one tool or one concern, and use conventional commit messages (`feat:`, `fix:`, `docs:`, …).

## Translating & editing copy

- **UI strings** live in `lib/dict/<locale>/`, split by feature — `common.ts`, `home.ts`, `about.ts`, and one file per tool under `tools/`. Every Arabic module is typed against its English counterpart, so a missing or extra key is a **compile error**, not a runtime surprise.
- **Long-form guides** (the Zakat and inheritance articles) are plain **markdown** in `content/tools/<slug>/<locale>.md` — frontmatter for the eyebrow/heading, `##` for sections, `-` for bullets. Edit prose without touching any TypeScript.

Any string you change must be updated in **every** language.

## Adding a new tool

1. **Strings** — create `lib/dict/en/tools/<key>.ts` and `lib/dict/ar/tools/<key>.ts` (copy a sibling), and register them in each locale's `tools/index.ts`.
2. **Register it** — add a path to `TOOL_PATHS` and an entry (with icon) to `TOOL_CATEGORIES` in `lib/seo.tsx`. The `ToolKey` type makes a step-1 ↔ step-2 mismatch a compile error.
3. **Build it** — create `app/[locale]/<slug>/client.tsx` (the interactive component, wrapped in `<ToolShell>`) and `page.tsx` (copy any sibling's `page.tsx` and change the key).
4. Done — the sitemap, footer directory, home grid, and JSON-LD all read from the registry automatically, in every language.

## Adding a new language

1. Copy `lib/dict/ar/` to `lib/dict/<code>/` and translate each module (the `typeof` imports keep you honest).
2. Add the code to `locales` in `lib/i18n.ts`; extend `dirFor()` if the language is RTL.
3. Translate the markdown guides in `content/tools/*/<code>.md`.
4. Everything else — routes, sitemap, hreflang, language switcher — derives from `locales`.

## Ground rules

- **Privacy is non-negotiable.** No analytics, no tracking, no data leaving the browser. PRs that add any of these will be declined.
- **Islamic content must be sourced.** Cite the reference (e.g. hadith collection and number) for any dua, ruling, or calculation method you add or change.
- **Both directions, both themes.** Test your UI in Arabic (RTL) and in dark mode before submitting.

## Questions?

Open a [GitHub issue](https://github.com/abdessamadbettal/falah/issues) — bug reports, feature ideas, and translation offers are all welcome.
