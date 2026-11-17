import React, { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PRODUCTS } from "@/data/mockData";
import type { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (product: Product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hardware Catalog Search"
      description="Search products, SKUs, or replacement parts"
      className="max-w-md bg-white border-slate-200 text-slate-900 p-5"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus-within:border-[#f52538] transition">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search RVC180CTD, camera, LED..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
          <span className="text-slate-500 font-bold">Trending:</span>
          {["RVC180CTD", "CAM90", "LED8", "Actuators"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-60 overflow-y-auto no-scrollbar space-y-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              No results found for &quot;{searchTerm}&quot;
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.sku}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 rounded-lg object-contain bg-white p-1 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-mono font-bold text-sky-700">
                    {item.sku}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <span className="text-xs font-black text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
