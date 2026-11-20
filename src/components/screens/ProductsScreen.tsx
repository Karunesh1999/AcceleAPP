import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  X, 
  SlidersHorizontal, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw 
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/mockData";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    let result = [...PRODUCTS];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          (product.tag && product.tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (priceSort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [query, selectedCategory, priceSort]);

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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
          Find the right hardware
        </h1>

        {/* Search Bar & Dropdown Filter Section (Matching HomeScreen) */}
        <div className="mt-3.5 relative z-40" ref={searchContainerRef}>
          <div
            className={`flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 text-slate-800 shadow-2xs transition-all ${
              isDropdownOpen
                ? "border-[#f52538] ring-2 ring-rose-500/10 shadow-md"
                : "border-slate-200/90 hover:border-slate-300"
            }`}
          >
            {/* Search / Filter Icon Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              title="Toggle filter & search dropdown"
              aria-label="Toggle filter and sort dropdown"
              className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50 text-[#f52538] hover:bg-rose-100 active:scale-95 transition shrink-0 cursor-pointer"
            >
              <Search className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Live Search Input */}
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search by model, SKU, or vehicle..."
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 font-medium outline-none"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-600 p-1 shrink-0 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Filter / Sort Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${
                isDropdownOpen || selectedCategory !== "all" || priceSort !== "none"
                  ? "bg-[#f52538] text-white shadow-xs shadow-rose-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter</span>
              {(selectedCategory !== "all" || priceSort !== "none") && (
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>

          {/* Dropdown Menu (Inline dropdown matching HomeScreen) */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200/90 bg-white/98 backdrop-blur-md p-4 shadow-xl max-h-[460px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                    Sort & Filter
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9.5px] font-mono font-semibold text-slate-600">
                    {filtered.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {(selectedCategory !== "all" || priceSort !== "none" || query) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("all");
                        setPriceSort("none");
                        setQuery("");
                      }}
                      className="flex items-center gap-1 text-[10.5px] font-semibold text-[#f52538] hover:underline cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto no-scrollbar py-2 space-y-3.5 flex-1">
                {/* Price Sort Section */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sort by Price
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPriceSort("none")}
                      className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border cursor-pointer ${
                        priceSort === "none"
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceSort("asc")}
                      className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border flex items-center justify-center gap-1 cursor-pointer ${
                        priceSort === "asc"
                          ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      <ArrowUp className="h-3 w-3" /> Low to High
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceSort("desc")}
                      className={`rounded-xl px-2 py-1.5 text-center text-[10.5px] font-semibold transition border flex items-center justify-center gap-1 cursor-pointer ${
                        priceSort === "desc"
                          ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      <ArrowDown className="h-3 w-3" /> High to Low
                    </button>
                  </div>
                </div>

                {/* Category Filter Section */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filter by Category
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("all")}
                      className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition border cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition border cursor-pointer ${
                          selectedCategory === cat.id
                            ? "bg-[#f52538] text-white border-[#f52538] shadow-2xs shadow-rose-500/20"
                            : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hardware Products List Preview */}
                <div className="border-t border-slate-100 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Hardware Products ({filtered.length})</span>
                    <span>Price</span>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                    {filtered.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        <p className="font-semibold text-slate-600">No hardware found</p>
                        <p className="text-[11px] mt-0.5">Try clearing or changing your filters</p>
                      </div>
                    ) : (
                      filtered.slice(0, 20).map((prod) => (
                        <div
                          key={prod.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenProduct(prod);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setIsDropdownOpen(false);
                              onOpenProduct(prod);
                            }
                          }}
                          className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer text-left gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-8 w-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {prod.name}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500">
                                {prod.sku}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#f52538] shrink-0">
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
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
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all border border-[#f52538] ${
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
          filtered.map((product, i) => {
            const isFeatured = i === 0;
            return (
              <div
                key={product.sku}
                onClick={() => onOpenProduct(product)}
                className={`${
                  isFeatured ? "col-span-2" : "col-span-1"
                } group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.99] shadow-2xs flex flex-col justify-between`}
              >
                {/* Product Image Section - Flipkart style spacious showcase */}
                <div
                  className={`${
                    isFeatured ? "h-56" : "aspect-square w-full"
                  } relative overflow-hidden bg-slate-50/70 flex items-center justify-center p-3.5 border-b border-slate-100`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-105"
                  />

                  {/* Tag Badge */}
                  <span className="absolute left-2.5 top-2.5 rounded-md bg-[#f52538] px-2 py-0.5 text-[8.5px] font-bold text-white shadow-xs uppercase tracking-wider">
                    {product.tag}
                  </span>

                  {/* In Stock Badge */}
                  {product.inStock && (
                    <span className="absolute bottom-2.5 right-2.5 rounded-full bg-emerald-50/95 border border-emerald-200/90 px-2 py-0.5 text-[8.5px] font-bold text-emerald-700 shadow-2xs backdrop-blur-xs tracking-wider">
                      IN STOCK ({product.stockCount})
                    </span>
                  )}
                </div>

                {/* Product Info Section - Pinned to bottom (Flipkart style) */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className={`${isFeatured ? "text-sm" : "text-xs"} font-semibold leading-snug text-slate-900 line-clamp-2`}>
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3 flex items-end justify-between pt-2 border-t border-slate-100">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1">
                        <strong className={`${isFeatured ? "text-base" : "text-sm"} font-bold text-[#f52538] tracking-tight`}>
                          ${product.price.toFixed(2)}
                        </strong>
                        {product.originalPrice && (
                          <span className="text-[11px] line-through text-slate-400 font-normal">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        TIER 1 DEALER
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-[#f52538] hover:text-white transition active:scale-90 border border-slate-200/80 shadow-2xs"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
