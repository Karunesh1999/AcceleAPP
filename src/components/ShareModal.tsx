import React, { useState } from "react";
import { 
  Link2, 
  Copy, 
  Check, 
  Mail, 
  MessageSquare, 
  X,
  ExternalLink
} from "lucide-react";
import { Sheet } from "@/components/ui/Modal";
import type { Product } from "@/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function ShareModal({
  isOpen,
  onClose,
  product,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${product.name} (${product.sku}) on Accele Pro Telemetry: $${product.price.toFixed(2)}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  };

  const shareChannels = [
    {
      name: "WhatsApp",
      bgColor: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.044-2.12-.486-1.583-.588-2.614-2.193-2.693-2.299-.079-.105-.644-.858-.644-1.636 0-.777.408-1.161.552-1.32.144-.158.312-.198.416-.198.104 0 .209.002.302.007.098.005.228-.037.357.272.133.32.457 1.114.497 1.196.04.082.067.177.013.284-.055.106-.083.172-.164.269-.082.096-.173.215-.247.289-.082.083-.168.173-.072.338.096.165.426.702.915 1.137.629.56 1.159.734 1.324.816.165.083.262.07.36-.043.098-.113.42-49.531-.624.113-.133.226-.113.338-.07.113.043.722.341 1.05.503.328.162.547.243.627.378.08.135.08.784-.064 1.189z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
    },
    {
      name: "Email",
      bgColor: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200",
      icon: <Mail className="w-5 h-5" />,
      url: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
    {
      name: "SMS / Text",
      bgColor: "bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200",
      icon: <MessageSquare className="w-5 h-5" />,
      url: `sms:?&body=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      name: "X (Twitter)",
      bgColor: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      bgColor: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      bgColor: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Share Hardware"
      subtitle="EXPORT & SHARE LINK"
      className="pb-6"
    >
      <div className="space-y-4 pt-1">
        {/* Product Mini Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
          <img
            src={product.image}
            alt={product.name}
            className="h-12 w-12 rounded-xl object-contain bg-white p-1 border border-slate-200/80 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[9.5px] font-mono font-bold text-sky-700">
              MODEL: {product.sku}
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
              {product.name}
            </h4>
            <div className="text-xs font-bold text-[#f52538] mt-0.5">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Copy Link Input Bar (Exact shadcn style like user screenshot) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Copy Hardware Link
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 focus-within:border-[#f52538] focus-within:bg-white transition">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-slate-200/80 text-slate-400 shrink-0">
              <Link2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 font-mono outline-none truncate select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-2xs shrink-0 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Direct Channel Apps Grid (Inside Screen Bounds) */}
        <div className="space-y-2 pt-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Share directly to apps
          </p>
          <div className="grid grid-cols-3 gap-2">
            {shareChannels.map((ch) => (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 active:scale-95 shadow-2xs ${ch.bgColor}`}
              >
                <div className="mb-1.5">{ch.icon}</div>
                <span className="text-[11px] font-bold tracking-tight text-slate-800">
                  {ch.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-98 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Sheet>
  );
}
