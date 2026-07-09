import { LocaleProvider } from "@/components/locale";
import { fontVariables } from "@/lib/fonts";
import { dirFor, getDict, type Locale } from "@/lib/i18n";

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

/** The <html>/<body> shell the [locale] layout renders for every
 * language — direction, fonts, theme bootstrap and skip link live here. */
export function RootShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900 antialiased selection:bg-emerald-700 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* keyboard users skip the sticky header straight to <main id="main"> */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {getDict(locale).common.skipToContent}
        </a>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
