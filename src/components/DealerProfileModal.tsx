import React from "react";
import { 
  Award, 
  MapPin, 
  ShieldCheck, 
  LogOut 
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DealerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut?: () => void;
}

export function DealerProfileModal({
  isOpen,
  onClose,
  onSignOut,
}: DealerProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dealer Portal & Bay Account"
      description="Authorized Wholesale Partner Access"
      className="max-w-md bg-white border-slate-200 text-slate-900"
    >
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="h-12 w-12 rounded-2xl bg-[#f52538] text-white grid place-items-center font-black text-lg shadow-xs shrink-0">
            12V
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">Apex 12V Autoworks</h4>
              <Badge variant="cyan">TIER 1</Badge>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-sky-600" /> Phoenix, Arizona Bay
            </p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 font-medium">
              ACCOUNT: ACC-8910-US • NET 30 ACTIVE
            </p>
          </div>
        </div>

        {/* Tier Benefits Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[10px] tracking-wide">
              <Award className="h-3.5 w-3.5" />
              <span>WHOLESALE PRICING</span>
            </div>
            <p className="text-base font-bold tracking-tight text-slate-900 mt-1">10% Off MSRP</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Automated cart discounts</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-sky-700 font-bold text-[10px] tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ADVANCE RMA</span>
            </div>
            <p className="text-base font-bold tracking-tight text-slate-900 mt-1">Instant Swap</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Pre-shipped warranty units</p>
          </div>
        </div>

        {/* Account Details list */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Primary Contact:</span>
            <span className="font-semibold text-slate-900">Marcus Vance (Bay Tech Lead)</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Dedicated Accele Rep:</span>
            <span className="font-semibold text-sky-700">Jason Miller (Ext 214)</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>YTD Dispatched Units:</span>
            <span className="font-semibold text-slate-900">164 Systems</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Fleet Discount Code:</span>
            <span className="font-mono text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded font-bold">
              ACCELE-FLEET-10
            </span>
          </div>
        </div>

        <Button
          onClick={() => {
            if (onSignOut) onSignOut();
            onClose();
          }}
          variant="outline"
          className="w-full text-xs text-slate-600 hover:text-slate-900"
        >
          <LogOut className="h-3.5 w-3.5 mr-2" /> Log out of Bay Account
        </Button>
      </div>
    </Modal>
  );
}
