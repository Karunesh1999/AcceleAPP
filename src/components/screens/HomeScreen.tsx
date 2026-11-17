import React from "react";
import { 
  Camera, 
  Zap, 
  Cpu, 
  Radio, 
  Play, 
  Headphones, 
  ChevronRight, 
  ArrowRight,
  Flame
} from "lucide-react";
import nightDrive from "@/assets/night-drive.jpg";
import rvcScene from "@/assets/rvc180-scene.png";
import { CATEGORIES, PRODUCTS } from "@/data/mockData";
import { LiveRadarSimulator } from "@/components/LiveRadarSimulator";
import type { Product } from "@/types";

interface HomeScreenProps {
  onOpenProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSupport: () => void;
  soundEnabled: boolean;
}

export function HomeScreen({
  onOpenProduct,
  onSelectCategory,
  onOpenSupport,
  soundEnabled,
}: HomeScreenProps) {
  const flagshipProduct = PRODUCTS[0];

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case "Camera": return <Camera className="h-6 w-6" />;
      case "Zap": return <Zap className="h-6 w-6" />;
      case "Cpu": return <Cpu className="h-6 w-6" />;
      default: return <Radio className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 bg-slate-50">
      {/* Hero Banner Section */}
      <section className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-slate-900 shadow-md">
          <img
            src={nightDrive}
            alt="Driver using automotive safety technology at night"
            className="h-[240px] w-full object-cover opacity-85"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

          {/* Top Pill */}
          <div className="absolute left-5 top-5 rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-[8px] font-black tracking-[0.18em] text-white backdrop-blur-md">
            EST. 1993 · PRO SERIES
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-[10px] font-black tracking-[0.2em] text-sky-400 uppercase">
              AUTOMOTIVE INTELLIGENCE
            </p>
            <h1 className="mt-1 text-[30px] font-black leading-[1.02] tracking-[-0.04em] text-white">
              Drive smarter.
              <br />
              <span className="text-[#f52538]">See everything.</span>
            </h1>
            <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-slate-200">
              Pro-grade safety, lighting and control systems engineered for every install.
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
            <h2 className="mt-0.5 text-lg font-extrabold text-slate-900">
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

        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm active:scale-[0.98] shadow-2xs"
            >
              <div style={{ color: cat.color }} className="mb-3.5 transition-transform group-hover:scale-105">
                {getCategoryIcon(cat.icon)}
              </div>
              <p className="text-[13px] font-black leading-tight text-slate-900">
                {cat.title}
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                {cat.count}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ADAS Spotlight Section */}
      <section className="px-4">
        <div className="mb-3.5 flex items-end justify-between">
          <div>
            <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
              ADAS SPOTLIGHT
            </p>
            <h2 className="mt-0.5 text-lg font-extrabold text-slate-900">
              Safety, reimagined
            </h2>
          </div>
          <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-[8px] font-black text-[#f52538] flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" /> FLAGSHIP
          </span>
        </div>

        <article
          onClick={() => onOpenProduct(flagshipProduct)}
          className="cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.99] shadow-sm"
        >
          {/* Spotlight Image with Live HUD overlay */}
          <div className="relative h-52 overflow-hidden bg-slate-950">
            <img
              src={rvcScene}
              alt="RVC180CTD moving object recognition camera view"
              className="h-full w-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute left-4 top-4 rounded-md bg-[#f52538] px-2.5 py-1 text-[8px] font-black tracking-wider text-white shadow-sm">
              MOVING OBJECT DETECTED
            </div>

            <button
              aria-label="Play product video"
              className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-md shadow-md active:scale-90 transition"
            >
              <Play className="h-5 w-5 fill-white ml-0.5" />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 text-[9px] font-bold text-sky-600">
              <Radio className="h-3.5 w-3.5" />
              <span>180° ACTIVE RADAR COVERAGE</span>
            </div>

            <h3 className="mt-1.5 text-xl font-black leading-tight text-slate-900">
              Moving Object Recognition Camera
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Wide-angle vision with visual and audible alerts before a hazard enters your vehicle’s path.
            </p>

            <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#f52538] px-4 py-3.5 text-[11px] font-black tracking-wider text-white shadow-sm hover:bg-[#ff3347] transition">
              <span>EXPLORE RVC180CTD</span>
              <ArrowRight className="h-4 w-4" />
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
