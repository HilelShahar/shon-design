// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouteProgress from "@/components/RouteProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "Shon's Design",
  description: "Developed by Shahar Hilel",
  icons: { icon: "/favicon.ico" }, // add /public/favicon.ico
  metadataBase: new URL("https://your-domain.com"), // set your real domain
  openGraph: {
    title: "Shon Simhon — Graphic Designer",
    description: "Branding, web graphics, and visual systems.",
    url: "https://your-domain.com",
    siteName: "Shon Simhon",
    images: [{ url: "/portrait.jpg", width: 1200, height: 630, alt: "Shon Simhon" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shon Simhon — Graphic Designer",
    description: "Branding, web graphics, and visual systems.",
    images: ["/portrait.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
        "scroll-smooth",
      ].join(" ")}
      suppressHydrationWarning={false}
    >
      <body
        className={[
          // if you use shadcn/ui tokens these map nicely
          "bg-background text-foreground antialiased",
          // sensible fallbacks if tokens aren’t defined
          "font-sans",
        ].join(" ")}
      >
        <main className="min-h-dvh">{children}</main>
        <RouteProgress /> 
      </body>
    </html>
  );
}
