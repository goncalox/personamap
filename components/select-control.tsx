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
            "field-control appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-60",
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
