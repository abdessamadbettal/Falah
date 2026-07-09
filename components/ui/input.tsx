import { cn, inputCls } from "./styles";

/** Wraps the native <input> with the shared field look; all props pass
 * through, so inputMode, ARIA and refs work as on the raw element. */
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputCls, className)} {...props} />;
}
