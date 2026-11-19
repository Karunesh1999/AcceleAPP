import React, { useState, useRef } from "react";
import { 
  ChevronLeft, 
  ShoppingBag, 
  User, 
  Check, 
  Pencil, 
  Package, 
  Phone, 
  Info, 
  HelpCircle, 
  Lock, 
  FileText, 
  ChevronRight,
  X,
  PhoneCall,
  Mail,
  ShieldCheck,
  Building,
  Award,
  Camera,
  Trash2,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InstallationManualModal } from "@/components/InstallationManualModal";
import { playAlertBeep } from "@/lib/utils";

interface ProfileScreenProps {
  onBack: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenLiveChat: () => void;
  onOpenOrders: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSignOut?: () => void;
}

export function ProfileScreen({
  onBack,
  onOpenCart,
  cartCount,
  onOpenLiveChat,
  onOpenOrders,
  soundEnabled,
  onToggleSound,
  onSignOut,
}: ProfileScreenProps) {
  const [modalType, setModalType] = useState<"about" | "faq" | "privacy" | "terms" | "manuals" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dealerName, setDealerName] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accele_dealer_name") || "Marcus Vance";
      } catch {
        return "Marcus Vance";
      }
    }
    return "Marcus Vance";
  });
  const [dealerPhone, setDealerPhone] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accele_dealer_phone") || "+1 (555) 382-9910";
      } catch {
        return "+1 (555) 382-9910";
      }
    }
    return "+1 (555) 382-9910";
  });
  const [dealerAddress, setDealerAddress] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accele_dealer_address") || "1420 W Broadway Rd, Suite 104, Phoenix, AZ 85041";
      } catch {
        return "1420 W Broadway Rd, Suite 104, Phoenix, AZ 85041";
      }
    }
    return "1420 W Broadway Rd, Suite 104, Phoenix, AZ 85041";
  });
  const [dealerCompany, setDealerCompany] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accele_dealer_company") || "Apex 12V Autoworks";
      } catch {
        return "Apex 12V Autoworks";
      }
    }
    return "Apex 12V Autoworks";
  });
  const dealerEmail = "marcus.vance@apex12v.com"; // Account email: strictly locked
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accele_dealer_avatar");
      } catch {
        return null;
      }
    }
    return null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      try {
        localStorage.setItem("accele_dealer_avatar", dataUrl);
      } catch (err) {
        console.warn("Could not save to localStorage:", err);
      }
      if (soundEnabled) playAlertBeep("success");
      showToast("Profile picture updated!");
    };
    reader.readAsDataURL(file);

    // reset input value so re-selecting same image works
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    try {
      localStorage.removeItem("accele_dealer_avatar");
    } catch (err) {
      console.warn("Could not remove from localStorage:", err);
    }
    if (soundEnabled) playAlertBeep("click");
    showToast("Profile picture removed.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("accele_dealer_name", dealerName);
      localStorage.setItem("accele_dealer_phone", dealerPhone);
      localStorage.setItem("accele_dealer_address", dealerAddress);
      localStorage.setItem("accele_dealer_company", dealerCompany);
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
    setIsEditing(false);
    if (soundEnabled) playAlertBeep("success");
    showToast("Profile details updated successfully!");
  };

  // Dedicated Edit Profile Screen (Replaces cramped dialog box)
  if (isEditing) {
    return (
      <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-sm rounded-xl bg-slate-900/95 text-white p-3 text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Top Header with Back Button */}
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
          <button
            onClick={() => setIsEditing(false)}
            aria-label="Back to Profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h1 className="text-base font-bold text-slate-900">Edit Profile</h1>

          <div className="w-10" />
        </header>

        {/* Edit Form */}
        <form onSubmit={handleSaveProfile} className="p-4 space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-2xs">
            <div
              onClick={handleAvatarClick}
              className="relative h-16 w-16 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shrink-0 cursor-pointer group flex items-center justify-center text-slate-600 shadow-2xs hover:border-[#f52538] transition-all"
              title="Click to select profile picture"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 stroke-[1.5]" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Camera className="h-5 w-5 drop-shadow-sm" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 text-sm">Profile Photo</p>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="text-xs font-bold text-[#f52538] hover:underline cursor-pointer"
                >
                  Upload Picture
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs font-medium text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
          </div>

          {/* Form Fields Card */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-2xs space-y-4 text-xs">
            {/* 1. Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name / Technician Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:border-[#f52538] focus:ring-1 focus:ring-[#f52538] bg-slate-50/50 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* 2. Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={dealerPhone}
                  onChange={(e) => setDealerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:border-[#f52538] focus:ring-1 focus:ring-[#f52538] bg-slate-50/50 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            {/* 3. Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Bay / Shop Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  value={dealerAddress}
                  onChange={(e) => setDealerAddress(e.target.value)}
                  rows={2}
                  placeholder="Street, Suite, City, State, ZIP"
                  className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:border-[#f52538] focus:ring-1 focus:ring-[#f52538] bg-slate-50/50 focus:bg-white transition resize-none"
                  required
                />
              </div>
            </div>

            {/* 4. Company Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Shop / Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={dealerCompany}
                  onChange={(e) => setDealerCompany(e.target.value)}
                  placeholder="Business or shop name"
                  className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-3 text-xs text-slate-900 focus:outline-none focus:border-[#f52538] focus:ring-1 focus:ring-[#f52538] bg-slate-50/50 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 5. Email Address - STRICTLY LOCKED */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Wholesale Account Email
                </label>
                <span className="flex items-center gap-1 text-[9.5px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                  <Lock className="h-3 w-3 text-slate-500" />
                  Locked
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={dealerEmail}
                  readOnly
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/90 py-2.5 pl-10 pr-10 text-xs text-slate-500 cursor-not-allowed select-none font-mono"
                />
                <Lock className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                Email address is locked and tied to your wholesale dealer account credentials.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full text-xs font-bold py-3 shadow-md active:scale-98"
            >
              <Check className="h-4 w-4 mr-1.5" /> Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="w-full text-xs font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 pb-28 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-sm rounded-xl bg-slate-900/95 text-white p-3 text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Top Header: (<) Profile (ShoppingBag with red dot) */}
      <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h1 className="text-base font-bold text-slate-900">Profile</h1>

        <button
          onClick={onOpenCart}
          aria-label="View Cart"
          className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 h-3 min-w-3 px-1 rounded-full bg-rose-500 text-[8px] font-black text-white flex items-center justify-center ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* Top Profile Card */}
        <div className="rounded-3xl bg-white p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar with image upload & verified green badge */}
            <div
              onClick={handleAvatarClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleAvatarClick()}
              title="Click to select profile picture"
              className="relative shrink-0 cursor-pointer group"
            >
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border-2 border-slate-200/80 overflow-hidden group-hover:border-[#f52538] transition-all relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={dealerName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 stroke-[1.5] text-slate-600 group-hover:text-slate-900 transition-colors" />
                )}

                {/* Camera icon hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="h-5 w-5 drop-shadow-sm" />
                </div>
              </div>

              {/* Verified green check badge */}
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 text-white grid place-items-center ring-2 ring-white shadow-2xs">
                <Check className="h-3 w-3 stroke-[2.5]" />
              </span>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </div>

            {/* Name only */}
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {dealerName}
              </h2>
            </div>
          </div>

          {/* Edit pencil button */}
          <button
            onClick={() => setIsEditing(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition shrink-0 ml-2"
            title="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Menu Items Card (Clean List) */}
        <div className="rounded-3xl bg-white p-2 border border-slate-200/80 shadow-2xs space-y-0.5 divide-y divide-slate-100">
          {/* 1. My Orders */}
          <button
            onClick={onOpenOrders}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Package className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    My Orders
                  </span>
                  <span className="bg-rose-50 text-[#f52538] border border-rose-200 text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    2 IN TRANSIT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-normal">
                  Track shipments & POs
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 2. Contact Technical Support */}
          <button
            onClick={onOpenLiveChat}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Phone className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900">
                  Contact Technical Support
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Call, live chat, or email us
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 3. Installation & Wiring Manuals */}
          <button
            onClick={() => setModalType("manuals")}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <FileText className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Installation & Wiring Manuals
                  </span>
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    5 GUIDES
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pinouts, wire color codes & PDF bay sheets
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 3. About Us */}
          <button
            onClick={() => setModalType("about")}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Info className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900">
                  About Accele Electronics
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  30+ years of 12V automotive engineering
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 4. Frequently Asked Questions */}
          <button
            onClick={() => setModalType("faq")}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <HelpCircle className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900">
                  Frequently Asked Questions
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Harness pinouts, radar setup & calibration
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 5. Privacy & Warranty Policy */}
          <button
            onClick={() => setModalType("privacy")}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <Lock className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900">
                  Warranty & RMA Policy
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  3-Year Bay protection & advance swap
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>

          {/* 6. Terms of Service */}
          <button
            onClick={() => setModalType("terms")}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <FileText className="h-5 w-5 stroke-[1.75]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900">
                  Dealer Terms of Service
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Net 30 wholesale account agreement
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
          </button>
        </div>

        {/* Sign Out Button */}
        <div className="text-center pt-2">
          <button
            onClick={onSignOut}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            Sign Out Dealer Session
          </button>
        </div>
      </div>

      {/* About Accele Modal */}
      {modalType === "about" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">About Accele Electronics</h3>
              <button
                onClick={() => setModalType(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Founded in Southern California, <strong>Accele Electronics Inc.</strong> is a premier manufacturer and wholesale supplier of 12-volt commercial vehicle electronics, 180° ADAS camera systems, actuators, and security hardware.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>Headquarters: Cerritos, California</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>ISO 9001:2015 Bay Quality Certified</span>
              </div>
            </div>
            <Button
              onClick={() => setModalType(null)}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {modalType === "faq" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Installer FAQ</h3>
              <button
                onClick={() => setModalType(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">How do I turn off dynamic parking guidelines?</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Locate the small green loop wire on the camera pigtail harness. Snip the loop while 12V power is disconnected, insulate the ends, and cycle ignition.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">How does the 180° Doppler radar calibrate?</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  The RVC180FM Doppler sensor is factory pre-calibrated. It auto-learns road baseline within the first 50 feet of vehicle motion above 5 mph.
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900">What is Tier 1 wholesale pricing?</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Authorized dealer accounts receive an automated 10% discount off standard MSRP on all commercial hardware orders.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setModalType(null)}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Close FAQ
            </Button>
          </div>
        </div>
      )}

      {/* Warranty / Privacy Modal */}
      {modalType === "privacy" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">3-Year Bay Warranty Protection</h3>
              <button
                onClick={() => setModalType(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All commercial equipment purchased through authorized Accele accounts carries our comprehensive 3-Year Bay Advance Replacement guarantee. If a unit fails in the field, we cross-ship a replacement before receiving the return.
            </p>
            <Button
              onClick={() => {
                setModalType(null);
                onOpenLiveChat();
              }}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Start Rapid RMA Ticket
            </Button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {modalType === "terms" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-2xl text-slate-900 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Dealer Net 30 Terms</h3>
              <button
                onClick={() => setModalType(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized dealers in Tier 1 status are granted Net 30 wholesale credit terms. Invoices are generated at the time of bay dispatch and are payable within 30 days via ACH, wire, or commercial card.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700">
              Active Account: ACC-8910-US (Apex 12V Autoworks)
            </div>
            <Button
              onClick={() => setModalType(null)}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold"
            >
              Close Terms
            </Button>
          </div>
        </div>
      )}

      {/* Installation & Wiring Manuals Hub */}
      <InstallationManualModal
        isOpen={modalType === "manuals"}
        onClose={() => setModalType(null)}
        initialCategory="cameras"
        onContactSupport={() => {
          setModalType(null);
          onOpenLiveChat();
        }}
      />
    </div>
  );
}
