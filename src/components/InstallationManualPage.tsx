import React, { useState } from "react";
import { 
  ChevronLeft,
  Download, 
  Printer, 
  Check, 
  AlertTriangle, 
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WIRING_GUIDES, type WiringGuideData } from "@/data/wiringGuides";
import type { Product } from "@/types";
import { generateBayGuidePdf } from "@/lib/pdfGenerator";
import { playAlertBeep } from "@/lib/utils";

interface InstallationManualPageProps {
  onBack: () => void;
  product?: Product;
  initialCategory?: string;
  onContactSupport?: () => void;
  soundEnabled?: boolean;
}

export function InstallationManualPage({
  onBack,
  product,
  initialCategory = "cameras",
  onContactSupport,
  soundEnabled,
}: InstallationManualPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (product?.category && WIRING_GUIDES[product.category]) {
      return product.category;
    }
    return initialCategory;
  });

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  React.useEffect(() => {
    if (product?.category && WIRING_GUIDES[product.category]) {
      setSelectedCategory(product.category);
    }
  }, [product]);

  const activeGuide: WiringGuideData = 
    WIRING_GUIDES[selectedCategory] || WIRING_GUIDES.cameras;

  const sku = product?.sku || "AC-PRO-BAY";
  const productName = product?.name || activeGuide.title;

  const handleDownloadPdf = () => {
    try {
      generateBayGuidePdf(activeGuide, product);
      setDownloadSuccess(true);
      if (soundEnabled) playAlertBeep("success");
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  const categories = [
    { id: "cameras", name: "Cameras", icon: "📹" },
    { id: "wiring", name: "Relays", icon: "⚡" },
    { id: "security", name: "Security", icon: "🛡️" },
    { id: "lighting", name: "Lighting", icon: "💡" },
    { id: "gps", name: "Dash Ports", icon: "🔌" },
  ];

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
      {/* Sticky Header with Back Navigation */}
      <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <button
          onClick={onBack}
          aria-label="Back to Profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#f52538] block leading-none">
            Accele Engineering Hub
          </span>
          <h1 className="text-base font-bold text-slate-900 mt-0.5">
            Bay Installation Manual
          </h1>
        </div>

        <div className="w-10" />
      </header>

      {/* Main Page Content */}
      <div className="p-4 space-y-4">
        {/* Category Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  if (soundEnabled) playAlertBeep("click");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#f52538] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Document Header Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {activeGuide.title}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {activeGuide.subtitle}
            </p>
          </div>

          {product && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-bold text-[#f52538]">TARGET HARDWARE:</span>
              <span className="truncate font-semibold">{product.sku} ({product.name})</span>
            </div>
          )}
        </div>

        {/* Pinout Schematic Section */}
        <div className="space-y-2">
          <div className="px-1">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              Terminal Pinout & Color Code
            </span>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-2xs">
            {activeGuide.pins.map((pin, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span 
                    className="h-3.5 w-3.5 rounded-full shrink-0 shadow-xs border border-black/10" 
                    style={{ backgroundColor: pin.wireColorHex }} 
                  />
                  <span className={`${pin.colorClass} truncate font-bold`}>
                    {pin.label}
                  </span>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-semibold text-slate-800">
                    {pin.desc}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {pin.voltage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note / Advisory Box */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-amber-900 shadow-2xs">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block text-amber-950 font-bold mb-0.5">Critical Installation Note</strong>
            {activeGuide.note}
          </div>
        </div>

        {/* Installation Checklist */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Bay Installation Checklist
          </span>
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 space-y-2.5 text-xs text-slate-700 shadow-2xs">
            {activeGuide.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs leading-relaxed text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download & Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            onClick={handleDownloadPdf}
            variant="default"
            size="lg"
            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3.5 shadow-md active:scale-98 cursor-pointer rounded-2xl"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>Guide Downloaded & Ready to Print!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Official Bay Guide (PDF)</span>
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              size="sm"
              className="text-xs font-bold flex items-center justify-center gap-1.5 rounded-2xl py-2.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print Sheet</span>
            </Button>

            {onContactSupport && (
              <Button
                onClick={onContactSupport}
                variant="outline"
                size="sm"
                className="text-xs font-bold flex items-center justify-center gap-1.5 rounded-2xl py-2.5 cursor-pointer hover:border-[#f52538] hover:text-[#f52538]"
              >
                <Wrench className="h-3.5 w-3.5 text-[#f52538]" />
                <span>Bay Tech Chat</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
