import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import ScrollTransitionOverlay from "@/components/ScrollTransitionOverlay";
import SiteLoader from "@/components/SiteLoader";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
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

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-fg)] transition-colors duration-300">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--color-bg-inverse)] focus:px-4 focus:py-2 focus:text-[var(--color-fg-inverse)]"
        >
          Skip to content
        </a>
        <LenisProvider>
          <SiteLoader />
          <ScrollTransitionOverlay />
          <SmoothCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
