import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "cyan" | "amber" | "emerald";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[8px] font-black uppercase tracking-wider transition-colors",
        {
          "bg-[#f52538] text-white shadow-sm": variant === "default",
          "bg-slate-100 text-slate-700 border border-slate-200": variant === "secondary",
          "bg-rose-50 text-rose-600 border border-rose-200": variant === "destructive",
          "border border-slate-300 text-slate-700 bg-white": variant === "outline",
          "bg-sky-50 text-sky-700 border border-sky-200": variant === "cyan",
          "bg-amber-50 text-amber-700 border border-amber-200": variant === "amber",
          "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "emerald",
        },
        className
      )}
      {...props}
    />
  );
}
