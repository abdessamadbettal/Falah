import { btnGhost, btnPrimary, cn, inputCls, mutedCls } from "./styles";

/** Thin, typed wrappers over the native form elements. Each accepts every
 * prop the underlying element does, so ARIA, refs-as-props (React 19),
 * inputMode, etc. all pass straight through — the wrapper only owns the
 * shared look, keeping focus states and future a11y fixes in one place. */

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variant === "primary" ? btnPrimary : btnGhost, className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputCls, className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(inputCls, className)} {...props} />;
}

export function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 accent-emerald-700 dark:accent-emerald-400", className)}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint ? (
        <span className={`mt-1 block text-xs ${mutedCls}`}>{hint}</span>
      ) : null}
    </label>
  );
}
