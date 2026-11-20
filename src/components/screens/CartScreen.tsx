import React, { useState } from "react";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Receipt,
  RotateCcw,
  Package
} from "lucide-react";
import confetti from "canvas-confetti";
import type { CartItem, Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { playAlertBeep } from "@/lib/utils";

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  soundEnabled: boolean;
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
  onOpenProduct?: (product: Product) => void;
}

export function CartScreen({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  soundEnabled,
  onNavigateToProducts,
  onNavigateToOrders,
  onOpenProduct,
}: CartScreenProps) {
  const [isOrdered, setIsOrdered] = useState(false);
  const [poNumber, setPoNumber] = useState("");

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const dealerDiscount = subtotal * 0.1; // 10% wholesale dealer discount
  const freightShipping = subtotal >= 200 || subtotal === 0 ? 0 : 15.0;
  const total = subtotal > 0 ? subtotal - dealerDiscount + freightShipping : 0;
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const generatedPo = `ACC-PO-${Math.floor(100000 + Math.random() * 900000)}`;
    setPoNumber(generatedPo);
    setIsOrdered(true);

    if (soundEnabled) {
      playAlertBeep("success");
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#f52538", "#0284c7", "#eab308", "#10b981", "#0f172a"],
    });
  };

  const handleNewOrder = () => {
    setIsOrdered(false);
    onClearCart();
    onNavigateToProducts();
  };

  const handleViewOrders = () => {
    setIsOrdered(false);
    onClearCart();
    onNavigateToOrders();
  };

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900">
      <div className="px-4 pt-4 space-y-4">
        {/* Screen Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Order Manifest
          </h1>
          {totalItemCount > 0 && !isOrdered && (
            <span className="bg-rose-50 text-[#f52538] border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {/* 1. Order Confirmed Screen */}
        {isOrdered ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center space-y-5 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-400 grid place-items-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-10 w-10 stroke-[2.25]" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                DISPATCH READY
              </span>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                Purchase Order Dispatched!
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Your dealer order has been routed to Accele Pro Distribution Bay in Cerritos, CA.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">PO Number:</span>
                <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {poNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Dealer Account:</span>
                <span className="font-semibold text-slate-900">Tier 1 Certified (ACC-8910)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Billed:</span>
                <span className="font-bold text-slate-900 text-sm">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Dispatch Window:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" /> Same-Day Bay Courier
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                onClick={handleViewOrders}
                variant="default"
                size="lg"
                className="w-full text-xs font-bold py-3 shadow-sm cursor-pointer"
              >
                Track in Bookings & Orders
              </Button>
              <Button
                onClick={handleNewOrder}
                variant="outline"
                size="lg"
                className="w-full text-xs font-bold py-3 cursor-pointer"
              >
                Continue Ordering Hardware
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* 2. Empty Cart State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-4 my-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 grid place-items-center text-slate-400">
              <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Your bay manifest is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Browse our ADAS safety cameras, wiring kits, relays, and commercial 12V hardware.
              </p>
            </div>
            <Button
              onClick={onNavigateToProducts}
              variant="default"
              size="sm"
              className="text-xs font-bold cursor-pointer"
            >
              Browse Hardware Catalog
            </Button>
          </div>
        ) : (
          /* 3. Normal Full Cart Page View */
          <div className="space-y-4">
            {/* Free Shipping Alert banner */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-3.5 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 grid place-items-center shrink-0 border border-sky-100">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">Free Freight Over $200</span>
                  <span className="text-sky-700 font-mono text-[11px]">
                    {subtotal >= 200 ? "UNLOCKED!" : `$${(200 - subtotal).toFixed(2)} more`}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div
                    className="h-full bg-sky-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => onOpenProduct?.(product)}
                    className="shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                      {product.sku}
                    </span>
                    <h4 
                      onClick={() => onOpenProduct?.(product)}
                      className="text-xs font-bold text-slate-900 truncate mt-1 cursor-pointer hover:text-[#f52538] transition"
                    >
                      {product.name}
                    </h4>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-slate-50 rounded-xl p-1 border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="h-7 w-7 grid place-items-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 active:scale-95 transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center text-slate-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="h-7 w-7 grid place-items-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 active:scale-95 transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 active:scale-90 transition-colors cursor-pointer shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Pricing Summary Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Catalog Subtotal</span>
                <span className="font-semibold text-slate-900 font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Dealer Tier 1 (10%)
                </span>
                <span className="font-semibold text-amber-700 font-mono">-${dealerDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Ground Logistics</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {freightShipping === 0 ? "FREE" : `$${freightShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-slate-900">Manifest Total</span>
                  <p className="text-[9.5px] text-[#f52538] font-bold tracking-wider uppercase">
                    NET 30 INVOICING AVAILABLE
                  </p>
                </div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Purchase Order Button */}
            <Button
              onClick={handleCheckout}
              variant="default"
              size="lg"
              className="w-full flex items-center justify-between py-3.5 text-xs font-bold shadow-md active:scale-98 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Receipt className="w-4 h-4" /> TRANSMIT PURCHASE ORDER
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
