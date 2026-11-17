import React, { useState, useMemo, useRef } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { PRODUCTS } from "@/data/mockData";
import type { Product } from "@/types";
import { playAlertBeep } from "@/lib/utils";

interface ProductsScreenProps {
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialCategory?: string;
  soundEnabled: boolean;
}

export function ProductsScreen({
  onOpenProduct,
  onAddToCart,
  initialCategory = "all",
  soundEnabled,
}: ProductsScreenProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categoriesList = [
    { id: "all", label: "All Products" },
    { id: "cameras", label: "Cameras & ADAS" },
    { id: "lighting", label: "Lighting" },
    { id: "wiring", label: "Actuators & Relays" },
    { id: "gps", label: "GPS & Antennas" },
    { id: "security", label: "Security & Alarms" },
  ];

  // Drag and smooth horizontal scrolling handlers
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 60);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > 0 || Math.abs(e.deltaX) > 0) {
      scrollRef.current.scrollLeft += (e.deltaX || e.deltaY) * 0.9;
    }
  };

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [query, selectedCategory]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    if (soundEnabled) {
      playAlertBeep("click");
    }
  };

  return (
    <div className="pb-28 bg-slate-50 min-h-full">
      {/* Header and Search */}
      <div className="px-4 pt-4">
        <p className="text-[8px] font-bold tracking-[0.2em] text-[#f52538] uppercase">
          LIVE INVENTORY & HARDWARE
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Find the right hardware
        </h1>

        {/* Search Bar */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus-within:border-[#f52538] transition shadow-xs">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
            placeholder="Search by model, SKU, or vehicle..."
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills with Left/Right Scroll and Drag */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1 cursor-grab active:cursor-grabbing select-none touch-pan-x -mx-4 px-4 scroll-smooth"
        >
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (!hasDragged) {
                  setSelectedCategory(cat.id);
                }
              }}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-bold transition-all border border-[#f52538] ${
                selectedCategory === cat.id
                  ? "bg-[#f52538] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-rose-50/50 shadow-2xs"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
            No products found matching &quot;{query}&quot;. Try adjusting your filters.
          </div>
        ) : (
          filtered.map((product, i) => (
            <div
              key={product.sku}
              onClick={() => onOpenProduct(product)}
              className={`${
                i === 0 ? "col-span-2" : "col-span-1"
              } cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99] shadow-2xs flex flex-col justify-between`}
            >
              {/* Product Image Section */}
              <div
                className={`${
                  i === 0 ? "h-56" : "h-36"
                } relative overflow-hidden bg-slate-100/80 flex items-center justify-center p-3.5 border-b border-slate-200`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain mix-blend-multiply transition duration-300 hover:scale-105"
                />

                {/* Tag Badge */}
                <span className="absolute left-3 top-3 rounded-md bg-[#f52538] px-2 py-0.5 text-[7px] font-bold text-white shadow-xs uppercase tracking-wide">
                  {product.tag}
                </span>

                {/* In Stock Badge */}
                {product.inStock && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 text-[7px] font-bold text-emerald-700 shadow-2xs backdrop-blur-xs">
                    IN STOCK ({product.stockCount})
                  </span>
                )}
              </div>

              {/* Product Info Section */}
              <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-[8px] font-semibold font-mono tracking-wider text-sky-700">
                    SKU · {product.sku}
                  </p>
                  <h3 className="mt-1 text-[13px] font-semibold leading-snug text-slate-900 line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-100">
                  <div>
                    <strong className="text-sm font-bold text-slate-900">
                      ${product.price.toFixed(2)}
                    </strong>
                    <p className="text-[7px] font-semibold text-slate-500">TIER 1 DEALER</p>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-700 hover:bg-[#f52538] hover:text-white transition active:scale-90 border border-slate-200"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
