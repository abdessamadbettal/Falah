import { cn, inputCls } from "./styles";

/** Native <select> with the shared field styling plus a custom chevron — the
 * browser's default arrow can't be themed and looks different in every engine.
 * The wrapper stays full-width so <Select> drops into the same slots as
 * <Input>, and the chevron is RTL-aware (`pe-10` / `end-3`). */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full">
      <select
        className={cn(inputCls, "peer cursor-pointer appearance-none pe-10", className)}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors peer-hover:text-zinc-500 peer-focus:text-emerald-600 dark:peer-hover:text-zinc-300 dark:peer-focus:text-emerald-400"
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  );
}
