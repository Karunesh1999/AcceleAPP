import React, { useState, useRef, useEffect, useMemo } from "react";
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
  ShieldCheck,
  Maximize2,
  FileText,
  X,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from "lucide-react";
import acceleCar from "@/assets/accele-car.jpg";
import rvcScene from "@/assets/rvc180-scene.png";
import rvcVideo from "@/assets/rvc180-demo.mp4";
import camImg from "@/assets/products/cameras/06_RVC180FM.png";
import lightImg from "@/assets/products/lighting/04_LL3.jpg";
import actuatorImg from "@/assets/products/actuators-relays/05_6102C.jpg";
import gpsImg from "@/assets/products/gps-av/04_USB2HDMI35.jpg";
import securityImg from "@/assets/products/security/02_AS450.jpg";

// Official Partner & Internal Brands from accele.com
import brandAcceleVision from "@/assets/brands/accelevision.png";
import brandBeuler from "@/assets/brands/beuler.png";
import brandOptix from "@/assets/brands/optix.png";
import brandLittworks from "@/assets/brands/littworks.png";
import brandUsaPro from "@/assets/brands/usapro.png";
import brandQpHardware from "@/assets/brands/qphardware.png";
import brandAccentMobile from "@/assets/brands/accentmobile.png";
import brandAcceleCustom from "@/assets/brands/accelecustom.png";
import brandZicom from "@/assets/brands/zicom.png";

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

const PARTNER_BRANDS = [
  {
    id: "optix",
    name: "Optix 360",
    logo: brandOptix,
    tagline: "360° Camera & Optical Sensors",
    category: "cameras",
  },
  {
    id: "littworks",
    name: "LittWorks",
    logo: brandLittworks,
    tagline: "Accent & Bay LED Illumination",
    category: "lighting",
  },
  {
    id: "beuler",
    name: "Beüler®",
    logo: brandBeuler,
    tagline: "Heavy-Duty Relays & Sockets",
    category: "wiring",
  },
  {
    id: "accentmobile",
    name: "Accent Mobile",
    logo: brandAccentMobile,
    tagline: "In-Cab Power & USB Charging",
    category: "gps",
  },
  {
    id: "qphardware",
    name: "QP Hardware",
    logo: brandQpHardware,
    tagline: "Micro Switches & Bay Hardware",
    category: "wiring",
  },
  {
    id: "usapro",
    name: "USAPRO Security",
    logo: brandUsaPro,
    tagline: "Commercial Fleet Security",
    category: "security",
  },
  {
    id: "accelecustom",
    name: "Accele Custom",
    logo: brandAcceleCustom,
    tagline: "Custom OEM Integration & Wiring",
    category: "wiring",
  },
  {
    id: "zicom",
    name: "Zicom",
    logo: brandZicom,
    tagline: "Telematics & Alarm Systems",
    category: "security",
  },
  {
    id: "accelevision",
    name: "AcceleVision",
    logo: brandAcceleVision,
    tagline: "High-Resolution LCD Video HUDs",
    category: "cameras",
  },
];

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

  // Full Screen Video Player State
  const [isFullscreenVideo, setIsFullscreenVideo] = useState(false);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const [fsIsPlaying, setFsIsPlaying] = useState(true);
  const [fsIsMuted, setFsIsMuted] = useState(false);
  const [fsProgress, setFsProgress] = useState(0);
  const [fsDuration, setFsDuration] = useState(0);
  const [fsCurrentTime, setFsCurrentTime] = useState(0);

  // Search & Filter Dropdown State (Replaces Dialog Box)
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Filtered & Sorted Hardware Products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (priceSort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCategory, priceSort]);

  const handleOpenFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsFullscreenVideo(true);
    setFsIsPlaying(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreenVideo(false);
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.pause();
    }
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleFsPlay = () => {
    if (!fullscreenVideoRef.current) return;
    if (fsIsPlaying) {
      fullscreenVideoRef.current.pause();
      setFsIsPlaying(false);
    } else {
      fullscreenVideoRef.current.play();
      setFsIsPlaying(true);
    }
  };

  const toggleFsMute = () => {
    if (!fullscreenVideoRef.current) return;
    fullscreenVideoRef.current.muted = !fsIsMuted;
    setFsIsMuted(!fsIsMuted);
  };

  const handleFsTimeUpdate = () => {
    if (!fullscreenVideoRef.current) return;
    const current = fullscreenVideoRef.current.currentTime;
    const dur = fullscreenVideoRef.current.duration || 1;
    setFsCurrentTime(current);
    setFsDuration(dur);
    setFsProgress((current / dur) * 100);
  };

  const handleFsSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fullscreenVideoRef.current || !fsDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    fullscreenVideoRef.current.currentTime = pos * fsDuration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      {/* Search Bar & Dropdown Filter Section (Replaces Dialog Box) */}
      <section className="px-4 pt-3 relative z-40" ref={searchContainerRef}>
        <div
          className={`flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 text-slate-800 shadow-2xs transition-all ${
            isDropdownOpen
              ? "border-[#f52538] ring-2 ring-rose-500/10 shadow-md"
              : "border-slate-200/90 hover:border-slate-300"
          }`}
        >
          {/* Search / Filter Icon Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            title="Toggle filter & search dropdown"
            aria-label="Toggle filter and sort dropdown"
            className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50 text-[#f52538] hover:bg-rose-100 active:scale-95 transition shrink-0 cursor-pointer"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
          </button>

          {/* Live Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!isDropdownOpen) setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search by model, SKU, or hardware..."
            className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 font-medium outline-none"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1 shrink-0 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Filter / Sort Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${
              isDropdownOpen || selectedCategory !== "all" || priceSort !== "none"
                ? "bg-[#f52538] text-white shadow-xs shadow-rose-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filter</span>
            {(selectedCategory !== "all" || priceSort !== "none") && (
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>

        {/* Dropdown Menu (Inline dropdown instead of dialog box) */}
        {isDropdownOpen && (
          <div className="absolute left-4 right-4 top-full mt-2 z-50 rounded-2xl border border-slate-200/90 bg-white/98 backdrop-blur-md p-4 shadow-xl max-h-[460px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Dropdown Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Sort & Filter
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-mono font-semibold text-slate-600">
                  {filteredProducts.length} items
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(selectedCategory !== "all" || priceSort !== "none" || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceSort("none");
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-1 text-[10.5px] font-semibold text-[#f52538] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto no-scrollbar py-2 space-y-3.5 flex-1">
              {/* Price Sort Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sort by Price
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPriceSort("none")}
                    className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border cursor-pointer ${
                      priceSort === "none"
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceSort("asc")}
                    className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border flex items-center justify-center gap-1 cursor-pointer ${
                      priceSort === "asc"
                        ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowUp className="h-3 w-3" /> Low to High
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceSort("desc")}
                    className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border flex items-center justify-center gap-1 cursor-pointer ${
                      priceSort === "desc"
                        ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowDown className="h-3 w-3" /> High to Low
                  </button>
                </div>
              </div>

              {/* Category Filter Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Filter by Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition border cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition border cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matching Hardware Results */}
              <div className="border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Hardware Products ({filteredProducts.length})</span>
                  <span>Price</span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      <p className="font-semibold text-slate-600">No hardware found</p>
                      <p className="text-[11px] mt-0.5">Try clearing or changing your filters</p>
                    </div>
                  ) : (
                    filteredProducts.slice(0, 20).map((prod) => (
                      <div
                        key={prod.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          onOpenProduct(prod);
                          setIsDropdownOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            onOpenProduct(prod);
                            setIsDropdownOpen(false);
                          }
                        }}
                        className="group flex items-center justify-between gap-3 py-2 px-1 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-9 w-9 rounded-lg object-contain bg-slate-50 border border-slate-200/60 p-0.5 shrink-0"
                            />
                          ) : (
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-400 text-xs font-bold shrink-0">
                              12V
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#f52538] transition">
                              {prod.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                              <span className="font-semibold text-slate-600">{prod.sku}</span>
                              <span>•</span>
                              <span className="capitalize">{prod.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            ${prod.price.toFixed(2)}
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-slate-300 ml-auto group-hover:text-[#f52538] transition" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
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
            <p className="text-[10px] font-bold tracking-wider text-[#f52538] uppercase">
              HARDWARE ECOSYSTEM
            </p>
            <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
              Shop by system
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs font-bold text-[#f52538] hover:underline tracking-wide"
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
                      <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-[#f52538] uppercase">
                        FLAGSHIP SYSTEM
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1 font-medium">
                      Radar vector cameras, blind-spot ADAS & reverse sensors
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#f52538] flex items-center gap-1">
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
                  <span className="absolute bottom-2 right-2 rounded-full bg-white/90 border border-slate-200/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-600 shadow-2xs">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Info Section */}
                <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                    {cat.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-500">
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
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              ADAS Radar Spotlight
            </h2>
          </div>
          <span className="rounded-full bg-rose-50 border border-rose-200/80 px-2 py-0.5 text-[9.5px] font-bold text-[#f52538] flex items-center gap-1 uppercase tracking-wider">
            <Flame className="w-2.5 h-2.5" /> Flagship
          </span>
        </div>

        <article
          onClick={handleOpenFullscreen}
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
              <span className="flex items-center gap-1.5 rounded-md bg-[#f52538] px-2.5 py-1 text-[9.5px] font-bold tracking-wider text-white shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE RADAR DEMO
              </span>
            </div>

            {/* Video Controls (Mute / Play-Pause / Full Screen) */}
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

              <button
                type="button"
                aria-label="Full screen video"
                onClick={handleOpenFullscreen}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-md shadow-md active:scale-90 transition hover:bg-black/80"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Minimal Content Bar - lets the video be the hero focus */}
          <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-600">
                <Radio className="h-3 w-3 shrink-0" />
                <span className="tracking-wide">180° ACTIVE RADAR</span>
              </div>
              <h3 className="mt-0.5 text-xs font-bold text-slate-900 truncate">
                Moving Object Recognition Camera
              </h3>
            </div>

            <button
              onClick={handleOpenFullscreen}
              aria-label="Play video full screen"
              className="flex items-center gap-1.5 rounded-xl bg-[#f52538] px-3.5 py-2 text-xs font-bold tracking-wider text-white shadow-xs hover:bg-[#ff3347] active:scale-95 transition shrink-0 cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>FULL SCREEN</span>
            </button>
          </div>
        </article>
      </section>

      {/* Brand Portfolio Showcase (3-Column High-Contrast Showcase) */}
      <section className="space-y-2.5 px-4 py-1">
        <div className="flex items-center gap-2 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f52538]" />
          <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
            My Brands
          </h2>
        </div>

        {/* Soft Contrasting Showcase Container with Elevated White Tiles */}
        <div className="rounded-3xl bg-slate-100/90 border border-slate-200/90 p-3 shadow-2xs">
          <div className="grid grid-cols-3 gap-2.5 select-none pointer-events-none">
            {PARTNER_BRANDS.map((brand) => {
              const isWide = [
                "littworks",
                "accentmobile",
                "usapro",
                "accelecustom",
                "accelevision",
              ].includes(brand.id);

              return (
                <div
                  key={brand.id}
                  className="flex items-center justify-center h-20 rounded-2xl bg-white border border-slate-200/90 p-3 shadow-2xs"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className={`max-h-11 max-w-[90%] object-contain filter contrast-125 select-none ${
                      isWide ? "scale-125" : "scale-100"
                    }`}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Embedded Live Radar HUD Interactive Tester */}
      <section className="px-4">
        <LiveRadarSimulator
          soundEnabled={soundEnabled}
          onExploreProduct={() => onOpenProduct(flagshipProduct)}
        />
      </section>

      {/* Why This Platform Section (Direct Clean Cards, No Outer Card Wrapper) */}
      <section className="px-4 space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f52538]" />
          <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
            Why Accele Platform
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* 1. Verified Schematics */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3.5 shadow-2xs hover:border-slate-300 transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-[#f52538] border border-rose-200/90 shadow-xs shadow-rose-500/10 shrink-0">
              <FileText className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Bay Schematics
              </h4>
              <p className="text-[11.5px] leading-snug text-slate-500 mt-0.5">
                ISO 9001 certified harness pinouts & official PDF bay guides
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </div>

          {/* 2. Tier 1 Wholesale */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3.5 shadow-2xs hover:border-slate-300 transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/90 shadow-xs shadow-amber-500/10 shrink-0">
              <Zap className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Net 30 Wholesale
              </h4>
              <p className="text-[11.5px] leading-snug text-slate-500 mt-0.5">
                Dealer Tier 1 pricing & automated PDF invoice receipts
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </div>

          {/* 3. ADAS Telemetry */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3.5 shadow-2xs hover:border-slate-300 transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/90 shadow-xs shadow-sky-500/10 shrink-0">
              <Cpu className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                ADAS Telemetry
              </h4>
              <p className="text-[11.5px] leading-snug text-slate-500 mt-0.5">
                180° Doppler radar testing & real-time hazard detection HUD
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </div>

          {/* 4. Rapid Bay Warranty */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center gap-3.5 shadow-2xs hover:border-slate-300 transition">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/90 shadow-xs shadow-emerald-500/10 shrink-0">
              <ShieldCheck className="h-6 w-6 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                3-Yr Bay Warranty
              </h4>
              <p className="text-[11.5px] leading-snug text-slate-500 mt-0.5">
                Commercial hardware with advance replacement guarantee
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </section>

      {/* Full Screen Cinematic Video Player Overlay */}
      {isFullscreenVideo && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none animate-in fade-in duration-200">
          {/* Top Bar with Close & Mute */}
          <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-3 bg-gradient-to-b from-black/95 via-black/60 to-transparent">
            <button
              onClick={handleCloseFullscreen}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition shrink-0"
              aria-label="Close full screen video"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              onClick={toggleFsMute}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition shrink-0"
              aria-label={fsIsMuted ? "Unmute audio" : "Mute audio"}
            >
              {fsIsMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-[#f52538]" />}
            </button>
          </div>

          {/* Video Display (Tap to Play/Pause) */}
          <div 
            onClick={toggleFsPlay}
            className="flex-1 relative flex items-center justify-center overflow-hidden cursor-pointer bg-black"
          >
            <video
              ref={fullscreenVideoRef}
              src={rvcVideo}
              poster={rvcScene}
              autoPlay
              muted={fsIsMuted}
              loop
              playsInline
              onTimeUpdate={handleFsTimeUpdate}
              className="w-full h-full object-contain"
            />

            {/* Quick Play/Pause Center Indicator on Pause */}
            {!fsIsPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs pointer-events-none">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#f52538] text-white shadow-xl animate-in zoom-in-75">
                  <Play className="h-7 w-7 fill-white ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Player Controls & Seek Bar */}
          <div className="relative z-20 px-4 pb-6 pt-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-3">
            {/* Scrubber Progress Bar */}
            <div 
              onClick={handleFsSeek}
              className="group relative h-2 w-full rounded-full bg-white/20 cursor-pointer overflow-hidden"
            >
              <div
                style={{ width: `${fsProgress}%` }}
                className="h-full bg-[#f52538] transition-all duration-100 relative"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFsPlay}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-900 active:scale-90 transition hover:bg-slate-200"
                  aria-label={fsIsPlaying ? "Pause" : "Play"}
                >
                  {fsIsPlaying ? <Pause className="h-4 w-4 fill-slate-900" /> : <Play className="h-4 w-4 fill-slate-900 ml-0.5" />}
                </button>

                <div className="text-xs font-mono text-slate-300 font-medium">
                  <span>{formatTime(fsCurrentTime)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="text-slate-400">{formatTime(fsDuration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
