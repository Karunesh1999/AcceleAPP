import React from "react";

interface LogoProps {
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  subtext?: string;
}

export function Logo({
  compact = false,
  size = "md",
  className = "",
  subtext = "PRO TELEMETRY",
}: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-16 w-16 rounded-[22px]",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-[-0.04em]",
    lg: "text-3xl tracking-[-0.05em]",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`${iconSizes[size]} relative grid place-items-center bg-[#f52538] shadow-sm shrink-0 transition-transform active:scale-95`}
      >
        {/* Accele Geometric Symbol */}
        <div className="h-[46%] w-[46%] rotate-45 border-[3px] border-white border-l-transparent" />
      </div>

      <div>
        <div className={`font-black leading-none text-slate-900 ${textSizes[size]}`}>
          ACCELE
        </div>
        {!compact && (
          <div className="mt-1 text-[7px] font-extrabold tracking-[0.24em] text-slate-500 uppercase">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
