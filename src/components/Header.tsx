import React from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onOpenSearch: () => void;
}

export function Header({
  cartCount,
  onOpenCart,
  onOpenProfile,
  onOpenSearch,
}: HeaderProps) {
  return (
    <>
      <header className="flex items-center justify-between px-5 pb-3 pt-3 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <Logo compact />

        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Catalog"
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition shadow-2xs"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="Cart manifest"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition shadow-2xs"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-[#f52538] text-[9px] font-black text-white grid place-items-center shadow-xs animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

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

      {/* Live Telemetry Status Ticker */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/90 px-5 py-2 text-[8px] font-bold tracking-wider select-none text-slate-600">
        <span className="flex items-center gap-2 text-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          LIVE TELEMETRY: ACTIVE
        </span>
        <span className="text-slate-500 font-mono">ISO 9001:2015 CERTIFIED</span>
      </div>
    </>
  );
}
