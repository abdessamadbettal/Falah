import { LocaleProvider } from "@/components/locale";
import { fontVariables } from "@/lib/fonts";
import { dirFor, type Locale } from "@/lib/i18n";

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

/** The single <html>/<body> shell shared by every root layout (the
 * English tree at "/" and the [locale] tree for /fr, /ar) so the two
 * stay visually and technically identical. */
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
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
