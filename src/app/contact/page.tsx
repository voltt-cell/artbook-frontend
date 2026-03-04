import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-gallery-cream pt-24 pb-32">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center space-y-6 mb-24">
                    <div className="inline-flex items-center border border-gallery-charcoal/20 bg-white px-4 py-1 text-[10px] uppercase font-bold tracking-widest text-gallery-charcoal">
                        Inquiries
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-black tracking-widest uppercase text-gallery-black">
                        Get in Touch
                    </h1>
                    <p className="text-xl md:text-2xl font-serif italic text-gallery-charcoal/70 max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Please reach out with any questions about artworks, artists, or your collection.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-0 border border-gallery-charcoal/20 bg-white">
                    <div className="p-12 text-center space-y-6 md:border-r border-b md:border-b-0 border-gallery-charcoal/20 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-16 h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <Mail className="h-6 w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-xl text-gallery-black uppercase tracking-widest">Email</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-widest uppercase hover:text-gallery-red cursor-pointer transition-colors">
                                support@artbook.com
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4">
                                Typical response time: 24h
                            </p>
                        </div>
                    </div>

                    <div className="p-12 text-center space-y-6 md:border-r border-b md:border-b-0 border-gallery-charcoal/20 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-16 h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <Phone className="h-6 w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-xl text-gallery-black uppercase tracking-widest">Phone</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-widest uppercase">
                                +1 (555) 000-0000
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4 line-clamp-2">
                                Mon-Fri, 9am - 6pm EST<br />Exclusive Concierge Available
                            </p>
                        </div>
                    </div>

                    <div className="p-12 text-center space-y-6 bg-white hover:bg-gallery-cream/50 transition-colors">
                        <div className="mx-auto w-16 h-16 border border-gallery-charcoal/20 flex items-center justify-center bg-white shadow-none">
                            <MapPin className="h-6 w-6 text-gallery-black" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black font-serif text-xl text-gallery-black uppercase tracking-widest">Gallery</h3>
                            <div className="h-px w-8 bg-gallery-red mx-auto my-4" />
                            <p className="text-gallery-black font-medium text-sm tracking-[0.2em] uppercase leading-relaxed">
                                123 Art Avenue<br />New York, NY 10012
                            </p>
                            <p className="text-[10px] text-gallery-charcoal/50 uppercase tracking-widest font-bold mt-4">
                                By Appointment Only
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
