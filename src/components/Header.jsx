import React, { useEffect, useState } from 'react';
import { Menu, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export const NAV_ITEMS = [
    { href: '#home', label: 'मुख्य पृष्ठ' },
    { href: '#about', label: 'हमारे बारे में' },
    { href: '#purpose', label: 'उद्देश्य' },
    { href: '#ideology', label: 'विचारधारा' },
    { href: '#issues', label: 'मुद्दे' },
    { href: '#voice', label: 'जनता की आवाज़' },
    { href: '#news', label: 'समाचार' },
    { href: '#contact', label: 'संपर्क' },
];

export function PartyLogo({ compact = false }) {
    return (
        <a href="#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground ring-2 ring-accent ring-offset-2 ring-offset-background">
                अं
            </span>
            {!compact && (
                <span className="leading-tight">
                    <span className="block font-display text-base text-foreground sm:text-lg">आंदोलन जीवि जनता पार्टी</span>
                    <span className="block text-xs font-semibold tracking-wide text-primary">जनता की आवाज़ • जनता का आंदोलन</span>
                </span>
            )}
        </a>
    );
}

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
                scrolled ? 'border-b border-border bg-background/95 shadow-sm backdrop-blur' : 'bg-background/80 backdrop-blur'
            }`}
        >
            <div className="tricolor-bar h-1 w-full" />
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                <PartyLogo />
                <nav className="hidden items-center gap-1 lg:flex" aria-label="मुख्य नेविगेशन">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Button asChild className="hidden font-semibold sm:inline-flex">
                        <a href="#join">
                            <Users className="mr-2 h-4 w-4" />
                            हमसे जुड़ें
                        </a>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden" aria-label="मेनू खोलें">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 bg-background">
                            <div className="mt-6 flex flex-col gap-1">
                                {NAV_ITEMS.map((item) => (
                                    <SheetClose asChild key={item.href}>
                                        <a
                                            href={item.href}
                                            className="rounded-md px-3 py-3 text-base font-semibold text-foreground/85 transition-colors hover:bg-secondary"
                                        >
                                            {item.label}
                                        </a>
                                    </SheetClose>
                                ))}
                                <SheetClose asChild>
                                    <Button asChild className="mt-4 font-semibold">
                                        <a href="#join">
                                            <Users className="mr-2 h-4 w-4" />
                                            हमसे जुड़ें
                                        </a>
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
