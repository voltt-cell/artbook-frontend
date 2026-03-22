"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

/**
 * Watches for pathname / search-param changes and briefly shows
 * the ArtisticLoader between page transitions.
 *
 * Strategy:
 *  - When the path changes, immediately show the loader.
 *  - After a short delay (300 ms) we hide it, letting the new
 *    page's own skeleton loaders take over naturally.
 *  - A minimum display time of 500 ms prevents flickering on
 *    fast navigations.
 */
const MIN_SHOW_MS = 500;
const HIDE_AFTER_MS = 350; // how long after mount to start hide-timer

function PageTransitionInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef<string | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showStart = useRef<number>(0);

  const currentKey = pathname + searchParams.toString();

  useEffect(() => {
    // Skip very first render (no navigation has happened yet)
    if (prevPath.current === null) {
      prevPath.current = currentKey;
      return;
    }

    // Path actually changed — show loader
    if (prevPath.current !== currentKey) {
      prevPath.current = currentKey;

      if (hideTimer.current) clearTimeout(hideTimer.current);
      showStart.current = Date.now();
      setLoading(true);

      // After HIDE_AFTER_MS the route component is mounting; start hide
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
