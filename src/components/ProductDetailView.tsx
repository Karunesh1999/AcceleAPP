import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Radio, 
  Eye, 
  Check, 
  ShoppingCart, 
  FileText, 
  AlertCircle,
  Share2
} from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { playAlertBeep } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  soundEnabled: boolean;
  onOpenSupport: () => void;
}

interface WiringPin {
  label: string;
  desc: string;
  colorClass: string;
}

interface CategoryWiringData {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: "cyan" | "emerald" | "amber" | "default";
  pins: WiringPin[];
  note: string;
  buttonLabel: string;
}

const CATEGORY_WIRING_DATA: Record<string, CategoryWiringData> = {
  cameras: {
    title: "4-Pin Mini DIN Pinout",
    subtitle: "Standard Accele Pro Video Bus",
    badgeText: "BAY VERIFIED",
    badgeVariant: "cyan",
    pins: [
      { label: "PIN 1 (Red):", desc: "+12V Reverse Lamp Trigger", colorClass: "text-rose-600 font-bold" },
      { label: "PIN 2 (Black):", desc: "Chassis Ground", colorClass: "text-slate-600 font-bold" },
      { label: "PIN 3 (Yellow):", desc: "Video Positive (CVBS / AHD)", colorClass: "text-amber-600 font-bold" },
      { label: "PIN 4 (White):", desc: "Audio Buzzer Output", colorClass: "text-sky-600 font-bold" },
    ],
    note: "Loop cut wire (Green): Cut loop to disable dynamic parking guideline overlay. Loop cut wire (White): Cut to switch from Mirror/Reverse to Normal/Front view.",
    buttonLabel: "Download Full PDF Bay Guide",
  },
  wiring: {
    title: "SPDT Switch & Actuator Terminal Pinout",
    subtitle: "Standard Accele Industrial 12V/24V Bay Pinout",
    badgeText: "SAE VERIFIED",
    badgeVariant: "emerald",
    pins: [
      { label: "COM (Pin 30):", desc: "Common 12V DC Supply / Power Tap", colorClass: "text-slate-700 font-bold" },
      { label: "NC (Pin 87a):", desc: "Normally Closed (Resting circuit contact)", colorClass: "text-sky-600 font-bold" },
      { label: "NO (Pin 87):", desc: "Normally Open (+12V output on trigger)", colorClass: "text-rose-600 font-bold" },
      { label: "Motor Leads:", desc: "2-Wire Polarity Reversing Motor Actuator", colorClass: "text-amber-600 font-bold" },
    ],
    note: "Polarity Reversal: For central door-locking actuators, ensure inline 15A fuse is installed before tying into factory BCM harness.",
    buttonLabel: "Download Relay & Actuator Schematic PDF",
  },
  security: {
    title: "Primary Vehicle Security Harness",
    subtitle: "Multi-Zone Telematics & Starter Kill Harness",
    badgeText: "PRO BAY VERIFIED",
    badgeVariant: "cyan",
    pins: [
      { label: "PIN 1 (Red - 12 AWG):", desc: "+12V Constant Battery Tap (Fused 30A)", colorClass: "text-rose-600 font-bold" },
      { label: "PIN 2 (Black):", desc: "Direct Chassis Ground (Clean bare metal)", colorClass: "text-slate-700 font-bold" },
      { label: "PIN 3 (Yellow):", desc: "Ignition 1 Switched (+12V Run & Crank)", colorClass: "text-amber-600 font-bold" },
      { label: "PIN 4 (Brown):", desc: "Siren (+) Positive Output (2A Max Drive)", colorClass: "text-sky-600 font-bold" },
      { label: "PIN 5 (Violet/Green):", desc: "(+ / -) Door Pin Sense Triggers", colorClass: "text-emerald-600 font-bold" },
    ],
    note: "Tachometer Sensing: Program tachometer sense or tachless voltage monitor before initiating remote starter sequence to prevent starter grind.",
    buttonLabel: "Download Security & Remote Start Guide PDF",
  },
  lighting: {
    title: "12V DC Low-Voltage Lighting Harness",
    subtitle: "Direct Bay Power & Courtesy Dimmer Wiring",
    badgeText: "DOT COMPLIANT",
    badgeVariant: "amber",
    pins: [
      { label: "Wire 1 (Red / +):", desc: "+12V Switched Power / Interior Dome Tap", colorClass: "text-rose-600 font-bold" },
      { label: "Wire 2 (Black / -):", desc: "Chassis Ground (-)", colorClass: "text-slate-700 font-bold" },
      { label: "Wire 3 (Yellow / PWM):", desc: "Optional Courtesy Dimmer / Door Trigger", colorClass: "text-amber-600 font-bold" },
    ],
    note: "Reverse Polarity Protection: Integrated diode prevents board damage in case of inverted leads. Tap into fused 5A-10A auxiliary interior circuit.",
    buttonLabel: "Download Lighting Installation Sheet PDF",
  },
  gps: {
    title: "Dash Port & Pass-Through Harness",
    subtitle: "High-Speed Audio/Video & Fast-Charge Interface",
    badgeText: "OEM COMPLIANT",
    badgeVariant: "emerald",
    pins: [
      { label: "Power Lead (Red):", desc: "+12V ACC Accessory Circuit (Fused 5A)", colorClass: "text-rose-600 font-bold" },
      { label: "Ground Lead (Black):", desc: "Negative Chassis Ground Tap (-)", colorClass: "text-slate-700 font-bold" },
      { label: "Port 1 (USB-C/USB-A):", desc: "45W Fast Charging & Data Pass-Through", colorClass: "text-sky-600 font-bold" },
      { label: "Port 2 (HDMI/3.5mm):", desc: "Direct A/V Feed to Head Unit / Display", colorClass: "text-amber-600 font-bold" },
    ],
    note: "Plug & Play Installation: Direct flush-mount into standard OEM rocker switch cutouts or auxiliary 12V cigarette lighter sockets.",
    buttonLabel: "Download Port Specs & Harness Guide PDF",
  },
};

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
  const hasWiringGuide = product.category === "cameras" || product.category === "security";
  const [activeTab, setActiveTab] = useState<"overview" | "specs">("overview");
  const [addedToast, setAddedToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    setActiveTab("overview");
  }, [product.id]);

  const handleAdd = () => {
    onAddToCart(product);
    if (soundEnabled) {
      playAlertBeep("click");
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleShare = async () => {
    if (soundEnabled) {
      playAlertBeep("click");
    }

    const shareData = {
      title: `${product.name} | Accele Electronics`,
      text: `Check out ${product.name} (${product.sku}) on Accele Bay Hardware: $${product.price.toFixed(2)}`,
      url: window.location.href,
    };

    let shared = false;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        shared = true;
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          return; // user cancelled the native share dialog
        }
      }
    }

    if (!shared && typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    }

    setShareToast(true);
    setTimeout(() => setShareToast(false), 2200);
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
          className={`grid h-10 w-10 place-items-center rounded-xl border active:scale-95 transition shadow-2xs ${
            shareToast 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
              : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80"
          }`}
          aria-label="Share Product"
        >
          {shareToast ? (
            <Check className="h-4 w-4 text-emerald-600 animate-in zoom-in-75 duration-200" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-5">
        {/* Top Meta info */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-sky-700 font-mono tracking-wider">
              MODEL: {product.sku}
            </span>
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h1 className="mt-1.5 text-2xl font-bold tracking-tight leading-tight text-slate-900">
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
            className="absolute left-3 top-3 text-[9px] tracking-wider font-bold shadow-xs uppercase"
          >
            {product.tag}
          </Badge>

          <Badge
            variant="emerald"
            className="absolute bottom-3 right-3 text-[9px] tracking-wider font-bold"
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

        {/* Tab Switcher - Clean 2-tab layout */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-200">
          {[
            { id: "overview", label: "Overview" },
            { id: "specs", label: "Specifications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 font-semibold"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (() => {
          const overviewInfo = getCategoryOverview(product.category);
          return (
            <div className="space-y-4 animate-in fade-in">
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

        {/* Tab 2: Specifications (Specs & Wiring Guide) */}
        {activeTab === "specs" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Engineering Specifications Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#f52538]">
                  ENGINEERING SPECIFICATIONS
                </p>
                <span className="text-[9px] font-mono text-slate-500">REV 4.2 / ISO 9001</span>
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

            {/* Vehicle Wiring & Harness Guide */}
            {hasWiringGuide && (() => {
              const wiringData = CATEGORY_WIRING_DATA[product.category] || CATEGORY_WIRING_DATA.cameras;
              return (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{wiringData.title}</h4>
                      <p className="text-xs text-slate-500 font-normal">{wiringData.subtitle}</p>
                    </div>
                    <Badge variant={wiringData.badgeVariant}>{wiringData.badgeText}</Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] space-y-1.5 border border-slate-200 text-slate-800">
                    {wiringData.pins.map((pin, i) => (
                      <div key={i} className="flex justify-between items-center gap-2">
                        <span className={`${pin.colorClass} shrink-0`}>{pin.label}</span>
                        <span className="text-right text-[10.5px] text-slate-700">{pin.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-50/60 rounded-xl text-xs text-amber-900 border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {wiringData.note}
                    </span>
                  </div>

                  <Button
                    onClick={onOpenSupport}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold"
                  >
                    <FileText className="w-3.5 h-3.5 mr-2 text-[#f52538]" /> {wiringData.buttonLabel}
                  </Button>
                </div>
              );
            })()}
          </div>
        )}
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
    </div>
  );
}
