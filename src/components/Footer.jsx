import React from 'react';
import { PartyLogo, NAV_ITEMS } from '@/components/Header';

export default function Footer() {
    return (
        <footer className="bg-foreground text-background">
            <div className="tricolor-bar h-1 w-full" />
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                            अं
                        </span>
                        <span className="font-display text-lg">आंदोलन जीवि जनता पार्टी</span>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-background/70">
                        जनता की आवाज़ को सत्ता तक पहुँचाने का जन-आंदोलन। पारदर्शिता, जवाबदेही और जन-भागीदारी — यही हमारी प्रतिबद्धता है।
                    </p>
                </div>
                <div>
                    <h3 className="mb-4 font-display text-base text-background/90">त्वरित लिंक</h3>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href}>
                                <a href={item.href} className="text-background/70 transition-colors hover:text-primary">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a href="#join" className="font-semibold text-primary transition-colors hover:text-background">
                                हमसे जुड़ें
                            </a>
                        </li>
                        <li>
                            <a href="/admin" className="text-background/70 transition-colors hover:text-primary">
                                व्यवस्थापक पैनल
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 font-display text-base text-background/90">संपर्क</h3>
                    <ul className="space-y-2 text-sm text-background/70">
                        <li>केन्द्रीय कार्यालय: नई दिल्ली, भारत</li>
                        <li>फोन: +91 98XXXXXX00</li>
                        <li>ईमेल: sampark@andolanjivijantaparty.in</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-background/15">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-background/60 sm:flex-row sm:px-6">
                    <p>© {new Date().getFullYear()} आंदोलन जीवि जनता पार्टी। सर्वाधिकार सुरक्षित।</p>
                    <p>जनता की आवाज़ • जनता का आंदोलन • जनता का हक़</p>
                </div>
            </div>
        </footer>
    );
}
