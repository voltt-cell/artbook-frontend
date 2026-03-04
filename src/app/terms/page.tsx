export default function TermsPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center space-y-6 mb-20 border-b border-gallery-charcoal/20 pb-12">
                    <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Legal
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl font-black tracking-widest uppercase text-gallery-black">
                        Terms of Service
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gallery-charcoal/50">
                        Last updated: February 2026
                    </p>
                </div>

                <div className="prose prose-lg max-w-none text-gallery-charcoal space-y-12">
                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">01</span> Acceptance of Terms
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            By accessing and using ArtBook ("Platform", "we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">02</span> User Accounts
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            You must be at least 18 years old to create an account. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">03</span> Artwork Listed
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            Artists retain full copyright of their original works. ArtBook acts solely as an intermediary venue for transactions between buyers and sellers. We do not take ownership of physical pieces at any point in the transaction lifecycle.
                        </p>
                    </div>

                    <div className="h-px w-full bg-gallery-charcoal/10" />

                    <div>
                        <h2 className="text-2xl font-black font-serif text-gallery-black uppercase tracking-widest mb-6 flex items-center gap-4">
                            <span className="text-gallery-red text-sm">04</span> Auctions and Bidding
                        </h2>
                        <p className="font-serif text-lg leading-relaxed text-gallery-charcoal/80">
                            Bids placed on ArtBook are legally binding. When you submit a bid, you are committing to purchase the item at that price if you are the winning bidder.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
