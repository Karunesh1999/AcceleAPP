import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 text-slate-900",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
            {description && (
              <p className="mt-1 text-xs text-slate-500 font-normal">{description}</p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: "bottom" | "right";
  className?: string;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = "bottom",
  className,
}: SheetProps) {
  const [sheetDragY, setSheetDragY] = React.useState(0);
  const [isSheetDragging, setIsSheetDragging] = React.useState(false);
  const sheetStartYRef = React.useRef(0);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSheetDragY(0);
      setIsSheetDragging(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    sheetStartYRef.current = e.clientY;
    setIsSheetDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSheetDragging) return;
    const delta = e.clientY - sheetStartYRef.current;
    if (delta > 0) {
      setSheetDragY(delta);
    } else {
      setSheetDragY(delta * 0.15); // gentle resistance when dragging up
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSheetDragging) return;
    setIsSheetDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const delta = e.clientY - sheetStartYRef.current;
    if (delta > 60) {
      setSheetDragY(0);
      onClose();
    } else {
      setSheetDragY(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      {position === "bottom" ? (
        <div
          style={{
            transform: `translateY(${Math.max(0, sheetDragY)}px)`,
            transition: isSheetDragging ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-[430px] flex-col rounded-t-[32px] border-t border-slate-200 bg-white text-slate-900 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300",
            className
          )}
        >
          {/* Grab handle - Swipe Down to Close */}
          <div 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none hover:bg-slate-50/50 rounded-t-[32px] transition-colors"
            title="Swipe down to close"
          >
            <div className="h-1.5 w-12 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
          </div>

          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100">
            <div>
              {subtitle && (
                <p className="text-[10px] font-bold tracking-wider text-[#f52538] uppercase">
                  {subtitle}
                </p>
              )}
              {title && <h3 className="text-base font-bold tracking-tight text-slate-900">{title}</h3>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {children}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white text-slate-900 p-6 shadow-2xl animate-in slide-in-from-right duration-300",
            className
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              {subtitle && (
                <p className="text-[9px] font-bold tracking-widest text-[#f52538] uppercase">
                  {subtitle}
                </p>
              )}
              {title && <h3 className="text-base font-black text-slate-900">{title}</h3>}
            </div>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 no-scrollbar">{children}</div>
        </div>
      )}
    </div>
  );
}
