import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ONBOARDING_SLIDES } from "@/data/mockData";
import { playAlertBeep } from "@/lib/utils";

interface OnboardingScreenProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

const SLIDE_SHORT_TEXTS: Record<number, string> = {
  1: "180° active radar & camera coverage.",
  2: "Vehicle wiring guides & bay-ready hardware.",
};

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

  const isLast = currentPage === ONBOARDING_SLIDES.length - 1;

  return (
    <main className="relative mx-auto flex h-[100dvh] max-h-[100dvh] w-full max-w-[430px] flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* 100% Full Screen Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        key={slide.id}
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 animate-in fade-in"
      />

      {/* Delicate Gradient Scrim to showcase bright 4K imagery while keeping bottom text crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 via-35% to-transparent pointer-events-none" />

      {/* Top Header bar with Skip - respects mobile safe-area */}
      <div className="relative z-20 flex items-center justify-end px-6 pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.5rem))]">
        <button
          onClick={onComplete}
          className="rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-[11px] font-bold tracking-wider text-white backdrop-blur-md hover:bg-black/60 transition active:scale-95 shadow-sm"
        >
          SKIP
        </button>
      </div>

      {/* Bottom Content Area: Minimalist, Clean & 100% Mobile Safe */}
      <div className="relative z-20 flex flex-col px-6 pb-[max(2.25rem,calc(env(safe-area-inset-bottom)+1.5rem))] pt-2">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          {slide.title.replace(slide.highlightWord, "")}
          <span className="text-[#f52538]">
            {slide.highlightWord}
          </span>
        </h1>

        {/* Minimal 1-line Subtitle */}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          {SLIDE_SHORT_TEXTS[slide.id] || slide.text}
        </p>

        {/* Bottom Navigation Indicators & Bigger Action Button */}
        <div className="flex items-center justify-between pt-5 sm:pt-7">
          {/* Progress Indicators */}
          <div className="flex gap-2 items-center">
            {ONBOARDING_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? "w-8 bg-[#f52538] shadow-xs"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Button - Fully visible above mobile nav bar */}
          <button
            onClick={handleNext}
            className="flex h-12 min-w-[128px] items-center justify-center gap-2 rounded-2xl bg-[#f52538] px-6 text-xs sm:text-sm font-bold tracking-wide text-white shadow-xl shadow-red-950/50 active:scale-95 transition hover:bg-[#ff3347]"
          >
            <span>{isLast ? "GET STARTED" : "NEXT"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
