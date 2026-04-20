import * as React from "react"
import gsap from "gsap"
import { Menu, X } from "lucide-react"

export interface SidebarMenuProps {
    children?: React.ReactNode;
}

export function SidebarMenu({ children }: SidebarMenuProps) {
    const container = React.useRef<HTMLDivElement>(null);
    const panel = React.useRef<HTMLDivElement>(null);
    const overlay = React.useRef<HTMLDivElement>(null);
    const tl = React.useRef<gsap.core.Timeline | null>(null);

    const [isOpen, setIsOpen] = React.useState(false);

    React.useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            tl.current = gsap.timeline({ paused: true })
                .to(container.current, {
                    autoAlpha: 1,
                    duration: 0.1
                })
                .to(overlay.current, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.inOut"
                }, "<")
                .to(panel.current, {
                    x: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    boxShadow: "-20px 0 50px rgba(0,0,0,0.3)"
                }, "<0.1")
                .fromTo(".menu-anim", {
                    opacity: 0,
                    x: 50
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "back.out(1.2)"
                }, "<0.3");
        }, container);

        return () => ctx.revert();
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            tl.current?.play();
        } else {
            tl.current?.reverse();
        }
    }, [isOpen]);

    // Handle escape key to close
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 z-40 p-3.5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
                aria-label="Open sidebar"
            >
                <Menu className="w-5 h-5 text-black dark:text-white" />
            </button>

            <div
                ref={container}
                className="fixed inset-0 z-50 pointer-events-none opacity-0 invisible"
            >
                <div
                    ref={overlay}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm opacity-0 pointer-events-auto"
                />

                <div
                    ref={panel}
                    className="absolute top-0 right-0 h-full w-[85vw] sm:w-[450px] bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl border-l border-white/40 dark:border-white/10 p-8 flex flex-col pointer-events-auto translate-x-full shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-12 menu-anim">
                        <h2 className="text-2xl tracking-tighter font-medium text-neutral-800 dark:text-neutral-200">
                            Navigation
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:rotate-90 transition-all duration-300"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>

                    <div className="flex-1 pr-4">
                        {children || (
                            <ul className="space-y-6">
                                {['Home', 'Work', 'Services', 'About', 'Contact'].map((item, i) => (
                                    <li key={i} className="menu-anim">
                                        <a
                                            href="#"
                                            className="group flex items-center justify-between text-4xl sm:text-5xl font-light tracking-tight text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300"
                                        >
                                            <span className="group-hover:translate-x-4 transition-transform duration-500 ease-out">{item}</span>
                                            <span className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out text-2xl">→</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/10 menu-anim space-y-4">
                        <div className="flex gap-4">
                            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                                <a key={social} href="#" className="uppercase text-xs tracking-widest font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}