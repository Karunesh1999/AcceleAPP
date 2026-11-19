import React from "react";
import { 
  Home as HomeIcon, 
  LayoutGrid, 
  ClipboardList, 
  ShoppingBag,
  User 
} from "lucide-react";

export type NavTab = "Home" | "Products" | "Bookings" | "Cart" | "Profile";

interface BottomNavProps {
  active: NavTab;
  setActive: (tab: NavTab) => void;
  activeOrderCount?: number;
  cartCount?: number;
  isCartOpen?: boolean;
  onOpenCart?: () => void;
}

export function BottomNav({
  active,
  setActive,
  activeOrderCount = 2,
  cartCount = 0,
  isCartOpen = false,
  onOpenCart,
}: BottomNavProps) {
  const tabs = [
    { id: "Home" as NavTab, label: "Home", icon: HomeIcon },
    { id: "Products" as NavTab, label: "Products", icon: LayoutGrid },
    { 
      id: "Bookings" as NavTab, 
      label: "Bookings", 
      icon: ClipboardList,
      badge: activeOrderCount > 0 ? activeOrderCount : undefined,
    },
    { 
      id: "Cart" as NavTab, 
      label: "Cart", 
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { id: "Profile" as NavTab, label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid h-[74px] max-w-[430px] grid-cols-5 border-t border-slate-200 bg-white/95 px-2 backdrop-blur-xl select-none shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {tabs.map(({ id, label, icon: Icon, badge }) => {
        const selected = id === "Cart" ? isCartOpen : active === id && !isCartOpen;
        return (
          <button
            key={id}
            onClick={() => {
              if (id === "Cart") {
                onOpenCart?.();
              } else {
                setActive(id);
              }
            }}
            className={`relative flex flex-col items-center justify-center gap-1 text-[9px] font-bold transition-all ${
              selected ? "text-[#f52538]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {/* Active Glowing Top Accent Bar */}
            {selected && (
              <span className="absolute top-0 h-[3px] w-10 rounded-full bg-[#f52538] shadow-sm" />
            )}

            <div className="relative">
              <Icon className={`h-5 w-5 transition-transform ${selected ? "scale-110" : ""}`} />
              {badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#f52538] text-[9px] font-black text-white flex items-center justify-center shadow-xs">
                  {badge}
                </span>
              )}
            </div>

            <span className="tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
