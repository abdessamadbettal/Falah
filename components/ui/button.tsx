import { btnGhost, btnPrimary, cn } from "./styles";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "ghost";
};

/** Wraps the native <button>: every prop (ARIA, ref, onClick, …) passes
 * straight through; the wrapper only owns the shared look. Defaults to
 * type="button" so forms don't submit by accident. */
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
