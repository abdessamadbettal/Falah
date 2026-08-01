/** Client-safe helpers for displaying a hadith.
 *
 * Kept apart from lib/hadith-build.ts (which touches node:fs) so the reader
 * can import these without dragging server-only code into the bundle. */

import type { Locale } from "./i18n";

/** How a grading reads at a glance. The badge is tinted from this rather than
 * from the exact wording, because the dataset carries 1,671 distinct grade
 * strings and almost all of them are a compound of these few verdicts. */
export type GradeTone = "sahih" | "hasan" | "daif" | "neutral";

/** Order matters: "Mauquf Daif" is weak even though it names a second term,
 * and "Hasan Sahih" is at-Tirmidhi's own middle verdict, not a plain sahih. */
export function gradeTone(grade: string): GradeTone {
  const g = grade.toLowerCase();
  if (g.includes("mawdu")) return "daif";
  if (g.includes("daif") || g.includes("munkar") || g.includes("shadh")) return "daif";
  if (g.includes("hasan")) return "hasan";
  if (g.includes("sahih")) return "sahih";
  return "neutral";
}

/** The gradings that actually occur often enough to be worth translating —
 * 26 phrases cover 96% of the 67,000 gradings in the dataset. Anything else
 * is shown in the English the graders' verdicts were recorded in, which is
 * honest: a half-translated verdict on a hadith would be worse than none. */
const GRADE_AR: Record<string, string> = {
  "sahih": "صحيح",
  "daif": "ضعيف",
  "hasan": "حسن",
  "hasan sahih": "حسن صحيح",
  "sahih - agreed upon": "صحيح متفق عليه",
  "isnaad hasan": "إسناده حسن",
  "isnaad sahih": "إسناده صحيح",
  "sahih muslim": "أخرجه مسلم",
  "sahih lighairihi": "صحيح لغيره",
  "sahih isnaad": "صحيح الإسناد",
  "daif isnaad": "ضعيف الإسناد",
  "sahih bukhari": "أخرجه البخاري",
  "mauquf sahih": "موقوف صحيح",
  "very daif": "ضعيف جدًا",
  "daif jiddan": "ضعيف جدًا",
  "sahih - bukhari and muslim": "متفق عليه",
  "maqtu sahih": "مقطوع صحيح",
  "shadh": "شاذ",
  "munkar": "منكر",
  "mawdu": "موضوع",
  "mauquf daif": "موقوف ضعيف",
  "hasan lighairihi": "حسن لغيره",
  "hasan isnaad": "حسن الإسناد",
  "hasan gharib": "حسن غريب",
  "sahih mauquf": "صحيح موقوف",
  "sahih maqtu": "صحيح مقطوع",
};

/** The nine scholars whose verdicts the dataset records. */
const GRADER_AR: Record<string, string> = {
  "al-albani": "الألباني",
  "zubair ali zai": "زبير علي زئي",
  "shuaib al arnaut": "شعيب الأرناؤوط",
  "abu ghuddah": "أبو غدة",
  "muhammad muhyi al-din abdul hamid": "محمد محيي الدين عبد الحميد",
  "muhammad fouad abd al-baqi": "محمد فؤاد عبد الباقي",
  "ahmad muhammad shakir": "أحمد محمد شاكر",
  "bashar awad maarouf": "بشار عواد معروف",
  "salim al-hilali": "سليم الهلالي",
};

export const gradeLabel = (locale: Locale, grade: string): string =>
  locale === "ar" ? (GRADE_AR[grade.toLowerCase()] ?? grade) : grade;

export const graderLabel = (locale: Locale, grader: string): string =>
  locale === "ar" ? (GRADER_AR[grader.toLowerCase()] ?? grader) : grader;

/** Which parts of a hadith the reader is showing. */
export type DisplayMode = "both" | "arabic" | "translation";

/** Arabic readers open on the Arabic alone — it is the hadith, and the
 * English translation beside it would be noise. Everyone else gets both. */
export const defaultDisplay = (locale: Locale): DisplayMode =>
  locale === "ar" ? "arabic" : "both";

/** Hadith numbers are usually integers but a few are split as 402.2. */
export const formatNumber = (n: number): string =>
  Number.isInteger(n) ? String(n) : n.toFixed(1);

/** "Sahih al-Bukhari 6018" — the citation people actually copy. */
export const citation = (collectionName: string, n: number): string =>
  `${collectionName} ${formatNumber(n)}`;
