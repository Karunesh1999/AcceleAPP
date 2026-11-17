import React, { useState } from "react";
import { ArrowRight, Radio, Cpu, ShieldCheck } from "lucide-react";
import { ONBOARDING_SLIDES } from "@/data/mockData";
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
    if (iconName === "radar") return <Radio className="h-5 w-5 text-sky-400" />;
    if (iconName === "wiring") return <Cpu className="h-5 w-5 text-[#ff3347]" />;
    return <ShieldCheck className="h-5 w-5 text-amber-400" />;
  };

  return (
    <main className="relative mx-auto flex h-full min-h-screen w-full max-w-[430px] flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* 100% Full Screen Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        key={slide.id}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 animate-in fade-in"
      />

      {/* Multi-stage Gradient Scrim for crisp text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 via-55% to-black/30 pointer-events-none" />

      {/* Top Header bar with Skip */}
      <div className="relative z-20 flex items-center justify-end px-6 pt-6">
        <button
          onClick={onComplete}
          className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-md hover:bg-black/60 transition active:scale-95 shadow-sm"
        >
          SKIP
        </button>
      </div>

      {/* Bottom Content Area: Feature Badge + Typography + Bottom Controls */}
      <div className="relative z-20 flex flex-col px-6 pb-8 pt-4">
        {/* Floating Feature Capsule */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md shadow-xs">
            {getSlideIcon(slide.icon)}
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-3 py-1.5 shadow-xs">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200">
              {slide.metric}
            </span>
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-[10px] font-black tracking-[0.25em] text-[#ff3347] uppercase">
          {slide.eyebrow}
        </p>

        {/* Headline */}
        <h2 className="mt-1.5 text-[30px] font-black leading-[1.12] tracking-[-0.03em] text-white">
          {slide.title.replace(slide.highlightWord, "")}
          <span className="text-[#ff3347]">
            {slide.highlightWord}
          </span>
        </h2>

        {/* Description */}
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300 max-w-[340px]">
          {slide.text}
        </p>

        {/* Bottom Navigation Indicators & Next Button */}
        <div className="flex items-center justify-between pt-7">
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {ONBOARDING_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? "w-8 bg-[#ff3347] shadow-xs"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="flex h-12 items-center gap-2.5 rounded-2xl bg-[#ff3347] px-6 text-xs font-black tracking-wider text-white shadow-lg shadow-red-950/50 active:scale-95 transition hover:bg-[#ff4d5e]"
          >
            <span>{currentPage === ONBOARDING_SLIDES.length - 1 ? "ENTER APP" : "NEXT"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
