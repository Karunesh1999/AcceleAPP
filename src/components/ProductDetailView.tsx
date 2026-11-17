import React, { useState } from "react";
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Radio, 
  Eye, 
  Check, 
  ShoppingCart, 
  FileText, 
  Wrench,
  AlertCircle
} from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LiveRadarSimulator } from "@/components/LiveRadarSimulator";
import { playAlertBeep } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  soundEnabled: boolean;
  onOpenSupport: () => void;
}

export function ProductDetailView({
  product,
  onBack,
  onAddToCart,
  soundEnabled,
  onOpenSupport,
}: ProductDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "simulator" | "wiring">("overview");
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    if (soundEnabled) {
      playAlertBeep("click");
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="min-h-full bg-slate-50 pb-32 text-slate-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-2xs">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80 active:scale-95 transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
            {product.category === "cameras" ? "ADAS SMART SYSTEM" : "AUTOMOTIVE HARDWARE"}
          </p>
          <p className="text-[12px] font-bold text-slate-900">Product details</p>
        </div>

        <button
          onClick={onOpenSupport}
          className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-[#f52538] border border-rose-200 active:scale-95 transition shadow-2xs"
          aria-label="Dealer Support"
        >
          <Wrench className="h-4 w-4" />
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-5">
        {/* Top Meta info */}
        <div>
          <div className="flex items-center justify-between text-[9px] font-bold">
            <span className="text-sky-700 font-mono tracking-wider">
              MODEL: {product.sku}
            </span>
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h1 className="mt-1.5 text-2xl font-black leading-tight text-slate-900">
            {product.name}
          </h1>
        </div>

        {/* Product Image & Badges */}
        <div className="relative h-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white flex items-center justify-center p-6 shadow-xs">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain filter drop-shadow-sm"
          />

          <Badge
            variant="default"
            className="absolute left-3 top-3 text-[8px] tracking-wider font-black shadow-xs"
          >
            LIVE HUD SIMULATION
          </Badge>

          <Badge
            variant="emerald"
            className="absolute bottom-3 right-3 text-[8px] tracking-wider font-bold"
          >
            FLEET TIER IN STOCK ({product.stockCount})
          </Badge>
        </div>

        {/* 3 Quick Highlight Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <Radio className="h-5 w-5 mx-auto text-[#f52538]" />
            <p className="mt-1.5 text-[8px] font-black uppercase text-slate-700">
              {product.fieldOfView}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <Eye className="h-5 w-5 mx-auto text-sky-600" />
            <p className="mt-1.5 text-[8px] font-black uppercase text-slate-700">
              160° LCD NTSC/AHD
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <ShieldCheck className="h-5 w-5 mx-auto text-emerald-600" />
            <p className="mt-1.5 text-[8px] font-black uppercase text-slate-700">
              {product.environmentalRating}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-200">
          {[
            { id: "overview", label: "Overview" },
            { id: "simulator", label: "Live HUD" },
            { id: "specs", label: "Specs" },
            { id: "wiring", label: "Wiring" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <p className="text-[8px] font-black uppercase tracking-widest text-[#f52538]">
                THE FINAL WORD IN BACKUP CAMERAS
              </p>
              <h2 className="mt-1.5 text-lg font-black text-slate-900">
                Awareness beyond the frame.
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Highlights List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                Key Engineering Highlights
              </h3>
              <div className="space-y-2.5">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Radar Simulator */}
        {activeTab === "simulator" && (
          <div className="space-y-3 animate-in fade-in">
            <LiveRadarSimulator soundEnabled={soundEnabled} />
          </div>
        )}

        {/* Tab 3: Specs Table */}
        {activeTab === "specs" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#f52538]">
                ENGINEERING SPECIFICATIONS
              </p>
              <span className="text-[8px] font-mono text-slate-500">REV 4.2 / ISO 9001</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
              {Object.entries(product.specs).map(([k, v], idx) => (
                <div
                  key={k}
                  className={`flex items-center justify-between px-4 py-3 text-xs ${
                    idx !== Object.entries(product.specs).length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <span className="text-slate-500 font-medium">{k}</span>
                  <span className="font-bold text-slate-900 text-right max-w-[190px]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Wiring & Installation */}
        {activeTab === "wiring" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">4-Pin Mini DIN Pinout</h4>
                  <p className="text-[10px] text-slate-500">Standard Accele Pro Bus</p>
                </div>
                <Badge variant="cyan">BAY VERIFIED</Badge>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] space-y-1.5 border border-slate-200 text-slate-800">
                <div className="flex justify-between">
                  <span className="text-rose-600 font-bold">PIN 1 (Red):</span>
                  <span>+12V Reverse Lamp Trigger</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-bold">PIN 2 (Black):</span>
                  <span>Chassis Ground</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-600 font-bold">PIN 3 (Yellow):</span>
                  <span>Video Positive (CVBS / AHD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-600 font-bold">PIN 4 (White):</span>
                  <span>Audio Buzzer Output</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50/60 rounded-xl text-xs text-amber-900 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Loop cut wire (Green): Cut loop to disable dynamic parking guideline overlay.
                </span>
              </div>

              <Button
                onClick={onOpenSupport}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-2" /> Download Full PDF Bay Guide
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[430px] items-center gap-3 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mr-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] line-through text-slate-400">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-[8px] font-black text-[#f52538] tracking-wider uppercase">
            DEALER TIER 1
          </p>
        </div>

        <button
          onClick={onOpenSupport}
          className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3.5 text-[10px] font-black text-slate-800 hover:bg-slate-200 active:scale-95 transition"
        >
          INQUIRE
        </button>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-[#f52538] px-5 py-3.5 text-[11px] font-black text-white shadow-sm hover:bg-[#ff3347] active:scale-95 transition"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{addedToast ? "ADDED!" : "ADD TO ORDER"}</span>
        </button>
      </div>
    </div>
  );
}
