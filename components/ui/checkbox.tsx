import { cn } from "./styles";

/** Native checkbox in the brand color. */
export function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 accent-emerald-700 dark:accent-emerald-400", className)}
      {...props}
    />
  );
}
