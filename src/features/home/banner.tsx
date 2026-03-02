import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Banner() {
  return (
    <section className="relative bg-gallery-cream pt-12 pb-20 border-b border-gallery-charcoal/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="flex-1 w-full lg:order-1 order-2">
            <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter text-gallery-black uppercase mb-8">
              <span className="block italic font-light lowercase text-[6vw] leading-none mb-4 tracking-normal">The</span>
              Art<br />Begins<br />
              <span className="flex items-center gap-4">
                Here<span className="w-4 h-4 rounded-full bg-gallery-red inline-block mb-4"></span>
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between border-t border-gallery-charcoal/20 pt-8 mt-12 w-full">
              <div className="text-sm font-semibold tracking-widest uppercase text-gallery-charcoal w-48 leading-relaxed">
                Best Auction<br />Collections
              </div>
              <Link
                href="/artworks"
                className="flex items-center gap-4 text-gallery-red font-semibold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                Buy & Sell Art <span className="w-8 h-[1px] bg-gallery-red inline-block"></span>
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full lg:order-2 order-1 relative">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2458&q=80"
                alt="Contemporary Art"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
