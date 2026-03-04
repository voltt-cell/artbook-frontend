import { Quote } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-gallery-cream">
            {/* Split Screen Left Side - Artistic Visual */}
            <div className="hidden lg:flex flex-col relative w-[45%] bg-gallery-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1577720580479-7d839d892015?auto=format&fit=crop&q=80&w=1600"
                        alt="Gallery Space"
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-16 pb-24 border-r border-white/20">
                    <div>
                        <Quote className="w-12 h-12 text-gallery-red mb-8 opacity-80" />
                        <h2 className="text-5xl font-serif font-black text-white leading-[1.1] mb-6 uppercase tracking-wider">
                            "The essence of all beautiful art, all great art, is gratitude."
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-gallery-red" />
                            <p className="text-xl text-white font-serif italic tracking-wide">— Friedrich Nietzsche</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Screen Right Side - Content */}
            <div className="flex flex-col w-full lg:w-[55%] relative overflow-y-auto">
                <div className="flex-1 w-full max-w-3xl mx-auto py-24 px-8 sm:px-16 flex flex-col">
                    <div className="mb-16">
                        <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal mb-8">
                            Our Story
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-serif font-black text-gallery-black uppercase tracking-widest mb-6 leading-tight">
                            About ArtBook
                        </h1>
                        <p className="text-2xl font-serif italic text-gallery-charcoal/80 leading-relaxed border-l-4 border-gallery-red pl-6">
                            ArtBook is a premier digital gallery connecting world-class artists directly with passionate collectors.
                        </p>
                    </div>

                    <div className="space-y-12 font-serif text-lg text-gallery-charcoal/90 leading-relaxed max-w-2xl">
                        <p className="first-letter:text-6xl first-letter:font-black first-letter:text-gallery-black first-letter:mr-3 first-letter:float-left first-line:uppercase first-line:tracking-widest">
                            Founded with the belief that art should be accessible without sacrificing premium curation, we built a marketplace that empowers artists to showcase their work in a dedicated, beautiful environment. We strip away the noise of traditional social media and focus purely on the art and the artist's vision.
                        </p>

                        <div className="h-px w-full bg-gallery-charcoal/20 my-12" />

                        <div>
                            <h2 className="text-3xl font-black text-gallery-black uppercase tracking-widest mb-6">
                                Our Mission
                            </h2>
                            <p>
                                To democratize fine art collection while maintaining an exclusive, highly-curated standard that respects the creator's effort and the collector's investment. We believe that every stroke tells a story, and every canvas deserves a stage that echoes its profoundness.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-gallery-charcoal/20">
                            <div>
                                <h3 className="text-4xl font-black text-gallery-black mb-2">500+</h3>
                                <p className="text-sm font-sans uppercase font-bold tracking-widest text-gallery-charcoal/60">Curated Artists</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-gallery-black mb-2">10k+</h3>
                                <p className="text-sm font-sans uppercase font-bold tracking-widest text-gallery-charcoal/60">Artworks Sold</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
