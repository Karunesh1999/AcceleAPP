import React, { useState } from "react";
import { 
  Search, 
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
  X
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
  status: "in-transit" | "completed" | "rma";
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
  {
    id: "RMA-4091",
    poNumber: "WARRANTY SWAP #RVC-CAM",
    status: "rma",
    statusLabel: "Advance Unit Shipped",
    carrier: "UPS Next Day Air",
    trackingNumber: "1Z88291048299901",
    eta: "Tomorrow by 10:30 AM",
    date: "Nov 15, 2026",
    currentStep: 2,
    steps: ["RMA Authorized", "Priority Air Shipped", "Local Transit", "Delivered"],
    items: [{ product: prodRVC180, quantity: 1 }],
    total: 0.0,
    tier: "WARRANTY REPLACEMENT",
  },
];

export function BookingsScreen({
  onOpenProduct,
  onAddToCart,
  soundEnabled,
}: BookingsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "in-transit" | "completed" | "rma">("all");
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<BookingOrder | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<BookingOrder | null>(null);

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

  // Filtered orders
  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    // Status filter
    if (activeFilter !== "all" && order.status !== activeFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchPo = order.poNumber.toLowerCase().includes(q);
      const matchTracking = order.trackingNumber.toLowerCase().includes(q);
      const matchItem = order.items.some(
        (it) =>
          it.product.name.toLowerCase().includes(q) ||
          it.product.sku.toLowerCase().includes(q)
      );
      return matchId || matchPo || matchTracking || matchItem;
    }
    return true;
  });

  const inTransitCount = INITIAL_ORDERS.filter((o) => o.status === "in-transit").length;
  const completedCount = INITIAL_ORDERS.filter((o) => o.status === "completed").length;
  const rmaCount = INITIAL_ORDERS.filter((o) => o.status === "rma").length;

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
        <p className="text-[10px] font-bold tracking-wider text-[#f52538] uppercase">
          WHOLESALE DISPATCH & FULFILLMENT
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 leading-tight">
          Bookings & Orders
        </h1>
        <p className="text-xs text-slate-600 mt-1 font-normal">
          Real-time carrier tracking, bay deliveries, and 1-click reorders.
        </p>

        {/* Search Bar: [ 🔍 Search Orders / PO # ] */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Orders, SKUs, or PO #..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-[#f52538] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills: [ All ] [ In-Transit (2) ] [ Completed ] [ RMA ] */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: `All (${INITIAL_ORDERS.length})` },
            { id: "in-transit", label: `In-Transit (${inTransitCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
            { id: "rma", label: `RMA (${rmaCount})` },
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
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <Package className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5]" />
            <p className="mt-3 text-sm font-bold text-slate-800">No matching orders found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try searching a different SKU, PO number, or clear your filter.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
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
            const isRMA = order.status === "rma";

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3.5"
              >
                {/* Order Top Bar: ORD ID, Status Badge & ETA */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-900">
                        {order.id}
                      </span>
                      <Badge
                        variant={
                          isCompleted
                            ? "emerald"
                            : isRMA
                            ? "destructive"
                            : "cyan"
                        }
                      >
                        {order.statusLabel}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {order.poNumber} • {order.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800">
                      <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                      {order.eta}
                    </span>
                    <p className="text-[9px] font-bold text-[#f52538] uppercase mt-0.5">
                      {order.tier}
                    </p>
                  </div>
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
                          : isRMA
                          ? "bg-rose-500"
                          : "bg-sky-500"
                      }`}
                      style={{
                        width: `${(order.currentStep / order.steps.length) * 100}%`,
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

                  {/* 3 Action Buttons: [ Track Live ] [ 1-Click Reorder ] [ PDF ] */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => setTrackingModalOrder(order)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-bold text-slate-800"
                    >
                      <Truck className="h-3 w-3 mr-1 text-sky-600" />
                      Track Live
                    </Button>

                    <Button
                      onClick={(e) => handleReorder(order, e)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-bold text-slate-800 hover:text-[#f52538]"
                    >
                      <RotateCcw className="h-3 w-3 mr-1 text-[#f52538]" />
                      Reorder
                    </Button>

                    <Button
                      onClick={() => setInvoiceModalOrder(order)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] font-bold text-slate-800"
                    >
                      <FileText className="h-3 w-3 mr-1 text-amber-600" />
                      PDF Invoice
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Live Tracking Journey Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Live Dispatch Journey
                </h3>
                <p className="text-[10px] font-mono text-slate-500">
                  {trackingModalOrder.id} • {trackingModalOrder.carrier}
                </p>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Carrier Status Banner */}
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-sky-950">
                  {trackingModalOrder.eta}
                </p>
                <p className="text-[10px] text-sky-700 font-mono mt-0.5">
                  Track #: {trackingModalOrder.trackingNumber}
                </p>
              </div>
              <Badge variant="cyan">IN TRANSIT</Badge>
            </div>

            {/* Step-by-Step Waypoints */}
            <div className="space-y-3.5 pl-2">
              {trackingModalOrder.steps.map((st, i) => {
                const isPassed = i + 1 <= trackingModalOrder.currentStep;
                const isCurrent = i + 1 === trackingModalOrder.currentStep;

                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    {/* Vertical connecting line */}
                    {i < trackingModalOrder.steps.length - 1 && (
                      <div
                        className={`absolute left-[9px] top-4 w-[2px] h-7 ${
                          i + 1 < trackingModalOrder.currentStep
                            ? "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    )}
                    <div
                      className={`h-5 w-5 rounded-full grid place-items-center text-[10px] font-bold z-10 shrink-0 ${
                        isCurrent
                          ? "bg-[#f52538] text-white ring-4 ring-rose-100"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div>
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
                      <p className="text-[10px] text-slate-500">
                        {isPassed
                          ? i === 0
                            ? "Nov 17, 08:30 AM (Cerritos, CA Hub)"
                            : i === 1
                            ? "Nov 17, 11:45 AM (Quality Tested)"
                            : "Nov 17, 02:15 PM (Bay Route Dispatch)"
                          : "Estimated waypoint"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setTrackingModalOrder(null)}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Close Dispatch Tracker
            </Button>
          </div>
        </div>
      )}

      {/* PDF Wholesale Invoice Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Dealer Wholesale Invoice
                </h3>
                <p className="text-[10px] font-mono text-slate-500">
                  Accele Electronics Inc. • Net 30 Active
                </p>
              </div>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-bold text-slate-900">{invoiceModalOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PO Number:</span>
                <span className="font-bold text-slate-900">{invoiceModalOrder.poNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billed Account:</span>
                <span className="font-bold text-slate-900">Apex 12V Autoworks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax ID:</span>
                <span className="font-bold text-slate-900">AZ-9948210-W</span>
              </div>
            </div>

            {/* Line items */}
            <div className="max-h-40 overflow-y-auto no-scrollbar space-y-1.5 text-xs">
              {invoiceModalOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900 text-[11px] truncate max-w-[190px]">
                      {it.product.name}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono">
                      {it.quantity} × ${it.product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(it.quantity * it.product.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 font-bold text-xs">
              <span>Total Invoice Amount:</span>
              <span className="text-lg font-black text-[#f52538]">
                ${invoiceModalOrder.total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={() => {
                generateInvoicePdf(invoiceModalOrder);
                showToast(`Downloaded Accele_Invoice_${invoiceModalOrder.id}.pdf`);
              }}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              <FileText className="h-3.5 w-3.5 mr-2" /> Download Official PDF Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
