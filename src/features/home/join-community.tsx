import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

function JoinCommunity() {
  return (
    <section className="py-24 bg-gallery-cream border-t border-gallery-charcoal/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-black text-gallery-black mb-6 uppercase tracking-tight">
          Join <span className="italic font-light lowercase text-3xl md:text-4xl tracking-normal text-gallery-charcoal">the</span> Community
        </h2>
        <p className="text-gallery-charcoal/70 text-lg max-w-2xl mx-auto mb-10 font-medium">
          Discover extraordinary art, connect with creators, and build your
          collection. Want to sell your art? You can open a shop anytime
          after joining.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-gallery-red text-white hover:bg-gallery-black rounded-none uppercase tracking-widest font-semibold text-xs px-10 h-12 transition-colors"
            >
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default JoinCommunity;
