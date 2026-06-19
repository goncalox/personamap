import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SelectControlProps = ComponentPropsWithoutRef<"select"> & {
  label: string;
  helper?: ReactNode;
  labelClassName?: string;
};

export function SelectControl({ label, helper, labelClassName, className, children, ...props }: SelectControlProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink", labelClassName)}>
      <span>{label}</span>
      <span className="relative block">
        <select
          className={cn(
            "min-h-11 w-full appearance-none rounded-md border border-white/10 bg-coal px-3 pr-10 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition hover:border-white/25 focus:border-brass focus:ring-2 focus:ring-brass/20 disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brass/85"
          aria-hidden
        />
      </span>
      {helper ? <span className="text-xs leading-5 text-ink/45">{helper}</span> : null}
    </label>
  );
}
