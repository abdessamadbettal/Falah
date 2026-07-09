# Contributing to Falah.io

Thank you for helping build Falah.io! Every contribution — code, translation, bug report, or documentation — counts as part of this Sadaqah Jariyah. This guide gets you from clone to merged PR without guesswork.

## Local setup

- **Node.js 20+** and **npm** (pnpm and yarn work too).

```bash
git clone https://github.com/abdessamadbettal/falah.git
cd falah.io
npm install
npm run dev        # http://localhost:3000
```

The site is a **static export** (`output: "export"` in `next.config.ts`): there is no server, no middleware, and no API routes. Every tool runs entirely in the browser.

## Project layout

```text
app/
  (en)/           English pages, served unprefixed at the site root ("/zakat")
  [locale]/       Prefixed locales ("/ar/zakat") + the client components
  (redirect)/     Meta-refresh redirects for legacy pre-i18n URLs
components/
  ui/             Design system: styles.ts, ornaments, primitives, chrome
lib/
  dict/           One dictionary per language (en.ts, ar.ts) — all copy lives here
  seo.tsx         Tool registry (TOOL_PATHS), metadata + JSON-LD builders
  tool-page.tsx   Shared page helpers both route trees wrap
  site.ts         SITE_URL / GITHUB_URL — the single source of identity
```

**Why two route trees?** English must live unprefixed at the root (it doubles as the `hreflang` `x-default`), and a static export has no middleware to rewrite URLs. Both trees are thin wrappers over the same helpers in `lib/tool-page.tsx` — page files contain no logic of their own.

## Before opening a PR

Run the same checks CI runs:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Keep each PR focused on one tool or one concern, and use conventional commit messages (`feat:`, `fix:`, `docs:`, …).

## Adding or changing copy

All user-facing text lives in `lib/dict/`. Any string you add or change must be updated in **every** dictionary (`en.ts` and `ar.ts`). `ar` is typed as `typeof en`, so a missing key is a compile error — `npx tsc --noEmit` will catch it.

## Adding a new tool

1. **Strings** — add the tool's section to `tools` and its card to `home.toolCards` in *every* `lib/dict/*.ts`.
2. **Register it** — add a path to `TOOL_PATHS` and an entry (with icon) to `TOOL_CATEGORIES` in `lib/seo.tsx`. The `ToolKey` type makes step 1 ↔ step 2 mismatches a compile error.
3. **Build the tool** — create `app/[locale]/<slug>/client.tsx` (the interactive component, wrapped in `<ToolShell>`) and `page.tsx` (copy any existing tool's `page.tsx` and change the key).
4. **English wrapper** — create `app/(en)/<slug>/page.tsx` the same way (see any sibling).
5. Done — the sitemap, footer directory, home grid, and JSON-LD all read from the registry automatically.

## Adding a new language

1. Create `lib/dict/<code>.ts` exporting a dict typed `typeof en` (copy `ar.ts` as a template).
2. Add the code to `locales` in `lib/i18n.ts`.
3. If the language is RTL, extend `dirFor()`.
4. Everything else — routes, sitemap, hreflang, language switcher — derives from `locales`.

## Ground rules

- **Privacy is non-negotiable.** No analytics, no tracking, no data leaving the browser. PRs that add any of these will be declined.
- **Islamic content must be sourced.** Cite the reference (e.g. hadith collection and number) for any dua, ruling, or calculation method you add or change.
- **Both directions, both themes.** Test your UI in Arabic (RTL) and in dark mode before submitting.

## Questions?

Open a [GitHub issue](https://github.com/abdessamadbettal/falah/issues) — bug reports, feature ideas, and translation offers are all welcome.
