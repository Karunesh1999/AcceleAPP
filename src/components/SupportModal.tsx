import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft,
  X,
  PhoneCall, 
  Send, 
  Bot, 
  FileCheck, 
  Mail,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { playAlertBeep } from "@/lib/utils";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export function SupportModal({
  isOpen,
  onClose,
  soundEnabled,
}: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "rma">("chat");
  const [messages, setMessages] = useState<Array<{ sender: "tech" | "user"; text: string; time: string }>>([
    {
      sender: "tech",
      text: "Accele Bay Support online. I can assist with RVC180FM radar calibration, wire harness pinouts, or 12V reverse triggers. What are you installing today?",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rmaSubmitted, setRmaSubmitted] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const predefinedPrompts = [
    "How to calibrate 180° radar?",
    "Where is the reverse wire?",
    "How to turn off parking guidelines?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: query,
      time: "Just now"
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    if (soundEnabled) {
      playAlertBeep("click");
    }

    setTimeout(() => {
      let reply = "Our technical manual specifies mounting at 18-36 inches height centered on the bumper. The radar self-calibrates within the first 50 feet of vehicle movement.";
      const lower = query.toLowerCase();

      if (lower.includes("reverse")) {
        reply = "Connect the red wire on the camera harness to +12V positive at the reverse light socket or reverse signal pin at the BCM/tail light junction box.";
      } else if (lower.includes("guideline") || lower.includes("lines")) {
        reply = "To remove the parking guidelines, locate the small green loop wire on the camera pigtail. Snip the loop while power is disconnected, tape the ends, and cycle vehicle ignition.";
      } else if (lower.includes("radar") || lower.includes("calibrate")) {
        reply = "The RVC180FM Doppler radar is factory pre-calibrated. Ensure the camera face is perpendicular to the ground with a clear line of sight (no metal brackets blocking the plastic radar lens).";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "tech",
          text: reply,
          time: "Just now"
        }
      ]);
      setIsTyping(false);
      if (soundEnabled) {
        playAlertBeep("success");
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900 animate-in fade-in duration-200">
      {/* Top Header App Bar (Native Full-Screen Navigation) */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition cursor-pointer shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 truncate">
              Bay Technical Support Desk
            </h1>
            <p className="text-[10px] text-slate-500 truncate">
              Instant installer dispatch & warranty assistance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition cursor-pointer shrink-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Full View Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-w-lg mx-auto w-full pb-8 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-200 shrink-0">
          {[
            { id: "chat", label: "Live Tech Chat" },
            { id: "rma", label: "Warranty / RMA" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#f52538] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            {/* Tech Status Pill */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-800">Master Tech Tyler Online</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Bay #4 (California HQ)</span>
            </div>

            {/* Chat scroll area */}
            <div
              ref={chatScrollRef}
              className="flex-1 min-h-[280px] max-h-[380px] overflow-y-auto no-scrollbar space-y-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "tech" && (
                    <div className="h-7 w-7 rounded-lg bg-sky-100 text-sky-700 grid place-items-center shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#f52538] text-white shadow-2xs"
                        : "bg-slate-50 text-slate-800 border border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Tyler is typing...</span>
                </div>
              )}
            </div>

            {/* Quick preset question pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
              {predefinedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 active:scale-95 transition cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask technician a question..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f52538] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="h-10 w-10 rounded-xl bg-[#f52538] hover:bg-[#d91f30] text-white grid place-items-center active:scale-95 transition shadow-xs cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "rma" && (
          <div className="space-y-3 text-xs flex-1">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs tracking-wide">
                <FileCheck className="h-4 w-4" />
                <span>3-YEAR BAY WARRANTY PROTECTION</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-xs">
                All Accele pro equipment purchased through authorized accounts carries advance replacement protection. Need an immediate replacement unit dispatched?
              </p>
              {rmaSubmitted ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>RMA ticket created! RMA #RMA-849201 assigned.</span>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setRmaSubmitted(true);
                    if (soundEnabled) playAlertBeep("success");
                  }}
                  variant="default"
                  size="sm"
                  className="w-full text-xs font-bold shadow-xs cursor-pointer"
                >
                  Start Rapid RMA Ticket
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Direct Phone & Email Dial Section */}
        <div className="pt-3 border-t border-slate-200 space-y-2 shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Direct Dispatch Channels
          </p>
          <a
            href="tel:18007881212,170"
            className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-50 transition border border-slate-200 text-xs font-bold text-slate-900 shadow-2xs"
          >
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 grid place-items-center shrink-0">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <span className="text-slate-900 block font-bold text-xs">Call Bay Tech Desk</span>
                <span className="text-[11px] text-slate-500 font-normal">(800) 788-1212 Ext. 170</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase font-mono font-bold tracking-wider">
              Toll-Free
            </span>
          </a>

          <a
            href="mailto:Techsupport@accele.com"
            className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-slate-50 transition border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
          >
            <div className="flex items-center gap-3 text-sky-600">
              <div className="h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 grid place-items-center shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="text-slate-900 block font-bold text-xs">Email Tech Support</span>
                <span className="text-[11px] text-slate-500 font-normal">Techsupport@accele.com</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Cerritos, CA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
