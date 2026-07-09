import { mutedCls } from "./styles";

/** Label + control + optional hint, associated via the wrapping <label>. */
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
