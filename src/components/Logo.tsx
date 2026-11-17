import React from "react";
import acceleLogo from "@/assets/accele-logo.png";

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
}: LogoProps) {
  const heightClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-14",
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={acceleLogo}
        alt="Accele Electronics, Inc."
        className={`${compact ? "h-7" : heightClasses[size]} w-auto max-w-[190px] object-contain transition-transform active:scale-95`}
      />
    </div>
  );
}
