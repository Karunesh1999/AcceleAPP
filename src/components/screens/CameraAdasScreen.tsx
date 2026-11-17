import React, { useState } from "react";
import { 
  Sliders, 
  Volume2 
} from "lucide-react";
import { LiveRadarSimulator } from "@/components/LiveRadarSimulator";
import { PRODUCTS } from "@/data/mockData";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { playAlertBeep } from "@/lib/utils";

interface CameraAdasScreenProps {
  onOpenProduct: (product: Product) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function CameraAdasScreen({
  onOpenProduct,
  soundEnabled,
  onToggleSound,
}: CameraAdasScreenProps) {
  const [selectedCam, setSelectedCam] = useState<"front" | "rear" | "blindspot">("front");
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high">("high");

  const testAudioTone = () => {
    playAlertBeep("warning");
  };

  return (
    <div className="pb-28 bg-slate-50 min-h-full">
      {/* Top Banner */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
              PRO TELEMETRY & ADAS RADAR
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Live Sensor Cockpit
            </h1>
          </div>

          <Badge variant="emerald" className="font-mono">
            CALIBRATED
          </Badge>
        </div>

        {/* Camera Selector Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "front", label: "Front Bumper Radar" },
            { id: "rear", label: "Rear Hitch (RVC180CTD)" },
            { id: "blindspot", label: "Blindspot Aux" },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCam(c.id as typeof selectedCam)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCam === c.id
                  ? "bg-[#f52538] text-white shadow-2xs font-black"
                  : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Live Radar Simulator */}
      <div className="px-4 pt-4">
        <LiveRadarSimulator
          soundEnabled={soundEnabled}
          onExploreProduct={() => onOpenProduct(PRODUCTS[0])}
        />
      </div>

      {/* Sensor Calibration & Diagnostics */}
      <div className="px-4 pt-5 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#f52538]" />
              <span>Radar Vector Configuration</span>
            </h3>
            <button
              onClick={testAudioTone}
              className="text-[10px] font-bold text-amber-600 flex items-center gap-1 hover:underline"
            >
              <Volume2 className="w-3 h-3" /> Test Buzzer
            </button>
          </div>

          {/* Sensitivity Levels */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-semibold">
              Cross-Traffic Detection Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSensitivity(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition ${
                    sensitivity === lvl
                      ? "bg-[#f52538] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px]">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Doppler Sweep:</span>
              <span className="font-mono text-sky-700 font-bold">24.125 GHz</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Response Latency:</span>
              <span className="font-mono text-emerald-700 font-bold">&lt; 35ms</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Video Protocol:</span>
              <span className="font-mono text-slate-800 font-bold">AHD 1080P</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-500">Enclosure Integrity:</span>
              <span className="font-mono text-emerald-700 font-bold">IP69K OK</span>
            </div>
          </div>
        </div>

        {/* Featured Flagship Product Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1 max-w-[220px]">
            <Badge variant="cyan">FLAGSHIP HARDWARE</Badge>
            <h4 className="text-sm font-black text-slate-900">RVC180CTD Smart System</h4>
            <p className="text-[10px] text-slate-500">
              Order extra camera modules for fleet deployments.
            </p>
          </div>

          <button
            onClick={() => onOpenProduct(PRODUCTS[0])}
            className="px-3.5 py-2.5 rounded-xl bg-[#f52538] text-white text-xs font-black shadow-sm hover:bg-[#ff3347] active:scale-95 transition"
          >
            SPECS & BUY
          </button>
        </div>
      </div>
    </div>
  );
}
