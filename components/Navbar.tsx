"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_LINKS } from "@/lib/constants";
import { scrollToTarget } from "@/lib/lenis";
import { prefersReducedMotion, isNavPinDrive } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const navHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 88;

      const applyTheme = (theme: string | undefined) => {
        nav.classList.toggle("nav-invert", theme === "light");
      };

      const syncNavToScroll = () => {
        if (isNavPinDrive()) return;

        const probe = navHeight * 0.45;
        const sections = gsap.utils.toArray<HTMLElement>("[data-nav-theme]");

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const rect = section.getBoundingClientRect();
          if (rect.top <= probe && rect.bottom > probe) {
            applyTheme(section.dataset.navTheme);
            return;
          }
        }

        applyTheme("dark");
      };

      gsap.utils.toArray<HTMLElement>("[data-nav-theme]").forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top ${navHeight}px`,
          end: `bottom ${navHeight}px`,
          onEnter: syncNavToScroll,
          onEnterBack: syncNavToScroll,
          onLeave: syncNavToScroll,
          onLeaveBack: syncNavToScroll,
        });
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onRefresh: syncNavToScroll,
      });

      syncNavToScroll();
    }, nav);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(href, { offset: -20 });
  };

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 text-[var(--color-fg)] transition-colors duration-300"
    >
      <nav
        className="mx-auto flex h-[var(--nav-height)] items-center justify-between px-6 md:px-10 lg:px-12"
        aria-label="Primary"
      >
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="text-[26px] font-bold leading-none tracking-[-0.02em] md:text-[30px]"
        >
          FIVEO
        </a>

        <ul className="hidden items-center md:flex md:w-[46%] md:justify-between lg:w-[41.5%]">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="text-[17px] font-semibold tracking-[-0.01em] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-6 flex-col gap-1.5">
            <span
              className={`block h-0.5 w-full bg-current transition-transform ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-current transition-transform ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-[var(--color-bg)] text-[var(--color-fg)] transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-8 px-8 pt-16">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="font-display text-4xl uppercase tracking-tight"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
