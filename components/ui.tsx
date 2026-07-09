/** Barrel for the design system, split by hydration cost:
 *
 *  - ui/styles.ts     — class recipes + cn()          (server-safe)
 *  - ui/ornaments.tsx — Star8, StarField, Eyebrow     (server-safe)
 *  - ui/primitives.tsx — Button, Input, Select, …     (server-safe)
 *  - ui/chrome.tsx    — Header, Footer, ToolShell, …  ("use client")
 *
 * Import from here for convenience; only what a page actually uses ends up
 * in its bundle, and only chrome.tsx ships client JS of its own.
 */
export {
  brandCls,
  btnGhost,
  btnPrimary,
  cardCls,
  cn,
  goldCls,
  inputCls,
  lineCls,
  mutedCls,
} from "./ui/styles";
export { Eyebrow, Star8, StarField } from "./ui/ornaments";
export { Button, Checkbox, Field, Input, Select } from "./ui/primitives";
export { Footer, Header, ThemeToggle, ToolShell, useMounted } from "./ui/chrome";
export { GITHUB_URL } from "@/lib/site";
