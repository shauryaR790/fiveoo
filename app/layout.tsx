import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIVEO — Seamless Brand Identity",
  description:
    "FIVEO is a creative partner for startups and scale-ups. Branding, UI/UX, and motion — on demand.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-fg)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-fg)]"
        >
          Skip to content
        </a>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
