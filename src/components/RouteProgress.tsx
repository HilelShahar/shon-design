"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Minimal route progress (no deps). Shows on pathname change. */
export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // start
    setVisible(true);
    setWidth(0);
    // ramp up to ~90%
    requestAnimationFrame(() => setWidth(90));

    // complete after a short delay (simulate load)
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setWidth(100);
      // hide after finish animation
      setTimeout(() => setVisible(false), 250);
    }, 400); // tweak (300–700ms) to taste

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-white/80"
        style={{
          width: `${width}%`,
          transition: "width 300ms ease",
          boxShadow: "0 0 12px rgba(255,255,255,.35)",
        }}
      />
    </div>
  );
}
