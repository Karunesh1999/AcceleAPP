import React, { useState, useRef } from "react";
import { 
  Search,
  Camera, 
  Zap, 
  Cpu, 
  Radio, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Headphones, 
  ChevronRight, 
  ArrowRight,
  Flame,
  ShieldCheck
} from "lucide-react";
import acceleCar from "@/assets/accele-car.jpg";
import rvcScene from "@/assets/rvc180-scene.png";
import rvcVideo from "@/assets/rvc180-demo.mp4";
import camImg from "@/assets/products/cameras/06_RVC180FM.png";
import lightImg from "@/assets/products/lighting/04_LL3.jpg";
import actuatorImg from "@/assets/products/actuators-relays/05_6102C.jpg";
import gpsImg from "@/assets/products/gps-av/04_USB2HDMI35.jpg";
import securityImg from "@/assets/products/security/02_AS450.jpg";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { LiveRadarSimulator } from "@/components/LiveRadarSimulator";
import type { Product } from "@/types";

const CATEGORY_IMAGES: Record<string, string> = {
  cameras: camImg,
  lighting: lightImg,
  wiring: actuatorImg,
  gps: gpsImg,
  security: securityImg,
};

interface HomeScreenProps {
  onOpenProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSupport: () => void;
  onOpenSearch?: () => void;
  soundEnabled: boolean;
}

export function HomeScreen({
  onOpenProduct,
  onSelectCategory,
  onOpenSupport,
  onOpenSearch,
  soundEnabled,
}: HomeScreenProps) {
  const flagshipProduct = 
    PRODUCTS.find((p) => p.sku.toLowerCase().includes("rvc180")) || 
    PRODUCTS.find((p) => p.category === "cameras") || 
    PRODUCTS[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case "Camera": return <Camera className="h-6 w-6" />;
      case "Zap": return <Zap className="h-6 w-6" />;
      case "Cpu": return <Cpu className="h-6 w-6" />;
      case "ShieldCheck": return <ShieldCheck className="h-6 w-6" />;
      default: return <Radio className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-4 pb-28 bg-slate-50">
      {/* Search Bar Section (Above Hero Banner) */}
      <section className="px-4 pt-3">
        <div
          onClick={onOpenSearch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onOpenSearch?.();
            }
          }}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-slate-800 shadow-2xs hover:border-[#f52538]/50 hover:shadow-xs active:scale-[0.99] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="h-4 w-4 text-[#f52538] shrink-0" />
            <span className="text-xs text-slate-400 font-medium truncate">
              Search by model, SKU, or hardware...
            </span>
          </div>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600 uppercase tracking-wider shrink-0 group-hover:bg-[#f52538] group-hover:text-white transition">
            Search
          </span>
        </div>
      </section>

      {/* Hero Banner Section */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-slate-950 shadow-md">
          <img
            src={acceleCar}
            alt="Accele automotive technology"
            className="h-[225px] w-full object-cover object-center brightness-[0.82] contrast-[1.12]"
          />
          {/* Dark cinematic shade on left to tame harsh sun glare */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
          {/* Smooth bottom vignette for crisp text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Minimalist & Concise Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              Drive Smarter. <span className="text-[#f52538]">See Everything.</span>
            </h1>
            <p className="mt-1 text-[11px] text-slate-300 font-medium">
              Pro-grade safety, lighting & vehicle control systems.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware Ecosystem / Categories */}
      <section className="px-4">
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
              HARDWARE ECOSYSTEM
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
              Shop by system
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory("all")}
            className="text-[10px] font-bold text-[#f52538] hover:underline"
          >
            VIEW ALL
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const isCameras = cat.id === "cameras";
            const img = CATEGORY_IMAGES[cat.id];

            if (isCameras) {
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="col-span-2 group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200 hover:border-slate-300 hover:shadow-md active:scale-[0.99] shadow-2xs flex items-center justify-between p-4"
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-[#f52538] border border-rose-200/80">
                        {getCategoryIcon(cat.icon)}
                      </span>
                      <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[8px] font-bold tracking-wider text-[#f52538] uppercase">
                        FLAGSHIP SYSTEM
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                      Radar vector cameras, blind-spot ADAS & reverse sensors
                    </p>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[#f52538] flex items-center gap-1">
                      <span>{cat.count} AVAILABLE</span>
                      <ChevronRight className="h-3 w-3" />
                    </p>
                  </div>
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100/80 p-2.5 flex items-center justify-center border border-slate-200/70">
                    <img
                      src={img}
                      alt={cat.title}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200 hover:border-slate-300 hover:shadow-md active:scale-[0.98] shadow-2xs flex flex-col justify-between"
              >
                {/* Upper 4K Studio Image Showcase */}
                <div className="relative h-28 w-full overflow-hidden bg-slate-100/80 p-3 flex items-center justify-center border-b border-slate-200">
                  <img
                    src={img}
                    alt={cat.title}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Icon Badge */}
                  <span
                    style={{ color: cat.color }}
                    className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg bg-white/95 border border-slate-200/80 shadow-2xs backdrop-blur-xs"
                  >
                    {getCategoryIcon(cat.icon)}
                  </span>
                  {/* Count Badge */}
                  <span className="absolute bottom-2 right-2 rounded-full bg-white/90 border border-slate-200/80 px-2 py-0.5 text-[7px] font-bold tracking-wider text-slate-600 shadow-2xs">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Info Section */}
                <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                  <h3 className="text-[13px] font-bold text-slate-900 leading-tight line-clamp-1">
                    {cat.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-semibold text-slate-500">
                    <span>Explore</span>
                    <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-[#f52538] transition" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ADAS Spotlight Section */}
      <section className="px-4">
        {/* Minimal Header */}
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f52538] animate-pulse" />
            <h2 className="text-xs font-black tracking-wider text-slate-900 uppercase">
              ADAS Radar Spotlight
            </h2>
          </div>
          <span className="rounded-full bg-rose-50 border border-rose-200/80 px-2 py-0.5 text-[8.5px] font-black text-[#f52538] flex items-center gap-1 uppercase tracking-wider">
            <Flame className="w-2.5 h-2.5" /> Flagship
          </span>
        </div>

        <article
          onClick={() => onOpenProduct(flagshipProduct)}
          className="cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.99] shadow-sm"
        >
          {/* Spotlight Video with Live HUD overlay */}
          <div className="relative h-60 overflow-hidden bg-slate-950 group">
            <video
              ref={videoRef}
              src={rvcVideo}
              poster={rvcScene}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="h-full w-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-[#f52538] px-2.5 py-1 text-[8px] font-black tracking-wider text-white shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE RADAR DEMO
              </span>
            </div>

            {/* Video Controls (Mute / Play-Pause) */}
            <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
              <button
                type="button"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-md shadow-md active:scale-90 transition hover:bg-black/80"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#f52538]" />}
              </button>

              <button
                type="button"
                aria-label={isPlaying ? "Pause video" : "Play video"}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-md shadow-md active:scale-90 transition hover:bg-black/80"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Minimal Content Bar - lets the video be the hero focus */}
          <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-sky-600">
                <Radio className="h-3 w-3 shrink-0" />
                <span className="tracking-wide">180° ACTIVE RADAR</span>
              </div>
              <h3 className="mt-0.5 text-xs font-black text-slate-900 truncate">
                Moving Object Recognition Camera
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenProduct(flagshipProduct);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#f52538] px-3.5 py-2 text-[10px] font-black tracking-wider text-white shadow-xs hover:bg-[#ff3347] active:scale-95 transition shrink-0"
            >
              <span>EXPLORE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </article>
      </section>

      {/* Embedded Live Radar HUD Interactive Tester */}
      <section className="px-4">
        <LiveRadarSimulator
          soundEnabled={soundEnabled}
          onExploreProduct={() => onOpenProduct(flagshipProduct)}
        />
      </section>

      {/* Direct Installer Support Card */}
      <section className="px-4">
        <button
          onClick={onOpenSupport}
          className="w-full flex items-center gap-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-left transition hover:bg-sky-50 active:scale-[0.99] shadow-2xs"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
            <Headphones className="h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black text-slate-900">
              Direct installer support
            </p>
            <p className="mt-0.5 text-[11px] text-slate-600">
              Talk to a certified master technician in the bay
            </p>
          </div>

          <ChevronRight className="h-5 w-5 text-slate-500 shrink-0" />
        </button>
      </section>
    </div>
  );
}
