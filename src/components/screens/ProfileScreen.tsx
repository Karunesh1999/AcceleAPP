import React, { useState, useRef } from "react";
import { 
  ChevronLeft, 
  ShoppingBag, 
  User, 
  Check, 
  Pencil, 
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
  MapPin,
  CheckCircle2,
  Truck,
  ExternalLink
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

  // Dedicated About Accele Electronics Page (Replaces dialog box)
  if (modalType === "about") {
    return (
      <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
          <button
            onClick={() => setModalType(null)}
            aria-label="Back to Profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">About Accele</h1>
          <div className="w-10" />
        </header>

        <div className="p-4 space-y-4">
          {/* Hero Banner Card */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-2xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#f52538] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                California Bay Engineering
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">Est. 1990</span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Accele Electronics Inc.
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Founded in Southern California, <strong>Accele Electronics Inc.</strong> is a premier manufacturer and wholesale distributor of 12-volt commercial vehicle electronics, 180° ADAS camera systems, heavy-duty linear actuators, and automotive security hardware.
              </p>
            </div>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-lg font-black text-slate-900 block">30+ Yrs</span>
              <span className="text-[11px] text-slate-500 font-medium">12V Automotive Heritage</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-lg font-black text-emerald-600 block">ISO 9001</span>
              <span className="text-[11px] text-slate-500 font-medium">Bay Quality Certified</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-lg font-black text-sky-600 block">100%</span>
              <span className="text-[11px] text-slate-500 font-medium">Bench Tested Units</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-lg font-black text-[#f52538] block">3-Year</span>
              <span className="text-[11px] text-slate-500 font-medium">Bay Advance Warranty</span>
            </div>
          </div>

          {/* Headquarters Card */}
          <div className="rounded-3xl bg-white p-4.5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 grid place-items-center">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Headquarters & Distribution Center</h3>
                <p className="text-[10px] text-slate-500">Cerritos, California 90703, USA</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Operating out of our 45,000 sq ft facility in Cerritos, California, our engineering and quality assurance teams inspect, test, and ship thousands of commercial units every week to authorized 12V installation bays across North America.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <a
                href="tel:18007881212"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold truncate">(800) 788-1212</span>
              </a>
              <a
                href="mailto:techsupport@accele.com"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                <Mail className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span className="font-bold truncate">Tech Support</span>
              </a>
            </div>
          </div>

          {/* Accele Family of Brands */}
          <div className="rounded-3xl bg-white p-4.5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900">Accele Family of Brands</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Commercial 12V</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Optix 360</p>
                  <p className="text-[10px] text-slate-500">Commercial 180° & 360° ADAS camera systems</p>
                </div>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">Vision</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Beüler</p>
                  <p className="text-[10px] text-slate-500">Heavy-duty 40A/60A relays, microswitches & sockets</p>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Relays</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Litt Works</p>
                  <p className="text-[10px] text-slate-500">Commercial utility LED lightbars & warning lamps</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Lighting</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Accent Mobile</p>
                  <p className="text-[10px] text-slate-500">Overhead flip-down monitors & commercial cab media</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">Cabin</span>
              </div>
            </div>
          </div>

          {/* Bay Support CTA */}
          <Button
            onClick={() => {
              setModalType(null);
              onOpenLiveChat();
            }}
            variant="default"
            size="sm"
            className="w-full py-3 text-xs font-bold rounded-2xl shadow-xs cursor-pointer"
          >
            <PhoneCall className="h-4 w-4 mr-2" /> Connect with Installer Support Desk
          </Button>
        </div>
      </div>
    );
  }

  // Dedicated Installer & Dealer FAQ Page (Replaces dialog box)
  if (modalType === "faq") {
    return (
      <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
          <button
            onClick={() => setModalType(null)}
            aria-label="Back to Profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Installer FAQ</h1>
          <div className="w-10" />
        </header>

        <div className="p-4 space-y-3.5">
          <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5 text-xs text-sky-900 space-y-1">
            <p className="font-bold">Bay Installation Knowledge Base</p>
            <p className="text-[11px] text-sky-700 leading-relaxed">
              Frequently asked wiring, calibration, and wholesale questions answered by California Master Technicians.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">How do I disable dynamic parking guidelines?</p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Locate the small green loop wire on the camera pigtail harness. Snip the loop while 12V power is disconnected, insulate both ends with heatshrink, and cycle the vehicle's ignition power.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">How does the 180° Doppler radar calibrate?</p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                The RVC180FM Doppler sensor is factory pre-calibrated. It auto-learns road baseline and bumper height within the first 50 feet of vehicle motion above 5 mph without requiring optical calibration mats.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">What is Tier 1 wholesale pricing?</p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Authorized dealer accounts receive an automated 10% wholesale margin discount off standard MSRP on all commercial hardware orders, with Net 30 payment terms and prioritized same-day bay dispatch.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">What are the continuous load ratings for Beüler relays?</p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Standard Beüler 5-pin SPDT relays are rated for 30A/40A continuous load, and heavy-duty series (e.g. 6100-LS) support up to 60A/80A inrush with silver tin-oxide contacts.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <p className="font-bold text-slate-900 text-xs">Where do I find vehicle-specific wiring pinouts?</p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Access the "Installation & Wiring Manuals" tab in your profile to view and download full-color PDF bay schematic sheets and wire color codes.
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              setModalType(null);
              onOpenLiveChat();
            }}
            variant="default"
            size="sm"
            className="w-full py-3 text-xs font-bold rounded-2xl shadow-xs cursor-pointer mt-2"
          >
            <HelpCircle className="h-4 w-4 mr-2" /> Ask a Bay Technician
          </Button>
        </div>
      </div>
    );
  }

  // Dedicated Warranty & RMA Policy Page (Replaces dialog box)
  if (modalType === "privacy") {
    return (
      <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
          <button
            onClick={() => setModalType(null)}
            aria-label="Back to Profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Warranty & RMA Policy</h1>
          <div className="w-10" />
        </header>

        <div className="p-4 space-y-4">
          {/* Hero Card */}
          <div className="rounded-3xl bg-emerald-50/70 border border-emerald-200/80 p-5 shadow-2xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
              Commercial Fleet Protection
            </span>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              3-Year Bay Advance Replacement
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              All commercial equipment purchased through authorized Accele accounts carries our comprehensive 3-Year Bay Advance Replacement guarantee.
            </p>
          </div>

          {/* Steps */}
          <div className="rounded-3xl bg-white p-4.5 border border-slate-200/80 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900">Rapid Advance Swap Protocol</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] grid place-items-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-bold text-slate-900">Instant Authorization</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Submit your serial number or order PO through Bay Support to generate an instant RMA authorization number.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] grid place-items-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-bold text-slate-900">Priority Cross-Shipment</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    We immediately dispatch a brand-new replacement unit before requiring the defective unit to be returned.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] grid place-items-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-bold text-slate-900">Prepaid Return Label</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    A prepaid UPS shipping label is enclosed in the box so you can return the swapped unit at zero freight expense.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setModalType(null);
              onOpenLiveChat();
            }}
            variant="default"
            size="sm"
            className="w-full py-3 text-xs font-bold rounded-2xl shadow-xs cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> Start Rapid RMA Ticket
          </Button>
        </div>
      </div>
    );
  }

  // Dedicated Dealer Terms of Service Page (Replaces dialog box)
  if (modalType === "terms") {
    return (
      <div className="min-h-full bg-slate-50 pb-28 text-slate-900 animate-in fade-in duration-200">
        <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-30 border-b border-slate-100 shadow-2xs">
          <button
            onClick={() => setModalType(null)}
            aria-label="Back to Profile"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-slate-900">Dealer Terms of Service</h1>
          <div className="w-10" />
        </header>

        <div className="p-4 space-y-4">
          <div className="rounded-3xl bg-white p-4.5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Wholesale Commercial Terms</h3>
                <p className="text-[10px] text-slate-500">Net 30 Commercial Account Agreement</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active Tier 1
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                Authorized dealers in Tier 1 status are granted Net 30 wholesale credit terms. Invoices are generated at the time of bay dispatch and are payable within 30 days via ACH, wire, or commercial credit card.
              </p>
              <p>
                All wholesale purchases are strictly intended for professional installation bay integration, fleet outfitting, or authorized dealership resale.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Account:</span>
                <span className="font-bold text-slate-900">ACC-8910-US (Apex 12V Autoworks)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credit Line:</span>
                <span className="font-bold text-emerald-600">$25,000 Net 30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax Resale Exemption:</span>
                <span className="font-bold text-slate-900">Verified (AZ-9948210-W)</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setModalType(null)}
            variant="outline"
            size="sm"
            className="w-full py-2.5 text-xs font-bold rounded-2xl text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Back to Profile
          </Button>
        </div>
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
          {/* 1. Contact Technical Support */}
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
      </div>

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
