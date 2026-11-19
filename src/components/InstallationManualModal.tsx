import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  Wrench,
  Sparkles
} from "lucide-react";
import { Sheet } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WIRING_GUIDES, type WiringGuideData } from "@/data/wiringGuides";
import type { Product } from "@/types";
import { generateBayGuidePdf } from "@/lib/pdfGenerator";

interface InstallationManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  initialCategory?: string;
  onContactSupport?: () => void;
}

export function InstallationManualModal({
  isOpen,
  onClose,
  product,
  initialCategory = "cameras",
  onContactSupport,
}: InstallationManualModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (product?.category && WIRING_GUIDES[product.category]) {
      return product.category;
    }
    return initialCategory;
  });

  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync selected category if product changes
  React.useEffect(() => {
    if (product?.category && WIRING_GUIDES[product.category]) {
      setSelectedCategory(product.category);
    }
  }, [product]);

  const activeGuide: WiringGuideData = 
    WIRING_GUIDES[selectedCategory] || WIRING_GUIDES.cameras;

  const sku = product?.sku || "AC-PRO-BAY";
  const productName = product?.name || activeGuide.title;

  const handleCopyPinout = async () => {
    const text = [
      `ACCELE ELECTRONICS - TECHNICAL BAY MANUAL`,
      `Document: ${activeGuide.docNumber}`,
      `Hardware: ${sku} - ${productName}`,
      `Standard: ${activeGuide.title} (${activeGuide.subtitle})`,
      `----------------------------------------`,
      ...activeGuide.pins.map(
        (p) => `${p.label} ${p.desc} [${p.voltage}]`
      ),
      `----------------------------------------`,
      `Special Bay Note: ${activeGuide.note}`,
    ].join("\n");

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadPdf = () => {
    try {
      generateBayGuidePdf(activeGuide, product);
      setDownloadSuccess(true);
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
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Bay Installation Manual"
      subtitle="Accele Engineering Hub"
      className="max-h-[92dvh] pb-8 overflow-y-auto"
    >
      <div className="space-y-4 pt-1">
        {/* Category Pills (Only show if not locked to single product or allow switching) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 ${
                  isActive
                    ? "bg-[#f52538] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Document Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              {activeGuide.docNumber}
            </span>
            <Badge variant={activeGuide.badgeVariant}>{activeGuide.badgeText}</Badge>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {activeGuide.title}
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {activeGuide.subtitle}
            </p>
          </div>

          {product && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80 text-[11px] text-slate-600">
              <span className="font-bold text-[#f52538]">TARGET HARDWARE:</span>
              <span className="truncate font-semibold">{product.sku} ({product.name})</span>
            </div>
          )}
        </div>

        {/* Pinout Schematic Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Terminal Pinout & Color Code
            </span>
            <button
              onClick={handleCopyPinout}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#f52538] transition"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Pinout</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2.5 shadow-2xs">
            {activeGuide.pins.map((pin, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span 
                    className="h-3 w-3 rounded-full shrink-0 shadow-2xs border border-black/10" 
                    style={{ backgroundColor: pin.wireColorHex }} 
                  />
                  <span className={`${pin.colorClass} truncate font-bold`}>
                    {pin.label}
                  </span>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <div className="text-[11.5px] font-medium text-slate-800">
                    {pin.desc}
                  </div>
                  <div className="text-[9.5px] font-mono text-slate-400">
                    {pin.voltage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note / Advisory Box */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 flex items-start gap-2.5 text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11.5px] leading-relaxed">
            <strong className="block text-amber-950 font-bold mb-0.5">Critical Installation Note</strong>
            {activeGuide.note}
          </div>
        </div>

        {/* Installation Checklist */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Bay Installation Checklist
          </span>
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs text-slate-700 shadow-2xs">
            {activeGuide.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[11.5px] leading-normal">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Download & Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleDownloadPdf}
            variant="default"
            size="lg"
            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-3 shadow-md active:scale-98"
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
              className="text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print Sheet</span>
            </Button>

            {onContactSupport && (
              <Button
                onClick={() => {
                  onClose();
                  onContactSupport();
                }}
                variant="outline"
                size="sm"
                className="text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Wrench className="h-3.5 w-3.5 text-[#f52538]" />
                <span>Bay Tech Chat</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
