import React from "react";
import { User } from "lucide-react";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenProfile: () => void;
  onOpenSearch?: () => void;
}

export function Header({
  onOpenProfile,
}: HeaderProps) {
  return (
    <>
      <header className="flex items-center justify-between px-5 pb-3 pt-3 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <Logo compact />

        <div className="flex items-center gap-2">
          {/* Profile Trigger */}
          <button
            onClick={onOpenProfile}
            aria-label="Dealer Profile"
            className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-[#f52538] border border-rose-200 hover:bg-rose-100 active:scale-95 transition shadow-2xs font-black text-xs"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
}
