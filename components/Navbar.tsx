"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOBILE_NAV_LINKS, NAV_LINKS } from "@/lib/constants";
import { navigateToSection } from "@/lib/navigate";
import { getLenis } from "@/lib/lenis";
import { prefersReducedMotion, isNavPinDrive } from "@/lib/animations";
import LiquidGlass from "@/components/ui/liquid-glass";
import LiquidNavbar, {
  type LiquidNavItem,
} from "@/components/ui/liquid-glass-navbar";
import Chatbot from "@/components/Chatbot";
import FiveoMark from "@/components/FiveoMark";
import { HERO_PLAN } from "@/lib/hero-plan";
import { NAV_LINK_ICONS } from "@/components/nav-icons";

gsap.registerPlugin(ScrollTrigger);

type NavChrome = "full" | "middle" | "hidden";

export default function Navbar() {
  const planA = HERO_PLAN === "a";
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navTone, setNavTone] = useState<"light" | "dark">("dark");
  const [activeIndex, setActiveIndex] = useState(-1);
  const chromeRef = useRef<NavChrome>("full");
  const menuOpenRef = useRef(false);

  const liquidItems = useMemo<LiquidNavItem[]>(
    () =>
      NAV_LINKS.map((link) => {
        const Icon = NAV_LINK_ICONS[link.href];
        return {
          label: link.label,
          // buttons — Lenis navigation via onChange (avoid native hash jumps)
          icon: Icon ? <Icon className="h-[18px] w-[18px]" /> : undefined,
          fx: "pop" as const,
        };
      }),
    [],
  );

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
        const light = theme === "light";
        nav.classList.toggle("nav-invert", light);
        setNavTone(light ? "light" : "dark");
      };

      const sectionForHref = (href: string) => {
        const id = href.replace(/^#/, "");
        return document.getElementById(id);
      };

      const syncActiveFromScroll = () => {
        const probe = navHeight * 0.55;
        const hero = document.getElementById("top");
        if (hero) {
          const heroBottom = hero.getBoundingClientRect().bottom;
          if (heroBottom > navHeight + 80) {
            setActiveIndex(-1);
            return;
          }
        }

        let match = -1;
        NAV_LINKS.forEach((link, index) => {
          const el = sectionForHref(link.href);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          if (rect.top <= probe && rect.bottom > probe) match = index;
        });
        setActiveIndex(match);
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
            syncActiveFromScroll();
            return;
          }
        }

        applyTheme("dark");
        syncActiveFromScroll();
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
        onUpdate: syncActiveFromScroll,
        onRefresh: syncNavToScroll,
      });

      syncNavToScroll();
    }, nav);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    const middle = middleRef.current;
    const right = rightRef.current;
    if (!nav || !middle || !right) return;

    let lastScroll = 0;
    const reduced = prefersReducedMotion();

    const getScrollY = () => getLenis()?.scroll ?? window.scrollY;

    const isOnHero = () => {
      const hero = document.getElementById("top");
      if (!hero) return getScrollY() <= 40;
      const navHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 88;
      return hero.getBoundingClientRect().bottom > navHeight + 48;
    };

    const applyChrome = (mode: NavChrome) => {
      if (chromeRef.current === mode) return;
      chromeRef.current = mode;

      const showLogo = mode === "full";
      const showMiddle = mode === "full" || mode === "middle";
      const showRight = mode === "full";

      const animate = (
        el: HTMLElement | null,
        visible: boolean,
        yHidden = -28,
      ) => {
        if (!el) return;
        if (reduced) {
          el.style.opacity = visible ? "1" : "0";
          el.style.pointerEvents = visible ? "" : "none";
          el.style.transform = visible ? "none" : `translateY(${yHidden}px)`;
          return;
        }
        gsap.to(el, {
          autoAlpha: visible ? 1 : 0,
          y: visible ? 0 : yHidden,
          duration: visible ? 0.45 : 0.32,
          ease: visible ? "power3.out" : "power2.inOut",
          overwrite: "auto",
          onStart: () => {
            el.style.pointerEvents = visible ? "" : "none";
          },
        });
      };

      animate(logo, showLogo);
      animate(middle, showMiddle, -18);
      animate(right, showRight);
    };

    const updateChrome = () => {
      if (menuOpenRef.current || isNavPinDrive()) {
        applyChrome("full");
        return;
      }

      const scroll = getScrollY();
      const lenis = getLenis();
      const direction = lenis?.direction ?? Math.sign(scroll - lastScroll);
      const onHero = isOnHero();

      if (onHero || scroll <= 40) {
        lastScroll = scroll;
        applyChrome("full");
        return;
      }

      if (direction > 0) {
        applyChrome("hidden");
      } else if (direction < 0) {
        applyChrome("middle");
      } else {
        const delta = scroll - lastScroll;
        if (delta > 2) applyChrome("hidden");
        else if (delta < -2) applyChrome("middle");
      }

      lastScroll = scroll;
    };

    gsap.set([logo, middle, right].filter(Boolean), { autoAlpha: 1, y: 0 });
    chromeRef.current = "full";
    lastScroll = getScrollY();

    let rafId = 0;
    let lenisCleanup: (() => void) | undefined;

    const attachLenis = () => {
      const lenis = getLenis();
      if (!lenis) {
        rafId = requestAnimationFrame(attachLenis);
        return;
      }

      const onLenisScroll = () => updateChrome();
      lenis.on("scroll", onLenisScroll);
      lenisCleanup = () => lenis.off("scroll", onLenisScroll);
    };

    attachLenis();
    window.addEventListener("scroll", updateChrome, { passive: true });
    updateChrome();

    return () => {
      cancelAnimationFrame(rafId);
      lenisCleanup?.();
      window.removeEventListener("scroll", updateChrome);
      gsap.set([logo, middle, right].filter(Boolean), {
        clearProps: "transform,opacity,visibility",
      });
      chromeRef.current = "full";
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("mailto:")) {
      setMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMenuOpen(false);
    void navigateToSection(href);
  };

  const handleLiquidChange = (index: number) => {
    setActiveIndex(index);
    const href = NAV_LINKS[index]?.href;
    if (!href) return;
    void navigateToSection(href);
  };

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 overflow-visible text-[var(--color-fg)] transition-colors duration-300 safe-top safe-x"
    >
      <nav
        className="relative mx-auto flex h-[var(--nav-height)] items-center justify-between overflow-visible px-5 md:px-10 lg:px-12"
        aria-label="Primary"
      >
        <div ref={logoRef} className="relative z-10">
          {planA ? (
            <span
              className="invisible block h-14 w-[7.5rem] shrink-0 md:w-[9.5rem]"
              aria-hidden
            />
          ) : (
            <a
              href="#top"
              onClick={(e) => handleNav(e, "#top")}
              className="relative z-10 flex h-16 items-center overflow-visible text-[var(--color-fg)] md:h-20"
              aria-label="FIVEO"
            >
              <FiveoMark className="h-24 w-auto md:h-28" />
            </a>
          )}
        </div>

        <div
          ref={middleRef}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-[5] hidden -translate-y-1/2 justify-center md:flex"
        >
          <div className="pointer-events-auto">
            <LiquidNavbar
              tone={navTone}
              active={activeIndex}
              defaultActive={-1}
              onChange={handleLiquidChange}
              sound={false}
              items={liquidItems}
              className="max-w-[min(100vw-12rem,44rem)]"
            />
          </div>
        </div>

        <div
          ref={rightRef}
          className={`relative z-10 flex items-center gap-2.5 md:gap-3 ${
            menuOpen ? "max-md:hidden" : ""
          }`}
        >
          <Chatbot />

          <LiquidGlass
            as="button"
            preset="control"
            cornerRadius={12}
            padding="0"
            className="relative z-50 h-11 w-11 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5 text-[var(--color-fg)]">
              <span
                className={`block h-0.5 w-full bg-current transition-transform ${
                  menuOpen ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-transform ${
                  menuOpen ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </span>
          </LiquidGlass>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] text-[var(--color-fg)] transition-transform duration-500 safe-top safe-bottom safe-x md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="absolute inset-0 bg-[var(--color-bg)]/75 backdrop-blur-2xl" />
        <ul className="relative z-[1] flex h-full flex-col justify-center gap-8 px-8 pt-16 pb-[max(2rem,var(--safe-bottom))]">
          {MOBILE_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="font-display text-[clamp(2.25rem,10vw,3.5rem)] uppercase leading-[0.95] tracking-[-0.04em]"
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
