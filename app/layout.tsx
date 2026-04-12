import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { RouteTracker } from "@/components/RouteTracker";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TechBuddy — Your technology helper",
    template: "%s | TechBuddy",
  },
  description:
    "A free, patient technology helper for senior citizens. Learn to spot scams, understand AI, and use your phone with confidence.",
  manifest: "/manifest.json",
  openGraph: {
    title: "TechBuddy — Your technology helper",
    description:
      "A free, patient technology helper for senior citizens. Learn to spot scams, understand AI, and use your phone with confidence.",
    type: "website",
  },
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${sourceSans.variable}`}
    >
      <body className="font-sans">
        <a
          href="#main-content"
          className="fixed left-2 top-2 z-50 -translate-y-20 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
        <RouteTracker />
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
