import React, { useState } from "react";
import { ArrowRight, Radio, Cpu, ShieldCheck } from "lucide-react";
import { ONBOARDING_SLIDES } from "@/data/mockData";
import { Logo } from "@/components/Logo";
import { playAlertBeep } from "@/lib/utils";

interface OnboardingScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

export function OnboardingScreen({
  onComplete,
  soundEnabled,
}: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const slide = ONBOARDING_SLIDES[currentPage];

  const handleNext = () => {
    if (soundEnabled) {
      playAlertBeep("click");
    }
    if (currentPage === ONBOARDING_SLIDES.length - 1) {
      onComplete();
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getSlideIcon = (iconName: string) => {
    if (iconName === "radar") return <Radio className="h-6 w-6 text-sky-600" />;
    if (iconName === "wiring") return <Cpu className="h-6 w-6 text-[#f52538]" />;
    return <ShieldCheck className="h-6 w-6 text-amber-600" />;
  };

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-slate-50 text-slate-900">
      {/* Top Image Showcase */}
      <div className="relative h-[48dvh] min-h-[360px] overflow-hidden bg-slate-100 select-none border-b border-slate-200">
        <img
          src={slide.image}
          alt={slide.title}
          key={slide.id}
          className={`h-full w-full ${
            slide.id === 3 ? "object-contain p-8" : "object-cover"
          } transition-all duration-700 animate-in fade-in`}
        />

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-900/40" />

        {/* Top Header bar with Logo & Skip */}
        <div className="absolute left-6 right-6 top-6 flex items-center justify-between z-20">
          <div className="bg-white/90 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-xs border border-white/60">
            <Logo compact />
          </div>
          <button
            onClick={onComplete}
            className="rounded-full border border-white/40 bg-white/80 px-4 py-1.5 text-[11px] font-extrabold text-slate-800 backdrop-blur-md hover:bg-white transition active:scale-95 shadow-xs"
          >
            SKIP
          </button>
        </div>

        {/* Bottom Floating Feature Capsule */}
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/80 bg-white/95 backdrop-blur-md shadow-md">
            {getSlideIcon(slide.icon)}
          </div>
          <div className="rounded-xl border border-white/60 bg-white/90 backdrop-blur px-3 py-1.5 shadow-xs">
            <span className="text-[9px] font-mono font-bold text-slate-800">
              {slide.metric}
            </span>
          </div>
        </div>
      </div>

      {/* Slide Typography & Information */}
      <div className="flex flex-1 flex-col px-6 pb-8 pt-5 justify-between bg-slate-50">
        <div>
          <p className="text-[10px] font-black tracking-[0.25em] text-[#f52538] uppercase">
            {slide.eyebrow}
          </p>

          <h2 className="mt-2 text-[32px] font-black leading-[1.08] tracking-[-0.04em] text-slate-900">
            {slide.title.replace(slide.highlightWord, "")}
            <span className="text-[#f52538]">
              {slide.highlightWord}
            </span>
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-slate-600 max-w-[340px]">
            {slide.text}
          </p>
        </div>

        {/* Bottom Navigation Indicators & Next Button */}
        <div className="flex items-center justify-between pt-6">
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {ONBOARDING_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? "w-8 bg-[#f52538] shadow-xs"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="flex h-12 items-center gap-2.5 rounded-2xl bg-[#f52538] px-6 text-xs font-black tracking-wider text-white shadow-md active:scale-95 transition hover:bg-[#ff3347]"
          >
            <span>{currentPage === ONBOARDING_SLIDES.length - 1 ? "ENTER APP" : "NEXT"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
