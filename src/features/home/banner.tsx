"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { OptimizedImage } from "@/components/ui/optimized-image";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.2 } },
};

function Banner() {
  return (
    <section className="relative bg-gallery-cream border-b border-gallery-charcoal/10 overflow-hidden">
      {/* ── MOBILE / TABLET: text overlaid on image ── */}
      <div className="block lg:hidden relative">
        {/* Background image */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/3]">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2458&q=80"
            alt="Contemporary Art"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gallery-black/80 via-gallery-black/40 to-transparent" />
        </div>

        {/* Text on top of image */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.85] tracking-tighter text-white uppercase mb-6">
            <span className="block italic font-light lowercase text-2xl sm:text-3xl leading-none mb-3 tracking-normal text-white/80">The</span>
            Art<br />Begins<br />
            <span className="flex items-center gap-3">
              Here
              <motion.span
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gallery-red inline-block mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              />
            </span>
          </h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center justify-between border-t border-white/20 pt-4 mt-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/70 leading-relaxed">
              Best Auction<br />Collections
            </div>
            <Link
              href="/artworks"
              className="flex items-center gap-4 text-gallery-red font-semibold text-xs sm:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              Buy & Sell Art <span className="w-8 h-[1px] bg-gallery-red inline-block" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── DESKTOP: side-by-side layout ── */}
      <div className="hidden lg:block pt-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-row gap-12 items-center">
            {/* Text Content */}
            <motion.div
              className="flex-1 w-full"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="font-serif text-8xl xl:text-[12vw] leading-[0.85] tracking-tighter text-gallery-black uppercase mb-8">
                <span className="block italic font-light lowercase text-4xl xl:text-[6vw] leading-none mb-4 tracking-normal">The</span>
                Art<br />Begins<br />
                <span className="flex items-center gap-4">
                  Here
                  <motion.span
                    className="w-4 h-4 rounded-full bg-gallery-red inline-block mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  />
                </span>
              </h1>

              <motion.div
                className="flex flex-row gap-8 items-center justify-between border-t border-gallery-charcoal/20 pt-8 mt-12 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="text-sm font-semibold tracking-widest uppercase text-gallery-charcoal w-48 leading-relaxed">
                  Best Auction<br />Collections
                </div>
                <Link
                  href="/artworks"
                  className="flex items-center gap-4 text-gallery-red font-semibold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity whitespace-nowrap"
                >
                  Buy & Sell Art <span className="w-8 h-[1px] bg-gallery-red inline-block" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <motion.div
              className="flex-1 w-full relative"
              initial="hidden"
              animate="visible"
              variants={fadeInRight}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2458&q=80"
                  alt="Contemporary Art"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  containerClassName="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
