import { Star8 } from "./star8";
import { goldCls, mutedCls } from "./styles";

/** Small uppercase section label with a star and a hairline rule. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Star8 className={`size-4 shrink-0 ${goldCls}`} />
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${mutedCls}`}
      >
        {children}
      </span>
      <span
        className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"
        aria-hidden="true"
      />
    </div>
  );
}
