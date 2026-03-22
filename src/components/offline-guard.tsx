"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

/**
 * OfflineGuard
 * Listens for browser online/offline events and shows a blocking
 * dialog whenever the network is unavailable. The dialog cannot
 * be dismissed by the user — it disappears automatically when
 * connectivity is restored.
 */
export default function OfflineGuard() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    // Initialise state from current browser status
    setIsOffline(!navigator.onLine);

    const goOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
      setReconnecting(false);
    };

    const goOnline = () => {
      setReconnecting(true);
      // Small delay so "Reconnecting…" flash is visible before closing
      setTimeout(() => {
        setIsOffline(false);
        setReconnecting(false);
      }, 1200);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline && !reconnecting) return null;

  return (
    <>
      {/* Full-screen backdrop — pointer-events block everything */}
      <div
        className="fixed inset-0 z-[9999] bg-gallery-black/70 backdrop-blur-sm"
        style={{ pointerEvents: "all" }}
        aria-modal="true"
        role="alertdialog"
        aria-labelledby="offline-title"
        aria-describedby="offline-desc"
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
        style={{ pointerEvents: "all" }}
      >
        <div className="bg-gallery-cream border border-gallery-charcoal/20 shadow-2xl w-full max-w-sm relative overflow-hidden">
          {/* Decorative top bar */}
          <div className="h-1 w-full bg-gallery-red" />

          <div className="p-8 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-white border border-gallery-charcoal/10 flex items-center justify-center shadow-sm">
                {reconnecting ? (
                  <RefreshCw className="w-7 h-7 text-gallery-red animate-spin" />
                ) : (
                  <WifiOff className="w-7 h-7 text-gallery-red" />
                )}
              </div>
              {/* Pulse ring when offline */}
              {!reconnecting && (
                <span className="absolute inset-0 border border-gallery-red/30 animate-ping rounded-none" />
              )}
            </div>

            {/* Heading */}
            <div>
              <p
                id="offline-title"
                className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-gallery-charcoal/50 mb-2"
              >
                {reconnecting ? "Restoring Connection" : "No Internet Connection"}
              </p>
              <h2 className="font-sans text-2xl font-black uppercase tracking-tight text-gallery-black">
                {reconnecting ? "Reconnecting…" : "You're Offline"}
              </h2>
            </div>

            {/* Body */}
            <p
              id="offline-desc"
              className="text-sm text-gallery-charcoal/60 leading-relaxed max-w-[260px]"
            >
              {reconnecting
                ? "Connection detected. Resuming your session shortly."
                : "Please check your internet connection. ArtBook will automatically continue once you're back online."}
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-5 py-2.5 border border-gallery-charcoal/10 bg-white text-xs uppercase tracking-widest font-bold text-gallery-charcoal/50">
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  reconnecting ? "bg-gallery-red animate-pulse" : "bg-gallery-charcoal/30"
                }`}
              />
              {reconnecting ? "Reconnecting" : "Waiting for network"}
            </div>
          </div>

          {/* Bottom hint */}
          <p className="text-center text-[10px] uppercase tracking-widest text-gallery-charcoal/30 pb-5 font-semibold">
            This dialog will close automatically
          </p>
        </div>
      </div>
    </>
  );
}
