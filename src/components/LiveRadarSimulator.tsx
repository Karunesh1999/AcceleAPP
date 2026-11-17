import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Eye, 
  Layers,
  Sparkles
} from "lucide-react";
import rvcScene from "@/assets/rvc180-scene.png";
import { playAlertBeep } from "@/lib/utils";

interface LiveRadarSimulatorProps {
  soundEnabled: boolean;
  onExploreProduct?: () => void;
}

export function LiveRadarSimulator({
  soundEnabled,
  onExploreProduct,
}: LiveRadarSimulatorProps) {
  const [activeZone, setActiveZone] = useState<"left" | "clear" | "right">("left");
  const [guidelinesVisible, setGuidelinesVisible] = useState(true);
  const [hudActive, setHudActive] = useState(true);
  const [autoSimulate, setAutoSimulate] = useState(false);
  const [cameraMount, setCameraMount] = useState<"front" | "rear">("front");

  // Auto simulate cycle if enabled
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      setActiveZone((curr) => {
        if (curr === "left") return "clear";
        if (curr === "clear") return "right";
        return "left";
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [autoSimulate]);

  // Play audio warning on hazard
  useEffect(() => {
    if (soundEnabled && (activeZone === "left" || activeZone === "right")) {
      playAlertBeep("warning");
    }
  }, [activeZone, soundEnabled]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Simulation Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="h-2 w-2 rounded-full bg-emerald-500 block" />
            <span className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>LIVE ADAS HUD SIMULATOR</span>
              <span className="rounded bg-sky-50 border border-sky-200 px-1.5 py-0.5 text-[8px] font-bold text-sky-700">
                180° RADAR
              </span>
            </h4>
            <p className="text-[9px] text-slate-500">
              Interactive Doppler cross-traffic recognition
            </p>
          </div>
        </div>

        <button
          onClick={() => setAutoSimulate(!autoSimulate)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black transition-colors ${
            autoSimulate 
              ? "bg-[#f52538] text-white shadow-2xs" 
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          {autoSimulate ? "AUTO ON" : "DEMO CYCLE"}
        </button>
      </div>

      {/* Main Visual Display Area (Vehicle Camera Monitor Feed) */}
      <div className="relative h-60 w-full bg-slate-950 overflow-hidden select-none">
        <img
          src={rvcScene}
          alt="180° Radar Cross Traffic Detection"
          className="h-full w-full object-cover opacity-90 transition-all duration-300"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

        {/* Radar Sweep Animated Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute left-1/2 top-4 -translate-x-1/2 w-48 h-48 border-2 border-sky-400/40 rounded-full animate-ping [animation-duration:3s]" />
          <div className="absolute left-1/2 top-4 -translate-x-1/2 w-32 h-32 border border-sky-400/30 rounded-full" />
        </div>

        {/* Telemetry HUD Overlays */}
        {hudActive && (
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            {/* Top HUD Line */}
            <div className="flex items-center justify-between text-[9px] font-mono font-bold">
              <span className="rounded bg-black/60 backdrop-blur px-2 py-0.5 text-sky-300 border border-white/10">
                FOV: 180.4° | CAM: {cameraMount.toUpperCase()}
              </span>
              <span className={`rounded px-2 py-0.5 backdrop-blur font-bold ${
                activeZone === "clear" 
                  ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40"
                  : "bg-red-500/30 text-red-300 border border-red-400/40 animate-pulse"
              }`}>
                {activeZone === "clear" ? "SAFE CORRIDOR" : "HAZARD DETECTED"}
              </span>
            </div>

            {/* Target Bounding Box and Warning Overlay */}
            {activeZone === "left" && (
              <div className="absolute left-6 top-16 w-32 h-24 border-2 border-red-500 rounded bg-red-500/20 animate-pulse flex flex-col justify-between p-1.5">
                <span className="text-[8px] font-black bg-red-600 text-white px-1 self-start rounded shadow-xs">
                  VEHICLE: 14 MPH
                </span>
                <span className="text-[8px] font-mono text-red-200">
                  DIST: 7.8 FT ◀
                </span>
              </div>
            )}

            {activeZone === "right" && (
              <div className="absolute right-6 top-16 w-32 h-24 border-2 border-red-500 rounded bg-red-500/20 animate-pulse flex flex-col justify-between p-1.5">
                <span className="text-[8px] font-black bg-red-600 text-white px-1 self-end rounded shadow-xs">
                  TRUCK: 12 MPH
                </span>
                <span className="text-[8px] font-mono text-red-200 text-right">
                  ▶ DIST: 9.4 FT
                </span>
              </div>
            )}

            {/* Parking Guidelines Overlay */}
            {guidelinesVisible && (
              <div className="absolute bottom-6 inset-x-12 h-14 border-x-2 border-dashed border-amber-400/80 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-red-500/90 w-full" />
                <div className="border-b border-amber-400/70 w-full" />
                <div className="border-b border-emerald-400/60 w-full" />
              </div>
            )}

            {/* Bottom Alert Banner */}
            <div className="flex items-center justify-between">
              {activeZone !== "clear" ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-white shadow-md animate-bounce">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-wide">
                    {activeZone === "left" ? "CROSS TRAFFIC FROM LEFT" : "CROSS TRAFFIC FROM RIGHT"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-white shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-wide">
                    PATH CLEAR AHEAD
                  </span>
                </div>
              )}

              <span className="text-[8px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                24.125 GHz RADAR
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls & Scenario Triggers */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span>SIMULATE RADAR SCENARIO:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGuidelinesVisible(!guidelinesVisible)}
              className={`flex items-center gap-1 ${guidelinesVisible ? "text-sky-700 font-black" : "text-slate-400"}`}
              title="Toggle parking guidelines"
            >
              <Layers className="w-3 h-3" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setHudActive(!hudActive)}
              className={`flex items-center gap-1 ${hudActive ? "text-sky-700 font-black" : "text-slate-400"}`}
              title="Toggle HUD bounding boxes"
            >
              <Eye className="w-3 h-3" />
              <span>HUD</span>
            </button>
            <button
              onClick={() => setCameraMount(cameraMount === "front" ? "rear" : "front")}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{cameraMount === "front" ? "Front" : "Rear"}</span>
            </button>
          </div>
        </div>

        {/* 3 Scenario Selection Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveZone("left")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              activeZone === "left"
                ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <span className="text-rose-600 text-xs mb-0.5">◀ 🚗</span>
            <span className="text-[9px] font-black leading-tight">LEFT TRAFFIC</span>
            <span className="text-[7px] text-rose-600 font-bold mt-0.5">Alert</span>
          </button>

          <button
            onClick={() => setActiveZone("clear")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              activeZone === "clear"
                ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <span className="text-emerald-600 text-xs mb-0.5">✓ 🛣️</span>
            <span className="text-[9px] font-black leading-tight">CLEAR AHEAD</span>
            <span className="text-[7px] text-emerald-600 font-bold mt-0.5">Safe</span>
          </button>

          <button
            onClick={() => setActiveZone("right")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
              activeZone === "right"
                ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <span className="text-rose-600 text-xs mb-0.5">🚚 ▶</span>
            <span className="text-[9px] font-black leading-tight">RIGHT TRAFFIC</span>
            <span className="text-[7px] text-rose-600 font-bold mt-0.5">Alert</span>
          </button>
        </div>

        {onExploreProduct && (
          <button
            onClick={onExploreProduct}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f52538] text-white text-[11px] font-black tracking-wide shadow-sm hover:bg-[#ff3347] active:scale-98 transition"
          >
            <span>VIEW RVC180CTD HARDWARE SPECS</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
