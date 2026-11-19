import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "tech"
    | "glow";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f52538] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none",
          {
            // Variants
            "bg-[#f52538] text-white hover:bg-[#e01b2d] shadow-sm":
              variant === "default",
            "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100":
              variant === "destructive",
            "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-xs":
              variant === "outline",
            "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200":
              variant === "secondary",
            "hover:bg-slate-100 text-slate-700 hover:text-slate-900":
              variant === "ghost",
            "text-sky-600 underline-offset-4 hover:underline":
              variant === "link",
            "bg-sky-600 text-white hover:bg-sky-700 font-bold shadow-sm":
              variant === "tech",
            "bg-gradient-to-r from-[#f52538] to-[#ff4757] text-white shadow-md":
              variant === "glow",
            // Sizes
            "h-11 px-5 py-2 text-xs": size === "default",
            "h-9 px-3.5 text-xs": size === "sm",
            "h-13 px-7 text-sm font-bold": size === "lg",
            "h-10 w-10 p-0 shrink-0": size === "icon",
            "h-8 px-4 rounded-full text-[10px] uppercase tracking-wider": size === "pill",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
