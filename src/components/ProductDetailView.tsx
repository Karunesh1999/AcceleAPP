import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Radio, 
  Eye, 
  Check, 
  ShoppingCart, 
  Share2
} from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShareModal } from "@/components/ShareModal";
import { playAlertBeep } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  soundEnabled: boolean;
  onOpenSupport: () => void;
}

const getCategoryHeader = (cat: string) => {
  switch (cat) {
    case "cameras":
      return "ADAS SMART SYSTEM";
    case "wiring":
      return "ACTUATORS & RELAYS";
    case "security":
      return "VEHICLE SECURITY & ALARMS";
    case "lighting":
      return "ACCENT & UTILITY LIGHTING";
    case "gps":
      return "IN-VEHICLE AV & CONNECTIVITY";
    default:
      return "AUTOMOTIVE HARDWARE";
  }
};

const getCategoryOverview = (cat: string) => {
  switch (cat) {
    case "cameras":
      return {
        eyebrow: "THE FINAL WORD IN BACKUP CAMERAS",
        heading: "Awareness beyond the frame.",
      };
    case "wiring":
      return {
        eyebrow: "HEAVY-DUTY AUTOMOTIVE SWITCHING",
        heading: "Precision control & actuation.",
      };
    case "security":
      return {
        eyebrow: "ADVANCED VEHICLE SECURITY",
        heading: "Total perimeter & starter protection.",
      };
    case "lighting":
      return {
        eyebrow: "PRO-GRADE AUTOMOTIVE LIGHTING",
        heading: "High-lumen brilliance & clarity.",
      };
    case "gps":
      return {
        eyebrow: "IN-VEHICLE CONNECTIVITY & AV",
        heading: "Fast-charging & seamless pass-through.",
      };
    default:
      return {
        eyebrow: "ENGINEERED FOR PROFESSIONAL INSTALLERS",
        heading: "Engineered for durability & reliability.",
      };
  }
};

export function ProductDetailView({
  product,
  onBack,
  onAddToCart,
  soundEnabled,
  onOpenSupport,
}: ProductDetailViewProps) {
  const [addedToast, setAddedToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    if (soundEnabled) {
      playAlertBeep("click");
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleShare = () => {
    if (soundEnabled) {
      playAlertBeep("click");
    }
    setIsShareOpen(true);
  };

  return (
    <div className="min-h-full bg-slate-50 pb-32 text-slate-900 relative">
      {/* Toast Notification for Share */}
      {shareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/95 px-4 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

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
          <p className="text-[10px] font-bold tracking-wider text-[#f52538] uppercase">
            {getCategoryHeader(product.category)}
          </p>
          <p className="text-xs font-bold text-slate-900">Product details</p>
        </div>

        <button
          onClick={handleShare}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/80 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 active:scale-95 transition shadow-2xs"
          aria-label="Share Product"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-5">
        {/* Top Meta info */}
        <div>
          <div className="flex items-center text-[10px] font-bold">
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight leading-tight text-slate-900">
            {product.name}
          </h1>
        </div>

        {/* Product Image & Badges */}
        <div className="relative h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />

          <Badge
            variant="default"
            className="absolute left-3 top-3 text-[9px] tracking-wider font-bold shadow-sm uppercase z-10"
          >
            {product.tag}
          </Badge>

          <Badge
            variant="emerald"
            className="absolute bottom-3 right-3 text-[9px] tracking-wider font-bold shadow-sm z-10"
          >
            FLEET TIER IN STOCK ({product.stockCount})
          </Badge>
        </div>

        {/* 3 Quick Highlight Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <Radio className="h-5 w-5 mx-auto text-[#f52538]" />
            <p className="mt-1.5 text-[9px] font-bold uppercase text-slate-700 tracking-wider">
              {product.fieldOfView !== "N/A" ? product.fieldOfView : "12V PRO"}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <Eye className="h-5 w-5 mx-auto text-sky-600" />
            <p className="mt-1.5 text-[9px] font-bold uppercase text-slate-700 tracking-wider">
              {product.voltage}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-3 text-center text-slate-800 shadow-2xs">
            <ShieldCheck className="h-5 w-5 mx-auto text-emerald-600" />
            <p className="mt-1.5 text-[9px] font-bold uppercase text-slate-700 tracking-wider">
              {product.environmentalRating}
            </p>
          </div>
        </div>

        {/* 1. Overview Section */}
        {(() => {
          const overviewInfo = getCategoryOverview(product.category);
          return (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#f52538]">
                  {overviewInfo.eyebrow}
                </p>
                <h2 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900">
                  {overviewInfo.heading}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                  {product.description}
                </p>
              </div>

              {/* Highlights List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
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
          );
        })()}

        {/* 2. Specifications Section */}
        <div className="space-y-3 pt-1">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#f52538]">
              ENGINEERING SPECIFICATIONS
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            {/* Model Specification */}
            <div className="flex items-center justify-between px-4 py-3 text-xs border-b border-slate-100 bg-slate-50/60">
              <span className="text-slate-600 font-bold">Model</span>
              <span className="font-bold text-sky-700 font-mono text-right text-xs">
                {product.sku}
              </span>
            </div>
            {Object.entries(product.specs)
              .filter(([k]) => k.toLowerCase() !== "sku" && k.toLowerCase() !== "model")
              .map(([k, v], idx, arr) => (
                <div
                  key={k}
                  className={`flex items-center justify-between px-4 py-3 text-xs ${
                    idx !== arr.length - 1
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
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[430px] items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 pb-4 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#f52538] tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-slate-400 font-normal">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-[9.5px] font-bold text-slate-500 tracking-wider uppercase">
            DEALER TIER 1
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSupport}
            className="h-10 rounded-xl border border-slate-300 bg-slate-100 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition tracking-wide"
          >
            INQUIRE
          </button>

          <button
            onClick={handleAdd}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#f52538] px-4 text-xs font-bold tracking-wide text-white shadow-xs hover:bg-[#ff3347] active:scale-95 transition whitespace-nowrap"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span>{addedToast ? "ADDED!" : "ADD TO ORDER"}</span>
          </button>
        </div>
      </div>

      {/* In-App Shadcn Share Sheet (Confined to Mobile Viewport) */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        product={product}
      />
    </div>
  );
}
