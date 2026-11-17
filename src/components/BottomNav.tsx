import React from "react";
import { 
  Home as HomeIcon, 
  LayoutGrid, 
  Camera, 
  Headphones 
} from "lucide-react";

export type NavTab = "Home" | "Products" | "Camera" | "Support";

interface BottomNavProps {
  active: NavTab;
  setActive: (tab: NavTab) => void;
  hasHazardAlert?: boolean;
}

export function BottomNav({
  active,
  setActive,
  hasHazardAlert = false,
}: BottomNavProps) {
  const tabs = [
    { id: "Home" as NavTab, label: "Home", icon: HomeIcon },
    { id: "Products" as NavTab, label: "Products", icon: LayoutGrid },
    { 
      id: "Camera" as NavTab, 
      label: "Camera / ADAS", 
      icon: Camera,
      alert: hasHazardAlert
    },
    { id: "Support" as NavTab, label: "Support", icon: Headphones },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid h-[74px] max-w-[430px] grid-cols-4 border-t border-slate-200 bg-white/95 px-2 backdrop-blur-xl select-none shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map(({ id, label, icon: Icon, alert }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`relative flex flex-col items-center justify-center gap-1 text-[9px] font-bold transition-all ${
              selected ? "text-[#f52538]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {/* Active Glowing Top Accent Bar */}
            {selected && (
              <span className="absolute top-0 h-[3px] w-12 rounded-full bg-[#f52538] shadow-sm" />
            )}

            <div className="relative">
              <Icon className={`h-5 w-5 transition-transform ${selected ? "scale-110" : ""}`} />
              {alert && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            <span className="tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
