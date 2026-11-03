"use client";

import React, { useState } from "react";

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface Partner {
  logoUrl: string;
  href: string;
}

interface ResponsiveHeroBannerProps {
  logoUrl?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  partnersTitle?: string;
  partners?: Partner[];
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
  backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80",
  navLinks = [
    { label: "Home", href: "#", isActive: true },
    { label: "Missions", href: "#" },
    { label: "Destinations", href: "#" },
    { label: "Technology", href: "#" },
    { label: "Book Flight", href: "#" },
  ],
  ctaButtonText = "Reserve Seat",
  ctaButtonHref = "#",
  badgeLabel = "New",
  badgeText = "First Commercial Flight to Mars 2026",
  title = "Journey Beyond Earth",
  titleLine2 = "Into the Cosmos",
  description =
    "Experience the cosmos like never before. Our advanced spacecraft and cutting-edge technology make interplanetary travel accessible, safe, and unforgettable.",
  primaryButtonText = "Book Your Journey",
  primaryButtonHref = "#",
  secondaryButtonText = "Watch Launch",
  secondaryButtonHref = "#",
  partnersTitle = "Partnering with leading space agencies worldwide",
  partners = [
    {
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80",
      href: "#",
    },
    {
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80",
      href: "#",
    },
    {
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80",
      href: "#",
    },
    {
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80",
      href: "#",
    },
    {
      logoUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80",
      href: "#",
    },
  ],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden">
      <img
        src={backgroundImageUrl}
        alt=""
        className="absolute top-0 right-0 bottom-0 left-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

      <header className="relative z-10 xl:top-4">
        <div className="mx-6">
          <div className="flex items-center justify-between pt-4">
            <a
              href="#"
              className="inline-flex h-[40px] w-[100px] items-center justify-center rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${logoUrl})` }}
            />

            <nav className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`px-3 py-2 font-sans text-sm font-medium transition-colors hover:text-white ${
                      link.isActive ? "text-white/90" : "text-white/80"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={ctaButtonHref}
                  className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-sans text-sm font-medium text-neutral-900 transition-colors hover:bg-white/90"
                >
                  {ctaButtonText}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </div>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white/90"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 sm:pt-28 md:pt-32 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-slide-in-1 mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur">
              <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 font-sans text-xs font-medium text-neutral-900">
                {badgeLabel}
              </span>
              <span className="font-sans text-sm font-medium text-white/90">
                {badgeText}
              </span>
            </div>

            <h1 className="animate-fade-slide-in-2 font-instrument-serif text-4xl leading-tight font-normal tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
              <br className="hidden sm:block" />
              {titleLine2}
            </h1>

            <p className="animate-fade-slide-in-3 mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
              {description}
            </p>

            <div className="animate-fade-slide-in-4 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href={primaryButtonHref}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-sans text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
              >
                {primaryButtonText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href={secondaryButtonHref}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 font-sans text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {secondaryButtonText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            <p className="animate-fade-slide-in-1 text-center text-sm text-white/70">
              {partnersTitle}
            </p>
            <div className="animate-fade-slide-in-2 mt-6 grid grid-cols-2 items-center justify-items-center gap-4 text-white/70 sm:grid-cols-3 md:grid-cols-5">
              {partners.map((partner, index) => (
                <a
                  key={index}
                  href={partner.href}
                  className="inline-flex h-[36px] w-[120px] items-center justify-center rounded-full bg-cover bg-center opacity-80 transition-opacity hover:opacity-100"
                  style={{ backgroundImage: `url(${partner.logoUrl})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
