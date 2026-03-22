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
        title: "Information We Collect",
        text: "We collect information you provide directly to us when you create an account, update your profile, list artwork, place a bid, or communicate with us. This may include your name, email address, physical address, and payment information (processed securely through Stripe).",
    },
    {
        num: "02",
        title: "How We Use Your Information",
        text: "We use the information we collect to operate our platform, process transactions, communicate with you regarding your orders or bids, and to personalize your experience on ArtBook.",
    },
    {
        num: "03",
        title: "Information Sharing",
        text: "We do not sell your personal data. We share necessary shipping information (name, address) between the artist and the buyer solely for the purpose of fulfilling an order.",
    },
    {
        num: "04",
        title: "Data Security",
        text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
    },
];

export default function PrivacyPage() {
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
                        Privacy Policy
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
