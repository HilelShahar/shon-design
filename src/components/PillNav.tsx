"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, Home, Mail, UserRound } from "lucide-react";

type Props = {
  onJump?: (id: string) => void;
  activeSection?: string;
};

const baseBtn =
  "relative inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full transition-colors";
const activeRing = (
  <>
    <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" />
    <span className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_24px_rgba(255,255,255,0.18)]" />
  </>
);

function NavIcon({
  label,
  active,
  href,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const className = `${baseBtn} ${active ? "bg-white/15" : "hover:bg-white/10"}`;
  const inner = (
    <>
      {children}
      {active && activeRing}
      <span className="pill-nav-tip" aria-hidden="true">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" aria-label={label} onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link aria-label={label} href={href ?? "/"} className={className}>
      {inner}
    </Link>
  );
}

export default function PillNav({ onJump, activeSection }: Props) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onWorkPage = pathname.startsWith("/work");
  const onAboutPage = pathname === "/about" || pathname.startsWith("/about/");
  const onResumePage = pathname === "/resume" || pathname.startsWith("/resume/");

  const iconClass = (active: boolean) => (active ? "text-white" : "text-white/70");

  return (
    <nav className="pill-nav fixed top-6 left-1/2 -translate-x-1/2 z-50" aria-label="Primary">
      <div
        className="
          relative flex items-center gap-1 md:gap-2 p-2
          rounded-[80px]
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-[0_-8px_24px_rgba(255,255,255,0.06),0_8px_24px_rgba(0,0,0,0.5)]
        "
      >
        <NavIcon
          label="Home"
          active={onHome && activeSection === "home"}
          href="/"
          onClick={onHome ? () => onJump?.("home") : undefined}
        >
          <Home size={22} strokeWidth={1.8} className={iconClass(onHome && activeSection === "home")} />
        </NavIcon>

        <NavIcon label="Work" active={onWorkPage} href="/work">
          <Briefcase size={22} strokeWidth={1.8} className={iconClass(onWorkPage)} />
        </NavIcon>

        <NavIcon label="About" active={onAboutPage} href="/about">
          <UserRound size={22} strokeWidth={1.8} className={iconClass(onAboutPage)} />
        </NavIcon>

        <NavIcon label="Resume" active={onResumePage} href="/resume">
          <FileText size={22} strokeWidth={1.8} className={iconClass(onResumePage)} />
        </NavIcon>

        <NavIcon
          label="Contact"
          active={onHome && activeSection === "contact"}
          href="/#contact"
          onClick={onHome ? () => onJump?.("contact") : undefined}
        >
          <Mail size={22} strokeWidth={1.8} className={iconClass(onHome && activeSection === "contact")} />
        </NavIcon>
      </div>
    </nav>
  );
}
