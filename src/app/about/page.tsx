"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

export default function AboutPage() {
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-gallery-cream">
            {/* Split Screen Left Side - Artistic Visual */}
            <div className="relative w-full lg:w-[45%] min-h-[300px] sm:min-h-[400px] lg:min-h-0 bg-gallery-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/gallery_about.jpg"
                        alt="Gallery Space"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-8 sm:p-12 lg:p-16 pb-12 sm:pb-16 lg:pb-24 lg:border-r border-white/20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <Quote className="w-8 h-8 sm:w-12 sm:h-12 text-gallery-red mb-6 sm:mb-8 opacity-80" />
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-white leading-[1.1] mb-4 sm:mb-6 uppercase tracking-wider">
                            &quot;The essence of all beautiful art, all great art, is gratitude.&quot;
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-8 sm:w-12 h-1 bg-gallery-red" />
                            <p className="text-base sm:text-xl text-white font-serif italic tracking-wide">— Friedrich Nietzsche</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Split Screen Right Side - Content */}
            <div className="flex flex-col w-full lg:w-[55%] relative overflow-y-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex-1 w-full max-w-3xl mx-auto py-12 sm:py-16 lg:py-24 px-6 sm:px-10 lg:px-16 flex flex-col"
                >
                    <motion.div variants={fadeInUp} className="mb-10 sm:mb-16">
                        <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal mb-6 sm:mb-8">
                            Our Story
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-gallery-black uppercase tracking-widest mb-4 sm:mb-6 leading-tight">
                            About ArtBook
                        </h1>
                        <p className="text-lg sm:text-2xl font-serif italic text-gallery-charcoal/80 leading-relaxed border-l-4 border-gallery-red pl-4 sm:pl-6">
                            ArtBook is a premier digital gallery connecting world-class artists directly with passionate collectors.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="space-y-10 sm:space-y-12 font-serif text-base sm:text-lg text-gallery-charcoal/90 leading-relaxed max-w-2xl">
                        <p className="first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:text-gallery-black first-letter:mr-3 first-letter:float-left first-line:uppercase first-line:tracking-widest">
                            Founded with the belief that art should be accessible without sacrificing premium curation, we built a marketplace that empowers artists to showcase their work in a dedicated, beautiful environment. We strip away the noise of traditional social media and focus purely on the art and the artist&apos;s vision.
                        </p>

                        <div className="h-px w-full bg-gallery-charcoal/20 my-10 sm:my-12" />

                        <motion.div variants={fadeInUp}>
                            <h2 className="text-2xl sm:text-3xl font-black text-gallery-black uppercase tracking-widest mb-4 sm:mb-6">
                                Our Mission
                            </h2>
                            <p>
                                To democratize fine art collection while maintaining an exclusive, highly-curated standard that respects the creator&apos;s effort and the collector&apos;s investment. We believe that every stroke tells a story, and every canvas deserves a stage that echoes its profoundness.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-2 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gallery-charcoal/20"
                        >
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-black text-gallery-black mb-2">500+</h3>
                                <p className="text-xs sm:text-sm font-sans uppercase font-bold tracking-widest text-gallery-charcoal/60">Curated Artists</p>
                            </div>
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-black text-gallery-black mb-2">10k+</h3>
                                <p className="text-xs sm:text-sm font-sans uppercase font-bold tracking-widest text-gallery-charcoal/60">Artworks Sold</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
