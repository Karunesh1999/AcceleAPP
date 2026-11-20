import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectContext = createContext<SelectContextType | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={() => ctx.setIsOpen((prev) => !prev)}
      className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-all hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#f52538]/20 focus:border-[#f52538] cursor-pointer ${
        ctx.isOpen ? "border-[#f52538] ring-2 ring-[#f52538]/20 bg-white" : ""
      } ${className}`}
    >
      <div className="truncate text-left flex-1 min-w-0 pr-2">{children}</div>
      <ChevronDown
        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
          ctx.isOpen ? "rotate-180 text-[#f52538]" : ""
        }`}
      />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;
  return <span>{ctx.value || placeholder}</span>;
}

export function SelectContent({
  children,
  className = "",
  position = "bottom",
}: {
  children: React.ReactNode;
  className?: string;
  position?: "bottom" | "top";
}) {
  const ctx = useContext(SelectContext);
  if (!ctx || !ctx.isOpen) return null;

  return (
    <div
      className={`absolute left-0 right-0 ${
        position === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5"
      } z-50 max-h-52 w-full overflow-y-auto no-scrollbar rounded-2xl border border-slate-200/90 bg-white p-1.5 text-slate-800 shadow-2xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(SelectContext);
  if (!ctx) return null;

  const isSelected = ctx.value === value;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        ctx.onValueChange(value);
        ctx.setIsOpen(false);
      }}
      className={`relative flex w-full cursor-pointer select-none items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors outline-none ${
        isSelected
          ? "bg-rose-50 text-[#f52538] font-bold"
          : "hover:bg-slate-100 hover:text-slate-900 text-slate-700"
      } ${className}`}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-[#f52538] shrink-0 ml-2" />}
    </div>
  );
}
