import React from "react";
import { 
  Headphones, 
  Wrench, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  PhoneCall, 
  ChevronRight 
} from "lucide-react";

interface SupportScreenProps {
  onOpenLiveChat: () => void;
  onOpenProfile: () => void;
}

export function SupportScreen({
  onOpenLiveChat,
  onOpenProfile,
}: SupportScreenProps) {
  return (
    <div className="pb-28 bg-slate-50 min-h-full">
      {/* Hero Section */}
      <section className="px-4 pt-4">
        <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
          CERTIFIED TECHNICAL CARE
        </p>
        <h1 className="mt-2 max-w-[310px] text-3xl font-black leading-tight tracking-tight text-slate-900">
          Built for the bay.
          <br />
          Backed by experts.
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Quick access to manuals, wiring diagrams, warranty and real technician support.
        </p>

        {/* Live Tech Dispatch Card */}
        <div className="mt-5 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[9px] font-black tracking-wider text-amber-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            TECHNICIANS ONLINE IN BAY
          </div>

          <h2 className="mt-2.5 text-lg font-black text-slate-900">
            Instant technical dispatch
          </h2>

          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            In-bay troubleshooting, wire harness verification and module flashing guidance from certified technicians.
          </p>

          <button
            onClick={onOpenLiveChat}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f52538] py-3.5 text-[11px] font-black tracking-wider text-white shadow-sm hover:bg-[#ff3347] active:scale-95 transition"
          >
            <Headphones className="h-4 w-4" />
            <span>START LIVE TECH CHAT</span>
          </button>
        </div>
      </section>

      {/* 4 Feature Help Cards */}
      <section className="grid grid-cols-2 gap-3 px-4 pt-5">
        {[
          {
            icon: Wrench,
            color: "#0284c7",
            title: "Installation guides",
            copy: "Manuals, pinouts & fitment specs",
            action: onOpenLiveChat,
          },
          {
            icon: ShieldCheck,
            color: "#0284c7",
            title: "Warranty & RMA",
            copy: "Claims and rapid replacement dispatch",
            action: onOpenLiveChat,
          },
          {
            icon: UserCheck,
            color: "#d97706",
            title: "Dealer portal",
            copy: "Pricing tiers, tax certs & invoices",
            action: onOpenProfile,
          },
          {
            icon: Truck,
            color: "#0284c7",
            title: "Shipping & returns",
            copy: "Same-day bay couriers & tracking",
            action: onOpenLiveChat,
          },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-xs active:scale-[0.98] shadow-2xs"
          >
            <span style={{ color: item.color }}>
              <item.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-[13px] font-black text-slate-900">
              {item.title}
            </h3>
            <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
              {item.copy}
            </p>
            <p className="mt-3 text-[9px] font-black tracking-wider text-amber-600 flex items-center gap-1">
              <span>OPEN</span>
              <span>→</span>
            </p>
          </button>
        ))}
      </section>

      {/* Direct Contact Desk Section */}
      <section className="mx-4 mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <p className="text-[8px] font-black tracking-[0.2em] text-[#f52538] uppercase">
          DIRECT CONTACT DESK
        </p>

        <a
          href="tel:18009888089"
          className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold transition hover:bg-slate-100"
        >
          <span className="flex items-center gap-3 text-rose-600">
            <PhoneCall className="h-5 w-5" />
            <span className="text-slate-900 font-mono text-sm">1-800-988-8089</span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </a>
      </section>
    </div>
  );
}
