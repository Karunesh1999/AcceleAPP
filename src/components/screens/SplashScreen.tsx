import React, { useEffect } from "react";
import acceleLogo from "@/assets/accele-logo.png";
import { playAlertBeep } from "@/lib/utils";

interface SplashScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

export function SplashScreen({ onComplete, soundEnabled }: SplashScreenProps) {
  useEffect(() => {
    if (soundEnabled) {
      playAlertBeep("click");
    }
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete, soundEnabled]);

  return (
    <main
      className="relative flex min-h-screen h-full w-full items-center justify-center overflow-hidden bg-white text-slate-900 cursor-pointer select-none p-6"
      onClick={onComplete}
      title="Tap to continue"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.12)_1px,transparent_1px)] [background-size:36px_36px]" />

      {/* Radar Concentric Rings */}
      <div className="absolute h-80 w-80 rounded-full border border-red-500/15 animate-[pulse_2.5s_ease-in-out_infinite]" />
      <div className="absolute h-56 w-56 rounded-full border border-amber-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
      <div className="absolute h-36 w-36 rounded-full border border-slate-300/40" />

      {/* Center Official Accele Logo */}
      <div className="relative flex flex-col items-center z-10 animate-in zoom-in-90 duration-700">
        <div className="p-4 bg-white/95 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center max-w-[280px]">
          <img
            src={acceleLogo}
            alt="Accele Electronics, Inc."
            className="w-full h-auto object-contain drop-shadow-xs"
          />
        </div>

        <p className="mt-5 text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">
          AUTOMOTIVE PRO TELEMETRY
        </p>
      </div>

      {/* Bottom Status Indicator */}
      <div className="absolute bottom-12 flex items-center gap-2.5 text-[10px] font-bold tracking-widest text-slate-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm" />
        </span>
        <span>SYSTEM READY</span>
      </div>
    </main>
  );
}
