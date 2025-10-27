"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Briefcase, MessageCircle, Mail } from "lucide-react";

type Props = {
  onJump?: (id: string) => void;     // used on home for smooth scroll
  activeSection?: string;            // 'home' | 'work' | 'testimonials' | 'contact'
};

const baseBtn =
  "relative inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-colors";
const activeRing = (
  <>
    <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" />
    <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_24px_rgba(255,255,255,0.18)]" />
  </>
);

export default function PillNav({ onJump, activeSection }: Props) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onWorkPage = pathname.startsWith("/work");

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          relative flex items-center gap-1 md:gap-2 p-2
          rounded-[80px]
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-[0_-8px_24px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]
        "
      >
        {/* Home */}
        {onHome ? (
          <button
            aria-label="Home"
            onClick={() => onJump?.("home")}
            className={`${baseBtn} ${activeSection === "home" ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <Home
              size={22}
              strokeWidth={1.8}
              className={activeSection === "home" ? "text-white" : "text-white/70"}
            />
            {activeSection === "home" && activeRing}
          </button>
        ) : (
          <Link aria-label="Home" href="/" className={`${baseBtn} hover:bg-white/10`}>
            <Home size={22} strokeWidth={1.8} className="text-white/70" />
          </Link>
        )}

        {/* Recent work (scrolls to #work on home) */}
        {onHome ? (
          <button
            aria-label="Recent work"
            onClick={() => onJump?.("work")}
            className={`${baseBtn} ${activeSection === "work" ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <LayoutGrid
              size={22}
              strokeWidth={1.8}
              className={activeSection === "work" ? "text-white" : "text-white/70"}
            />
            {activeSection === "work" && activeRing}
          </button>
        ) : (
          <Link aria-label="Recent work" href="/#work" className={`${baseBtn} hover:bg-white/10`}>
            <LayoutGrid size={22} strokeWidth={1.8} className="text-white/70" />
          </Link>
        )}

        {/* NEW: Work page (all projects) */}
        <Link
          aria-label="All work"
          href="/work"
          className={`${baseBtn} ${onWorkPage ? "bg-white/15" : "hover:bg-white/10"}`}
        >
          <Briefcase
            size={22}
            strokeWidth={1.8}
            className={onWorkPage ? "text-white" : "text-white/70"}
          />
          {onWorkPage && activeRing}
        </Link>

        {/* Testimonials */}
        {onHome ? (
          <button
            aria-label="Testimonials"
            onClick={() => onJump?.("testimonials")}
            className={`${baseBtn} ${activeSection === "testimonials" ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <MessageCircle
              size={22}
              strokeWidth={1.8}
              className={activeSection === "testimonials" ? "text-white" : "text-white/70"}
            />
            {activeSection === "testimonials" && activeRing}
          </button>
        ) : (
          <Link aria-label="Testimonials" href="/#testimonials" className={`${baseBtn} hover:bg-white/10`}>
            <MessageCircle size={22} strokeWidth={1.8} className="text-white/70" />
          </Link>
        )}

        {/* Contact */}
        {onHome ? (
          <button
            aria-label="Contact"
            onClick={() => onJump?.("contact")}
            className={`${baseBtn} ${activeSection === "contact" ? "bg-white/15" : "hover:bg-white/10"}`}
          >
            <Mail
              size={22}
              strokeWidth={1.8}
              className={activeSection === "contact" ? "text-white" : "text-white/70"}
            />
            {activeSection === "contact" && activeRing}
          </button>
        ) : (
          <Link aria-label="Contact" href="/#contact" className={`${baseBtn} hover:bg-white/10`}>
            <Mail size={22} strokeWidth={1.8} className="text-white/70" />
          </Link>
        )}
      </div>
    </nav>
  );
}
