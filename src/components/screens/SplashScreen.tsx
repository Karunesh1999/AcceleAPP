import React, { useEffect } from "react";
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
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete, soundEnabled]);

  return (
    <main
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-white text-slate-900 cursor-pointer select-none"
      onClick={onComplete}
      title="Tap to continue"
    >
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.12)_1px,transparent_1px)] [background-size:36px_36px]" />

      {/* Radar Concentric Rings */}
      <div className="absolute h-80 w-80 rounded-full border border-red-500/15 animate-[pulse_2.5s_ease-in-out_infinite]" />
      <div className="absolute h-56 w-56 rounded-full border border-sky-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
      <div className="absolute h-36 w-36 rounded-full border border-slate-300/40" />

      {/* Center Logo & Branding */}
      <div className="relative flex flex-col items-center z-10">
        <div className="mb-5 grid h-20 w-20 place-items-center rounded-[26px] bg-[#f52538] shadow-[0_12px_30px_rgba(245,37,56,0.3)] transition-transform animate-in zoom-in-75 duration-700">
          <div className="h-8 w-8 rotate-45 border-[5px] border-white border-l-transparent" />
        </div>

        <h1 className="text-4xl font-black tracking-[-0.06em] text-slate-900">
          ACCELE
        </h1>

        <p className="mt-3 text-[10px] font-black tracking-[0.42em] text-[#f52538] uppercase">
          DRIVING INNOVATION
        </p>
      </div>

      {/* Bottom Status Indicator */}
      <div className="absolute bottom-12 flex items-center gap-2.5 text-[10px] font-extrabold tracking-widest text-slate-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm" />
        </span>
        <span>TELEMETRY READY</span>
      </div>
    </main>
  );
}
