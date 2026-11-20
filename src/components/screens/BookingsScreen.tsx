import React, { useState, useRef } from "react";
import { 
  Truck, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  ExternalLink, 
  Clock, 
  Copy, 
  Check, 
  Package, 
  ChevronRight, 
  AlertCircle,
  X,
  Receipt,
  Download,
  ShieldCheck,
  Building2,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/data/mockData";
import type { Product } from "@/types";
import { playAlertBeep } from "@/lib/utils";
import { generateInvoicePdf } from "@/lib/pdfGenerator";

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface BookingOrder {
  id: string;
  poNumber: string;
  status: "in-transit" | "completed" | "cancelled";
  statusLabel: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  date: string;
  currentStep: number; // 1 to 4
  steps: string[];
  items: OrderItem[];
  total: number;
  tier: string;
}

interface BookingsScreenProps {
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  soundEnabled: boolean;
}

// Fetch authentic products from catalog
const prodRVC180 = PRODUCTS.find((p) => p.sku === "RVC180FM") || PRODUCTS[0];
const prod6100 = PRODUCTS.find((p) => p.sku === "6100-LS") || PRODUCTS[1];
const prod6101 = PRODUCTS.find((p) => p.sku === "6101M") || PRODUCTS[2];
const prodCIG10 = PRODUCTS.find((p) => p.sku === "CIG10") || PRODUCTS[3];
const prodAS4500 = PRODUCTS.find((p) => p.sku === "AS4500") || PRODUCTS[4];
const prodDL1 = PRODUCTS.find((p) => p.sku === "DL1") || PRODUCTS[5];

const INITIAL_ORDERS: BookingOrder[] = [
  {
    id: "ORD-8921",
    poNumber: "PO #PHX-FLEET-BAY2",
    status: "in-transit",
    statusLabel: "In Transit",
    carrier: "UPS Ground",
    trackingNumber: "1Z88291048290192",
    eta: "Today by 4:00 PM",
    date: "Nov 17, 2026",
    currentStep: 3,
    steps: ["Order Placed", "Bay Packaged", "Out for Delivery", "Delivered"],
    items: [
      { product: prodRVC180, quantity: 2 },
      { product: prod6100, quantity: 4 },
    ],
    total: 374.0,
    tier: "DEALER TIER 1",
  },
  {
    id: "ORD-8914",
    poNumber: "PO #STOCK-REPLENISH",
    status: "in-transit",
    statusLabel: "In Transit",
    carrier: "FedEx Freight",
    trackingNumber: "FXF-4820194821",
    eta: "Tomorrow, Nov 18",
    date: "Nov 16, 2026",
    currentStep: 2,
    steps: ["Order Placed", "Departed Hub", "Local Terminal", "Delivered"],
    items: [
      { product: prod6101, quantity: 6 },
      { product: prodCIG10, quantity: 4 },
    ],
    total: 300.0,
    tier: "DEALER TIER 1",
  },
  {
    id: "ORD-8870",
    poNumber: "PO #RAM-COMMERCIAL-01",
    status: "completed",
    statusLabel: "Delivered",
    carrier: "UPS Ground",
    trackingNumber: "1Z88291048290045",
    eta: "Delivered Nov 12",
    date: "Nov 10, 2026",
    currentStep: 4,
    steps: ["Order Placed", "Bay Packaged", "In Transit", "Delivered to Bay"],
    items: [
      { product: prodRVC180, quantity: 1 },
      { product: prodAS4500, quantity: 1 },
    ],
    total: 338.0,
    tier: "DEALER TIER 1",
  },
  {
    id: "ORD-8812",
    poNumber: "PO #BAY-LIGHTING-RETRO",
    status: "completed",
    statusLabel: "Delivered",
    carrier: "Same-Day Bay Courier",
    trackingNumber: "BAY-EXP-7721",
    eta: "Delivered Nov 5",
    date: "Nov 5, 2026",
    currentStep: 4,
    steps: ["Order Placed", "Bay Packaged", "Out for Delivery", "Signed by Marcus V."],
    items: [
      { product: prodDL1, quantity: 8 },
      { product: prod6100, quantity: 10 },
    ],
    total: 422.0,
    tier: "DEALER TIER 1",
  },
];

export interface ReturnOrder {
  id: string;
  originalOrderId: string;
  status: "approved" | "shipped" | "completed";
  statusLabel: string;
  carrier: string;
  trackingNumber: string;
  eta: string;
  date: string;
  currentStep: number;
  steps: string[];
  product: Product;
  quantity: number;
  reason: string;
}

const INITIAL_RETURNS: ReturnOrder[] = [
  {
    id: "RET-4091",
    originalOrderId: "ORD-8870",
    status: "shipped",
    statusLabel: "Advance Unit Shipped",
    carrier: "UPS Next Day Air",
    trackingNumber: "1Z88291048299901",
    eta: "Tomorrow by 10:30 AM",
    date: "Nov 15, 2026",
    currentStep: 2,
    steps: ["Return Requested", "Return Approved", "Priority Air Shipped", "Delivered"],
    product: prodRVC180,
    quantity: 1,
    reason: "Defective Sensor - Warranty Swap",
  },
];

export function BookingsScreen({
  onOpenProduct,
  onAddToCart,
  soundEnabled,
}: BookingsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "in-transit" | "completed" | "returns">("all");
  const [orders, setOrders] = useState<BookingOrder[]>(INITIAL_ORDERS);
  const [cancellingOrder, setCancellingOrder] = useState<BookingOrder | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("Ordered by mistake");
  const [returnList] = useState<ReturnOrder[]>(INITIAL_RETURNS);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<BookingOrder | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<BookingOrder | null>(null);

  // Bottom Sheet Swipe Down/Up Gesture State
  const [sheetDragY, setSheetDragY] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const sheetStartYRef = useRef(0);

  const handleSheetPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    sheetStartYRef.current = e.clientY;
    setIsSheetDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSheetPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSheetDragging) return;
    const delta = e.clientY - sheetStartYRef.current;
    if (delta > 0) {
      setSheetDragY(delta);
    } else {
      setSheetDragY(delta * 0.15); // gentle resistance when swiping up
    }
  };

  const handleSheetPointerUp = (e: React.PointerEvent<HTMLDivElement>, closeFn: () => void) => {
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
      closeFn();
    } else {
      setSheetDragY(0);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyTracking = (tracking: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(tracking);
    setCopiedTracking(tracking);
    if (soundEnabled) playAlertBeep("click");
    showToast("Tracking number copied to clipboard!");
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const handleCopyInvoice = (inv: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(inv);
    setCopiedInvoice(inv);
    if (soundEnabled) playAlertBeep("click");
    showToast("Invoice number copied!");
    setTimeout(() => setCopiedInvoice(null), 2000);
  };

  const handleReorder = (order: BookingOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        onAddToCart(item.product);
      }
    });
    if (soundEnabled) playAlertBeep("success");
    showToast(`Reorder added: ${order.items.length} items to order cart!`);
  };

  const handleOpenReturnTracking = (ret: ReturnOrder) => {
    setTrackingModalOrder({
      id: ret.id,
      poNumber: `WARRANTY RETURN #${ret.id}`,
      status: "in-transit",
      statusLabel: ret.statusLabel,
      carrier: ret.carrier,
      trackingNumber: ret.trackingNumber,
      eta: ret.eta,
      date: ret.date,
      currentStep: ret.currentStep,
      steps: ret.steps,
      items: [{ product: ret.product, quantity: ret.quantity }],
      total: 0.0,
      tier: "WARRANTY RETURN",
    });
  };

  const handleOpenReturnSlip = (ret: ReturnOrder) => {
    setInvoiceModalOrder({
      id: ret.id,
      poNumber: `WARRANTY RETURN #${ret.id}`,
      status: "completed",
      statusLabel: "Return Approved",
      carrier: ret.carrier,
      trackingNumber: ret.trackingNumber,
      eta: ret.eta,
      date: ret.date,
      currentStep: 4,
      steps: ret.steps,
      items: [{ product: ret.product, quantity: ret.quantity }],
      total: 0.0,
      tier: "WARRANTY RETURN",
    });
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === cancellingOrder.id
          ? {
              ...o,
              status: "cancelled" as const,
              statusLabel: "Cancelled",
              eta: "Order Cancelled",
            }
          : o
      )
    );
    if (soundEnabled) playAlertBeep("click");
    showToast(`Order ${cancellingOrder.id} cancelled. Credit refunded to account.`);
    setCancellingOrder(null);
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (activeFilter !== "all" && order.status !== activeFilter) {
      return false;
    }
    return true;
  });

  const inTransitCount = orders.filter((o) => o.status === "in-transit").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const returnsCount = returnList.length;

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-sm rounded-xl bg-slate-900/95 text-white p-3 text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Screen Header */}
      <section className="px-4 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
          Bookings & Orders
        </h1>

        {/* Filter Pills: [ All ] [ In-Transit ] [ Completed ] [ Returns ] */}
        <div className="mt-3.5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: `All (${orders.length})` },
            { id: "in-transit", label: `In-Transit (${inTransitCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
            { id: "returns", label: `Returns (${returnsCount})` },
          ].map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id as typeof activeFilter);
                  if (soundEnabled) playAlertBeep("click");
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-[#f52538] text-white border-[#f52538] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Orders List Container */}
      <section className="px-4 mt-4 space-y-4">
        {activeFilter === "returns" ? (
          <div className="space-y-4">
            {/* Active Return Cards */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Active Return Shipments
              </p>
              {returnList.map((ret) => (
                <div
                  key={ret.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3.5"
                >
                  {/* Top Bar: Status Badge & ETA */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <Badge variant="destructive">
                      Return In-Transit
                    </Badge>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800">
                      <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                      {ret.eta}
                    </span>
                  </div>

                  {/* Return Reason & Original Order */}
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="font-semibold text-slate-700">Reason:</span> {ret.reason}
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                      Original Order: {ret.originalOrderId} • Registered Bay Return
                    </span>
                  </div>

                  {/* Carrier Bar */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Truck className="h-4 w-4 text-[#f52538] shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900">{ret.carrier}:</span>{" "}
                        <span className="font-mono text-[11px] text-slate-600">
                          {ret.trackingNumber}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleCopyTracking(ret.trackingNumber, e)}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking === ret.trackingNumber ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>{ret.steps[ret.currentStep - 1]}</span>
                      <span>Step {ret.currentStep} of {ret.steps.length}</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#f52538] transition-all duration-500"
                        style={{
                          width: `${(ret.currentStep / ret.steps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div
                    onClick={() => onOpenProduct(ret.product)}
                    className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 transition cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={ret.product.image}
                        alt={ret.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {ret.product.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        SKU: {ret.product.sku} • Qty: {ret.quantity}
                      </p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <Button
                      onClick={() => handleOpenReturnTracking(ret)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-bold text-slate-800 cursor-pointer"
                    >
                      <Truck className="h-3 w-3 mr-1 text-sky-600" />
                      Track Return
                    </Button>
                    <Button
                      onClick={() => handleOpenReturnSlip(ret)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-bold text-slate-800 cursor-pointer"
                    >
                      <FileText className="h-3 w-3 mr-1 text-amber-600" />
                      Return Slip
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <Package className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5]" />
            <p className="mt-3 text-sm font-bold text-slate-800">No matching orders found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try switching your filter above.
            </p>
            <Button
              onClick={() => {
                setActiveFilter("all");
              }}
              variant="outline"
              size="sm"
              className="mt-4 text-xs font-bold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCompleted = order.status === "completed";
            const isCancelled = order.status === "cancelled";

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3.5"
              >
                {/* Order Top Bar: Status Badge & ETA */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <Badge variant={isCompleted ? "emerald" : isCancelled ? "secondary" : "cyan"}>
                    {order.statusLabel}
                  </Badge>

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                    {order.eta}
                  </span>
                </div>

                {/* Carrier & Tracking */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Truck className="h-4 w-4 text-[#f52538] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">{order.carrier}:</span>{" "}
                      <span className="font-mono text-[11px] text-slate-600">
                        {order.trackingNumber}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCopyTracking(order.trackingNumber, e)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                    title="Copy Tracking Number"
                  >
                    {copiedTracking === order.trackingNumber ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                {/* Tracking Progress Bar: [====●======] */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{order.steps[order.currentStep - 1]}</span>
                    <span>Step {order.currentStep} of {order.steps.length}</span>
                  </div>
                  <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isCancelled
                          ? "bg-slate-300"
                          : "bg-sky-500"
                      }`}
                      style={{
                        width: isCancelled ? "100%" : `${(order.currentStep / order.steps.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Products in this order */}
                <div className="space-y-2 pt-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onOpenProduct(item.product)}
                      className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/80 transition cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500">
                          SKU: {item.product.sku} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total and 3 Action Buttons */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs font-bold text-slate-600">Order Total:</span>
                    <span className="text-base font-black text-slate-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons: Track Live / Reorder / Invoice & Cancel option */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {!isCompleted && !isCancelled ? (
                        <Button
                          onClick={() => setTrackingModalOrder(order)}
                          variant="outline"
                          size="sm"
                          className="text-[10px] font-bold text-slate-800 cursor-pointer"
                        >
                          <Truck className="h-3 w-3 mr-1 text-sky-600" />
                          Track Live
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => handleReorder(order, e)}
                          variant="outline"
                          size="sm"
                          className="text-[10px] font-bold text-slate-800 hover:text-[#f52538] cursor-pointer"
                        >
                          <RotateCcw className="h-3 w-3 mr-1 text-[#f52538]" />
                          Reorder
                        </Button>
                      )}

                      <Button
                        onClick={() => setInvoiceModalOrder(order)}
                        variant="outline"
                        size="sm"
                        className="text-[10px] font-bold text-slate-800 cursor-pointer"
                      >
                        <FileText className="h-3 w-3 mr-1 text-amber-600" />
                        PDF Invoice
                      </Button>
                    </div>

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="w-full py-1.5 rounded-xl border border-rose-200/90 bg-rose-50/50 hover:bg-rose-100/70 text-[10.5px] font-bold text-rose-600 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Live Tracking Journey Bottom Sheet (Native Mobile Drawer) */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setTrackingModalOrder(null)}
          />

          {/* Drawer Panel */}
          <div 
            style={{
              transform: `translateY(${Math.max(0, sheetDragY)}px)`,
              transition: isSheetDragging ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="relative z-50 w-full max-w-[430px] max-h-[90dvh] flex flex-col rounded-t-[32px] border-t border-slate-200 bg-white text-slate-900 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab Handle - Swipe Down to Close */}
            <div 
              onPointerDown={handleSheetPointerDown}
              onPointerMove={handleSheetPointerMove}
              onPointerUp={(e) => handleSheetPointerUp(e, () => setTrackingModalOrder(null))}
              onPointerCancel={(e) => handleSheetPointerUp(e, () => setTrackingModalOrder(null))}
              className="flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none hover:bg-slate-50/50 rounded-t-[32px] transition-colors"
              title="Swipe down to close"
            >
              <div className="h-1.5 w-12 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Live Dispatch Journey
                </h3>
              </div>
            </div>

            {/* Scrollable Sheet Content */}
            <div className="overflow-y-auto no-scrollbar p-5 space-y-4">
              {/* Visual Transit Map Simulation Card - Clean Light Theme */}
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 text-slate-900 shadow-2xs space-y-3">
                <div className="flex items-center justify-end">
                  <span className="text-[10.5px] font-mono text-slate-600 font-bold">
                    Est. {trackingModalOrder.eta}
                  </span>
                </div>

                {/* Route Flow Graphic */}
                <div className="flex items-center justify-between pt-1 relative">
                  {/* Origin */}
                  <div className="text-left">
                    <p className="text-[9.5px] text-slate-400 uppercase font-mono">Origin</p>
                    <p className="text-xs font-bold text-slate-900">Cerritos, CA</p>
                    <p className="text-[9.5px] text-slate-500 font-mono">Accele Bay Hub</p>
                  </div>

                  {/* Animated Middle Path */}
                  <div className="flex-1 mx-3 flex flex-col items-center">
                    <div className="w-full flex items-center relative">
                      <div className="w-full h-1 bg-slate-200 relative overflow-hidden rounded-full">
                        <div className="absolute inset-y-0 left-0 w-3/4 bg-emerald-500 rounded-full" />
                      </div>
                      <div className="absolute left-2/3 -translate-x-1/2 -top-2.5 grid h-6 w-6 place-items-center rounded-full bg-[#f52538] text-white shadow-xs ring-2 ring-white animate-pulse">
                        <Truck className="h-3 w-3" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold mt-2.5">
                      In-Transit • Route 10E
                    </span>
                  </div>

                  {/* Destination */}
                  <div className="text-right">
                    <p className="text-[9.5px] text-slate-400 uppercase font-mono">Destination</p>
                    <p className="text-xs font-bold text-slate-900">Phoenix, AZ</p>
                    <p className="text-[9.5px] text-slate-500 font-mono">Apex 12V Bay #4</p>
                  </div>
                </div>
              </div>

              {/* ETA & Tracking Info Bar */}
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-sky-950 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-sky-700" />
                    Expected Delivery: {trackingModalOrder.eta}
                  </p>
                  <p className="text-[10px] text-sky-700 font-mono mt-1">
                    Tracking: {trackingModalOrder.trackingNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingModalOrder.trackingNumber);
                    setCopiedTracking(trackingModalOrder.id);
                    if (soundEnabled) playAlertBeep("click");
                    showToast(`Copied ${trackingModalOrder.carrier} tracking number!`);
                    setTimeout(() => setCopiedTracking(null), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 text-[10px] font-bold text-sky-800 hover:bg-sky-100 active:scale-95 transition shadow-2xs cursor-pointer shrink-0"
                >
                  {copiedTracking === trackingModalOrder.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-sky-600" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-Step Waypoints Timeline */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3.5">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Shipment Checkpoints
                </p>
                <div className="space-y-4 pl-1">
                  {trackingModalOrder.steps.map((st, i) => {
                    const isPassed = i + 1 <= trackingModalOrder.currentStep;
                    const isCurrent = i + 1 === trackingModalOrder.currentStep;

                    return (
                      <div key={i} className="flex items-start gap-3.5 relative">
                        {/* Connecting Line */}
                        {i < trackingModalOrder.steps.length - 1 && (
                          <div
                            className={`absolute left-[11px] top-6 w-[2px] h-9 ${
                              i + 1 < trackingModalOrder.currentStep
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        {/* Status Icon */}
                        <div
                          className={`h-6 w-6 rounded-full grid place-items-center text-xs font-bold z-10 shrink-0 transition ${
                            isCurrent
                              ? "bg-[#f52538] text-white ring-4 ring-rose-100 shadow-xs"
                              : isPassed
                              ? "bg-emerald-500 text-white shadow-xs"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isPassed ? (
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          ) : (
                            <span>{i + 1}</span>
                          )}
                        </div>

                        {/* Waypoint Text */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs ${
                              isCurrent
                                ? "font-black text-slate-900"
                                : isPassed
                                ? "font-bold text-slate-800"
                                : "text-slate-400"
                            }`}
                          >
                            {st}
                          </p>
                          <p className="text-[10.5px] text-slate-500 mt-0.5">
                            {isPassed
                              ? i === 0
                                ? "Nov 17, 08:30 AM • Cerritos, CA Distribution Hub"
                                : i === 1
                                ? "Nov 17, 11:45 AM • Bench Tested & Sealed"
                                : "Nov 17, 02:15 PM • Bay Route Dispatch Vehicle"
                              : "Estimated checkpoint upon arrival"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Carrier & Dispatcher Contact Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-slate-200 grid place-items-center text-slate-700 shrink-0">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">UPS Priority Bay Delivery</p>
                    <p className="text-[10px] text-slate-500">Commercial Signature Service</p>
                  </div>
                </div>
                <a
                  href="tel:18007881212"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 active:scale-95 transition"
                >
                  Call Support
                </a>
              </div>

              {/* Bottom Done Button */}
              <Button
                onClick={() => setTrackingModalOrder(null)}
                variant="default"
                size="sm"
                className="w-full py-2.5 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Close Tracking
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Wholesale Invoice Bottom Sheet (Native Mobile Slip Drawer) */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setInvoiceModalOrder(null)}
          />

          {/* Drawer Panel */}
          <div 
            style={{
              transform: `translateY(${Math.max(0, sheetDragY)}px)`,
              transition: isSheetDragging ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="relative z-50 w-full max-w-[430px] max-h-[92dvh] flex flex-col rounded-t-[32px] border-t border-slate-200 bg-white text-slate-900 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab Handle - Swipe Down to Close */}
            <div 
              onPointerDown={handleSheetPointerDown}
              onPointerMove={handleSheetPointerMove}
              onPointerUp={(e) => handleSheetPointerUp(e, () => setInvoiceModalOrder(null))}
              onPointerCancel={(e) => handleSheetPointerUp(e, () => setInvoiceModalOrder(null))}
              className="flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none hover:bg-slate-50/50 rounded-t-[32px] transition-colors"
              title="Swipe down to close"
            >
              <div className="h-1.5 w-12 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Invoice
              </h3>
            </div>

            {/* Scrollable Receipt Body */}
            <div className="overflow-y-auto p-4 space-y-3.5 no-scrollbar flex-1">
              {/* Receipt Slip Container */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3.5">
                {/* Brand & Reference Bar */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center shadow-xs">
                      <Receipt className="h-4 w-4 text-[#f52538]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 tracking-wide">ACCELE ELECTRONICS</p>
                      <p className="text-[10px] text-slate-500">Cerritos, CA 90703 • ISO 9001</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {invoiceModalOrder.id}
                      </span>
                      <button
                        onClick={(e) => handleCopyInvoice(invoiceModalOrder.id, e)}
                        className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition"
                        title="Copy Invoice Number"
                      >
                        {copiedInvoice === invoiceModalOrder.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500">{invoiceModalOrder.date}</p>
                  </div>
                </div>

                {/* 2x2 Commercial Account Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Billed Account:</span>
                    <span className="font-bold text-slate-900 truncate block">Apex 12V Autoworks</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">PO Number:</span>
                    <span className="font-bold text-slate-900 truncate block">{invoiceModalOrder.poNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Payment Terms:</span>
                    <span className="font-bold text-emerald-600 block">Net 30 Commercial</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Tax / Resale ID:</span>
                    <span className="font-bold text-slate-900 block">AZ-9948210-W</span>
                  </div>
                </div>

                {/* Itemized Products */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                    <span>Item & Description</span>
                    <span>Total</span>
                  </div>
                  {invoiceModalOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80"
                    >
                      <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {it.product.name}
                        </p>
                        <p className="text-[10.5px] font-mono text-slate-500">
                          {it.quantity} × ${it.product.price.toFixed(2)} • SKU: {it.product.sku}
                        </p>
                      </div>
                      <span className="text-xs font-black text-slate-900 shrink-0">
                        ${(it.quantity * it.product.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown & Total */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">${invoiceModalOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tier Discount:</span>
                    <span className="font-bold text-emerald-600">Applied (Tier 1 Preferred)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Commercial Freight:</span>
                    <span className="font-bold text-slate-900">Prepaid & Included</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Sales Tax:</span>
                    <span className="font-mono text-slate-500">$0.00 (Resale Exempt)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900">Total Invoice Amount:</span>
                    <span className="text-lg font-black text-[#f52538]">
                      ${invoiceModalOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={() => {
                    generateInvoicePdf(invoiceModalOrder);
                    showToast(`Downloaded Accele_Invoice_${invoiceModalOrder.id}.pdf`);
                  }}
                  variant="default"
                  size="sm"
                  className="w-full py-2.5 text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="h-4 w-4 mr-2" /> Download Official PDF Receipt
                </Button>

                <Button
                  onClick={() => setInvoiceModalOrder(null)}
                  variant="outline"
                  size="sm"
                  className="w-full py-2 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setCancellingOrder(null)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden p-5 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cancel Order {cancellingOrder.id}?</h3>
                <p className="text-[11px] text-slate-500 font-medium">PO #{cancellingOrder.poNumber} • ${cancellingOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this order? This will void the dispatch process and refund your account credit line immediately.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Customer installation cancelled">Customer installation cancelled</option>
                <option value="Incorrect SKU / part model">Incorrect SKU / part model</option>
                <option value="Dispatch delay / urgent local sourcing">Dispatch delay / urgent local sourcing</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                onClick={() => setCancellingOrder(null)}
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-xl cursor-pointer"
              >
                Keep Order
              </Button>
              <Button
                onClick={handleConfirmCancel}
                variant="destructive"
                size="sm"
                className="text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
