"use client";

interface SelectedChoiceProps {
  label: string;
  value: string;
  accent?: "teal" | "violet";
  onClear: () => void;
  onChange: () => void;
  disabled?: boolean;
  changeLabel: string;
  clearLabel: string;
}

export function SelectedChoice({
  label,
  value,
  accent = "teal",
  onClear,
  onChange,
  disabled,
  changeLabel,
  clearLabel,
}: SelectedChoiceProps) {
  const styles =
    accent === "teal"
      ? {
          border: "border-teal-200",
          bg: "bg-teal-50",
          label: "text-teal-800",
          value: "text-teal-900",
          btn: "text-teal-700 hover:bg-teal-100",
        }
      : {
          border: "border-violet-200",
          bg: "bg-violet-50",
          label: "text-violet-800",
          value: "text-violet-900",
          btn: "text-violet-700 hover:bg-violet-100",
        };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${styles.border} ${styles.bg}`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-xs font-medium ${styles.label}`}>{label}</p>
        <p className={`truncate text-sm font-semibold ${styles.value}`}>{value}</p>
      </div>
      {!disabled && (
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onChange}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium ${styles.btn}`}
          >
            {changeLabel}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white/80"
            aria-label={clearLabel}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
