"use client";

import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const sections = [
    {
        num: "01",
        title: "Acceptance of Terms",
        text: 'By accessing and using ArtBook ("Platform", "we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    },
    {
        num: "02",
        title: "User Accounts",
        text: "You must be at least 18 years old to create an account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.",
    },
    {
        num: "03",
        title: "Artwork Listed",
        text: "Artists retain full copyright of their original works. ArtBook acts solely as an intermediary venue for transactions between buyers and sellers. We do not take ownership of physical pieces at any point in the transaction lifecycle.",
    },
    {
        num: "04",
        title: "Auctions and Bidding",
        text: "Bids placed on ArtBook are legally binding. When you submit a bid, you are committing to purchase the item at that price if you are the winning bidder.",
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20 border-b border-gallery-charcoal/20 pb-8 sm:pb-12"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Legal
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-widest uppercase text-gallery-black">
                        Terms of Service
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50">
                        Last updated: February 2026
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="prose prose-lg max-w-none text-gallery-charcoal space-y-8 sm:space-y-12"
                >
                    {sections.map((section, i) => (
                        <motion.div key={section.num} variants={fadeInUp}>
                            <h2 className="text-xl sm:text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                                <span className="text-gallery-red text-xs sm:text-sm">{section.num}</span> {section.title}
                            </h2>
                            <p className="font-serif text-base sm:text-lg leading-relaxed text-gallery-charcoal/80">
                                {section.text}
                            </p>
                            {i < sections.length - 1 && (
                                <div className="h-px w-full bg-gallery-charcoal/10 mt-8 sm:mt-12" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
