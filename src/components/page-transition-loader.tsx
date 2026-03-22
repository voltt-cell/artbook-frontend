"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

/**
 * Watches for pathname / search-param changes and briefly shows
 * the ArtisticLoader between page transitions.
 *
 * Shows on:
 *  - Initial page load / refresh
 *  - Every client-side route change
 */
const MIN_SHOW_MS = 600;
const HIDE_AFTER_MS = 1000;

function PageTransitionInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true); // start true for initial load
  const prevPath = useRef<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showStart = useRef<number>(Date.now());

  const currentKey = pathname + searchParams.toString();

  useEffect(() => {
    // Initial load — show loader then hide after minimum time
    if (prevPath.current === null) {
      prevPath.current = currentKey;
      showStart.current = Date.now();

      hideTimer.current = setTimeout(() => {
        const elapsed = Date.now() - showStart.current;
        const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
        setTimeout(() => setLoading(false), remaining);
      }, HIDE_AFTER_MS);
      return;
    }

    // Path actually changed — show loader
    if (prevPath.current !== currentKey) {
      prevPath.current = currentKey;

      if (hideTimer.current) clearTimeout(hideTimer.current);
      showStart.current = Date.now();
      setLoading(true);

      hideTimer.current = setTimeout(() => {
        const elapsed = Date.now() - showStart.current;
        const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
        setTimeout(() => setLoading(false), remaining);
      }, HIDE_AFTER_MS);
    }

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  if (!loading) return null;

  return <ArtisticLoader fullScreen />;
}

/**
 * useSearchParams requires Suspense in Next.js App Router.
 */
export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionInner />
    </Suspense>
  );
}
