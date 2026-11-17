import React, { useState } from "react";
import { 
  PhoneCall, 
  Send, 
  Bot, 
  FileCheck, 
  Mail
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bay Technical Support Desk"
      description="Instant installer dispatch & warranty assistance"
      className="max-w-md p-5 bg-white border-slate-200 text-slate-900"
    >
      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-4">
        {[
          { id: "chat", label: "Live Tech Chat" },
          { id: "rma", label: "Warranty / RMA" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
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
        <div className="space-y-3">
          {/* Tech Status Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-800">Master Tech Tyler Online</span>
            </div>
            <span className="text-[10px] text-slate-500">Bay #4 (California HQ)</span>
          </div>

          {/* Chat scroll area */}
          <div className="h-56 overflow-y-auto no-scrollbar space-y-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "tech" && (
                  <div className="h-6 w-6 rounded-lg bg-sky-100 text-sky-700 grid place-items-center shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#f52538] text-white shadow-2xs"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs"
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
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {predefinedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-200"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask technician a question..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f52538]"
            />
            <button
              onClick={() => handleSend()}
              className="h-10 w-10 rounded-xl bg-[#f52538] text-white grid place-items-center active:scale-95 transition shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === "rma" && (
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-black text-xs">
              <FileCheck className="h-4 w-4" />
              <span>3-YEAR BAY WARRANTY PROTECTION</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              All Accele pro equipment purchased through authorized accounts carries advance replacement protection. Need an immediate replacement unit dispatched?
            </p>
            <Button variant="default" size="sm" className="w-full text-xs font-black shadow-xs">
              Start Rapid RMA Ticket
            </Button>
          </div>
        </div>
      )}

      {/* Direct Phone & Email Dial Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
        <a
          href="tel:18007881212,170"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200 text-xs font-bold text-slate-900"
        >
          <div className="flex items-center gap-3 text-emerald-600">
            <PhoneCall className="h-4 w-4" />
            <span className="text-slate-900">Call Bay Tech Desk: (800) 788-1212 Ext. 170</span>
          </div>
          <span className="text-[10px] text-sky-700 uppercase font-mono font-bold">Toll-Free</span>
        </a>
        <a
          href="mailto:Techsupport@accele.com"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition border border-slate-200 text-[11px] font-semibold text-slate-700"
        >
          <div className="flex items-center gap-2.5 text-sky-600">
            <Mail className="h-4 w-4" />
            <span>Techsupport@accele.com</span>
          </div>
          <span className="text-[10px] text-slate-500">Cerritos, CA</span>
        </a>
      </div>
    </Modal>
  );
}
