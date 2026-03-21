"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gallery-cream px-4 text-center">
      <h2 className="font-playfair text-5xl md:text-7xl font-black text-gallery-black mb-6 uppercase leading-tight">
        An Experiment<br />Gone Awry
      </h2>
      <p className="text-gallery-charcoal max-w-lg mb-10 text-lg">
        We encountered an unexpected error while preparing this canvas. Rest assured, our restoration team has been notified.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="rounded-none border border-gallery-charcoal bg-gallery-charcoal text-white hover:bg-gallery-red hover:text-white uppercase tracking-widest px-8 h-12"
        >
          Attempt Restore
        </Button>
        <Button 
          asChild
          variant="outline"
          className="rounded-none border border-gallery-charcoal text-gallery-charcoal hover:bg-gallery-charcoal hover:text-white uppercase tracking-widest px-8 h-12"
        >
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
