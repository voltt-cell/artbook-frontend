export default function PrivacyPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center space-y-6 mb-20 border-b border-gallery-charcoal/20 pb-12">
                    <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Legal
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl font-black tracking-widest uppercase text-gallery-black">
                        Privacy Policy
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50">
                        Last updated: February 2026
                    </p>
                </div>

                <div className="prose prose-lg max-w-none text-gallery-charcoal space-y-12">
                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">01</span> Information We Collect
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            We collect information you provide directly to us when you create an account, update your profile, list artwork, place a bid, or communicate with us. This may include your name, email address, physical address, and payment information (processed securely through Stripe).
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">02</span> How We Use Your Information
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            We use the information we collect to operate our platform, process transactions, communicate with you regarding your orders or bids, and to personalize your experience on ArtBook.
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">03</span> Information Sharing
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            We do not sell your personal data. We share necessary shipping information (name, address) between the artist and the buyer solely for the purpose of fulfilling an order.
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">04</span> Data Security
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
