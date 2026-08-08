import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

/** Overflow-hidden text rise */
export function revealText(
  elements: gsap.TweenTarget,
  options?: gsap.TweenVars & { trigger?: Element | string },
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { yPercent: 0, opacity: 1 });
    return null;
  }

  const { trigger, ...vars } = options ?? {};

  return gsap.from(elements, {
    yPercent: 100,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.08,
    ...(trigger
      ? {
          scrollTrigger: {
            trigger,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      : {}),
    ...vars,
  });
}

export function fadeUp(
  elements: gsap.TweenTarget,
  options?: gsap.TweenVars & { trigger?: Element | string },
) {
  if (prefersReducedMotion()) {
    gsap.set(elements, { y: 0, opacity: 1 });
    return null;
  }

  const { trigger, ...vars } = options ?? {};

  return gsap.from(elements, {
    y: 48,
    opacity: 0,
    duration: 0.9,
    ease: "power2.out",
    stagger: 0.1,
    ...(trigger
      ? {
          scrollTrigger: {
            trigger,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      : {}),
    ...vars,
  });
}

export function pinSection(
  trigger: Element | string,
  options?: ScrollTrigger.Vars,
) {
  if (prefersReducedMotion()) return null;

  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "+=100%",
    pin: true,
    pinSpacing: true,
    scrub: false,
    ...options,
  });
}

export function parallax(
  element: gsap.TweenTarget,
  speed = 0.2,
  trigger?: Element | string,
) {
  if (prefersReducedMotion()) return null;

  return gsap.to(element, {
    yPercent: speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: trigger ?? (element as Element),
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

export function colorTween(
  trigger: Element | string,
  target: Element | string,
  colors: { from?: string; to: string },
  options?: Partial<ScrollTrigger.Vars>,
) {
  if (prefersReducedMotion()) {
    gsap.set(target, { backgroundColor: colors.to });
    return null;
  }

  return gsap.fromTo(
    target,
    { backgroundColor: colors.from ?? "transparent" },
    {
      backgroundColor: colors.to,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top 60%",
        end: "top 20%",
        scrub: true,
        ...options,
      },
    },
  );
}

export function horizontalFromVertical(
  section: HTMLElement,
  track: HTMLElement,
  options?: { end?: string; scrub?: number | boolean },
) {
  if (prefersReducedMotion() || isMobileViewport()) {
    gsap.set(track, { clearProps: "transform" });
    return null;
  }

  const getScrollDistance = () =>
    Math.max(0, track.scrollWidth - section.clientWidth);

  return gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: options?.scrub ?? 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

export function infiniteMarquee(
  track: HTMLElement,
  options?: { duration?: number; reversed?: boolean },
) {
  if (prefersReducedMotion()) return null;

  const duration = options?.duration ?? 28;

  // The track holds two identical halves; travelling exactly 50% keeps the
  // loop seamless in either direction.
  return gsap.fromTo(
    track,
    { xPercent: options?.reversed ? -50 : 0 },
    {
      xPercent: options?.reversed ? 0 : -50,
      duration,
      ease: "none",
      repeat: -1,
    },
  );
}

export function imageReveal(
  element: HTMLElement,
  options?: { trigger?: Element | string; scaleFrom?: number },
) {
  if (prefersReducedMotion()) {
    gsap.set(element, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
    return null;
  }

  const trigger = options?.trigger ?? element;
  const scaleFrom = options?.scaleFrom ?? 1.15;

  gsap.set(element, {
    clipPath: "inset(15% 15% 15% 15%)",
    scale: scaleFrom,
  });

  return gsap.to(element, {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    duration: 1.25,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
}

/**
 * Nav colour is normally derived from `[data-nav-theme]` sections, but pinned
 * sequences change their own background mid-pin and need to drive it directly.
 */
export function setNavInvert(inverted: boolean) {
  document.querySelector("header")?.classList.toggle("nav-invert", inverted);
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}
