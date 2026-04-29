'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1.1,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        const resizeObserver = new ResizeObserver(() => {
            lenis.resize();
            ScrollTrigger.refresh();
        });
        resizeObserver.observe(document.body);

        return () => {
            lenis.destroy();
            resizeObserver.disconnect();
            lenisRef.current = null;
        };
    }, []);

    // Crucial: Refresh on navigation
    useEffect(() => {
        if (lenisRef.current) {
            // Give Next.js a moment to render the new page
            setTimeout(() => {
                lenisRef.current?.resize();
                ScrollTrigger.refresh();
                window.scrollTo(0, 0); // Reset scroll to top on navigation if needed
            }, 100);
        }
    }, [pathname]);

    return <div id="smooth-wrapper">{children}</div>;
}
