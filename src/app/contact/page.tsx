"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

export default function ContactPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 lg:pb-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-24"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Inquiries
                    </motion.div>
                    <motion.h1 variants={fadeInUp} className="font-serif text-3xl sm:text-5xl md:text-7xl font-black tracking-widest uppercase text-gallery-black">
                        Get in Touch
                    </motion.h1>
                    <motion.p variants={fadeInUp} className="text-base sm:text-xl md:text-2xl font-serif italic text-gallery-charcoal/70 max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Please reach out with any questions about artworks, artists, or your collection.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gallery-charcoal/20 bg-white"
                >
                    <motion.div variants={fadeInUp} className="p-8 sm:p-12 text-center space-y-6 md:border-r border-b md:border-b-0 border-gallery-charcoal/20 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-lg sm:text-xl text-gallery-black uppercase tracking-widest">Email</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-widest uppercase hover:text-gallery-red cursor-pointer transition-colors">
                                support@artbook.com
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4">
                                Typical response time: 24h
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="p-8 sm:p-12 text-center space-y-6 md:border-r border-b md:border-b-0 border-gallery-charcoal/20 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-lg sm:text-xl text-gallery-black uppercase tracking-widest">Phone</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-widest uppercase">
                                +1 (555) 000-0000
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4 line-clamp-2">
                                Mon-Fri, 9am - 6pm EST<br />Exclusive Concierge Available
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="p-8 sm:p-12 text-center space-y-6 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-lg sm:text-xl text-gallery-black uppercase tracking-widest">Gallery</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-[0.2em] uppercase leading-relaxed">
                                123 Art Avenue<br />New York, NY 10012
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4">
                                By Appointment Only
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
