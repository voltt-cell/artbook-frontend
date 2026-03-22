"use client";

import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

export default function FAQPage() {
    const faqs = [
        {
            q: "How do I purchase artwork on ArtBook?",
            a: "You can purchase artwork either instantly at a fixed price, or by bidding in an active auction. Ensure your Stripe payment details are set up correctly upon checkout."
        },
        {
            q: "How do I become a verified artist?",
            a: "Navigate to the 'Apply for Shop' link in your profile dropdown when logged in. Our curation team will review your application and portfolio within 24 hours."
        },
        {
            q: "What is the return policy?",
            a: "We offer a strict 7-day authenticity guarantee. If the physical piece does not match the description or certification of authenticity, please contact support for a mediated return."
        },
        {
            q: "How does shipping work?",
            a: "Shipping is handled directly by the artists. When purchasing a piece, the shipping cost and estimated delivery time will be calculated based on the artist's studio location."
        }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-24"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Information
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-5xl md:text-7xl font-black tracking-widest uppercase text-gallery-black">
                        FAQ
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-base sm:text-xl md:text-2xl font-serif italic text-gallery-charcoal/70 max-w-2xl mx-auto">
                        Frequently asked questions about buying and selling on the platform.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="space-y-0 border border-gallery-charcoal/20 bg-white"
                >
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="p-6 sm:p-8 md:p-12 border-b border-gallery-charcoal/20 last:border-b-0 hover:bg-gallery-cream/30 transition-colors"
                        >
                            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-gallery-black mb-4 sm:mb-6 uppercase tracking-widest">
                                {faq.q}
                            </h3>
                            <div className="h-px w-12 bg-gallery-red mb-4 sm:mb-6" />
                            <p className="text-gallery-charcoal/80 leading-relaxed font-serif text-base sm:text-lg">
                                {faq.a}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
