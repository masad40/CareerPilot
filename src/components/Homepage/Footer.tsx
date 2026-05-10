"use client";
import React from "react";

const Footer = () => {
    return (
        <footer className="relative bg-background pt-20 pb-10 border-t border-card-border overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                {/* Brand Column */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/Gemini_Generated_Image_kk8hwqkk8hwqkk8h.png"
                            alt="CareerPilot"
                            className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-bold text-2xl text-foreground tracking-tight">CareerPilot</span>
                    </div>
                    <p className="text-muted leading-relaxed max-w-sm">
                        Empowering the next generation of global talent through hyper-personalized AI career intelligence.
                    </p>
                </div>

                <div className="hidden md:block md:col-span-2" />

                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-foreground mb-6 text-lg">Platform</h4>
                        <ul className="space-y-4">
                            {['Roadmaps', 'AI Mentor', 'Interview Prep', 'Skill Graph'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted hover:text-primary transition-colors text-sm font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-6 text-lg">Company</h4>
                        <ul className="space-y-4">
                            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-muted hover:text-primary transition-colors text-sm font-medium">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground mb-6 text-lg">Social</h4>
                        <div className="flex gap-4">
                            {[
                                "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                                "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            ].map((d, i) => (
                                <button key={i} className="w-10 h-10 rounded-full bg-card-bg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-all border border-card-border hover:border-primary/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-muted text-sm">© 2025 CareerPilot. All rights reserved.</p>
                <div className="flex gap-8">
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                        <a key={item} href="#" className="text-muted hover:text-foreground text-sm transition-colors">{item}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
