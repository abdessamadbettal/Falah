import { cn, inputCls } from "./styles";

/** Wraps the native <select> with the shared field look. */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(inputCls, className)} {...props} />;
}
