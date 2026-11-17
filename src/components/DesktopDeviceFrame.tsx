import React, { useEffect, useRef, useState } from "react";

interface DesktopDeviceFrameProps {
  children: React.ReactNode;
}

export function DesktopDeviceFrame({ children }: DesktopDeviceFrameProps) {
  // 1. Detect if current execution context is already running inside an iframe
  const isInsideIframe = typeof window !== "undefined" && window.self !== window.top;

  // 2. Detect screen width with a (min-width: 768px) media query listener
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  const [zoomLevel, setZoomLevel] = useState<number>(0.95);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Bi-directional history synchronization: Listen for outer browser back/forward buttons
  useEffect(() => {
    if (isInsideIframe || !isDesktop) return;

    const handlePopState = () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const targetPath = window.location.pathname + window.location.search;
          const iframeWin = iframeRef.current.contentWindow;
          const currentIframePath = iframeWin.location.pathname + iframeWin.location.search;

          if (targetPath !== currentIframePath) {
            iframeWin.history.replaceState(null, "", targetPath);
            iframeWin.dispatchEvent(new PopStateEvent("popstate"));
          }
        }
      } catch (err) {
        console.warn("Navigation sync warning:", err);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDesktop, isInsideIframe]);

  // Adjust zoom automatically so the iPhone frame fits comfortably in any screen height
  useEffect(() => {
    if (typeof window === "undefined") return;
    const adjustZoom = () => {
      const h = window.innerHeight;
      if (h < 950) {
        setZoomLevel(Math.max(0.75, (h - 60) / 880));
      } else {
        setZoomLevel(0.96);
      }
    };
    adjustZoom();
    window.addEventListener("resize", adjustZoom);
    return () => window.removeEventListener("resize", adjustZoom);
  }, []);

  // On Mobile Devices (< 768px) OR Inside the iframe:
  // Render children directly in full mobile mode. Zero desktop overrides!
  if (isInsideIframe || !isDesktop) {
    return <>{children}</>;
  }

  // On Desktop (>= 768px) at top level:
  // Render the Viewport Iframe Architecture hosting the fixed 393px × 852px mobile viewport
  const initialPath = typeof window !== "undefined" 
    ? window.location.pathname + window.location.search 
    : "/";

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center select-none relative overflow-hidden font-sans p-4">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.15)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Center Area: Authentic iPhone 16 Pro Mockup Chassis */}
      <main className="my-auto flex items-center justify-center z-20">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
          className="transition-transform duration-200"
        >
          {/* Outer Titanium Metallic Chassis */}
          <div className="relative rounded-[58px] p-[12px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_25px_70px_rgba(15,23,42,0.35),0_10px_25px_rgba(0,0,0,0.2)] border-2 border-slate-600/70">
            {/* Left Side Buttons (Volume Up, Volume Down, Action Button) */}
            <div className="absolute -left-[5px] top-[115px] w-[5px] h-[26px] bg-slate-700 rounded-l-md border-y border-l border-slate-600" />
            <div className="absolute -left-[5px] top-[160px] w-[5px] h-[50px] bg-slate-700 rounded-l-md border-y border-l border-slate-600" />
            <div className="absolute -left-[5px] top-[225px] w-[5px] h-[50px] bg-slate-700 rounded-l-md border-y border-l border-slate-600" />

            {/* Right Side Button (Power) */}
            <div className="absolute -right-[5px] top-[180px] w-[5px] h-[75px] bg-slate-700 rounded-r-md border-y border-r border-slate-600" />

            {/* Inner Black Bezel Frame containing the 393px × 852px Viewport */}
            <div className="relative rounded-[48px] overflow-hidden bg-white w-[393px] h-[852px] shadow-inner">
              {/* The Gold Standard Isolated Viewport Iframe */}
              <iframe
                ref={iframeRef}
                src={initialPath}
                title="Mobile App Preview"
                className="w-full h-full border-0 select-auto bg-slate-50 no-scrollbar"
                style={{
                  colorScheme: "light",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
