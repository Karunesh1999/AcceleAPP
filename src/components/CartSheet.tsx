import React, { useState } from "react";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  Receipt 
} from "lucide-react";
import confetti from "canvas-confetti";
import type { CartItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Modal";
import { playAlertBeep } from "@/lib/utils";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  soundEnabled: boolean;
}

export function CartSheet({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  soundEnabled,
}: CartSheetProps) {
  const [isOrdered, setIsOrdered] = useState(false);
  const [poNumber, setPoNumber] = useState("");

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const dealerDiscount = subtotal * 0.1; // 10% wholesale dealer discount
  const freightShipping = subtotal > 200 ? 0 : 15.0;
  const total = subtotal - dealerDiscount + freightShipping;

  const handleCheckout = () => {
    const generatedPo = `ACC-PO-${Math.floor(100000 + Math.random() * 900000)}`;
    setPoNumber(generatedPo);
    setIsOrdered(true);

    if (soundEnabled) {
      playAlertBeep("success");
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f52538", "#0284c7", "#eab308", "#0f172a"],
    });
  };

  const resetAndClose = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={isOrdered ? "Order Confirmed" : "Dealer Order Manifest"}
      subtitle={isOrdered ? "DISPATCH READY" : "WHOLESALE BAY ORDER"}
    >
      {isOrdered ? (
        <div className="py-6 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 border-2 border-emerald-400 grid place-items-center text-emerald-600 shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900">Purchase Order Dispatched!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Your dealer order has been routed to Accele Pro Distribution Bay.
            </p>
          </div>

          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">PO Number:</span>
              <span className="font-mono font-bold text-sky-700">{poNumber}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Dealer Account:</span>
              <span className="font-semibold text-slate-900">Tier 1 Certified (ACC-8910)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Billed:</span>
              <span className="font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Dispatch Window:</span>
              <span className="text-emerald-700 font-bold">Same Day Bay Courier</span>
            </div>
          </div>

          <Button onClick={resetAndClose} variant="default" className="w-full mt-2">
            Return to Dashboard
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 grid place-items-center text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Your bay manifest is empty</h4>
          <p className="text-xs text-slate-500 max-w-xs">
            Browse our ADAS safety cameras, wiring kits, and accent lighting hardware.
          </p>
          <Button onClick={onClose} variant="secondary" size="sm" className="mt-2">
            Browse Hardware Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Free Shipping Alert banner */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
            <Truck className="w-5 h-5 text-sky-600 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-700">Free Freight Over $200</span>
                <span className="text-sky-700">
                  {subtotal >= 200 ? "UNLOCKED!" : `$${(200 - subtotal).toFixed(2)} more`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono font-bold text-sky-700">
                    {product.sku}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  <div className="text-xs font-black text-slate-900 mt-1">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    className="h-6 w-6 grid place-items-center rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-5 text-center text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className="h-6 w-6 grid place-items-center rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(product.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Catalog Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 text-amber-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Dealer Tier 1 (10%)
              </span>
              <span className="font-semibold text-amber-700">-${dealerDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Ground Logistics</span>
              <span className="font-semibold text-slate-900">
                {freightShipping === 0 ? "FREE" : `$${freightShipping.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-black text-slate-900">Manifest Total</span>
                <p className="text-[9px] text-[#f52538] font-bold">NET 30 INVOICING AVAILABLE</p>
              </div>
              <span className="text-xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            variant="default"
            size="lg"
            className="w-full flex items-center justify-between shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Receipt className="w-4 h-4" /> TRANSMIT PURCHASE ORDER
            </span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Sheet>
  );
}
