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

/** Horizontal drift within a bounded track - matches hero showreel behaviour. */
export function bindCursorSlideTrack(
  track: HTMLElement,
  slide: HTMLElement,
  options?: { proximity?: number; restRatio?: number; minWidth?: number },
) {
  const proximity = options?.proximity ?? 90;
  const restRatio = options?.restRatio ?? 0.4;
  const minWidth = options?.minWidth ?? 1024;

  const canFollow = () =>
    !prefersReducedMotion() &&
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia(`(min-width: ${minWidth}px)`).matches;

  let maxOffset = 0;
  let restX = 0;

  const measure = () => {
    maxOffset = Math.max(0, track.clientWidth - slide.offsetWidth);
    restX = maxOffset * restRatio;
  };

  const xTo = gsap.quickTo(slide, "x", { duration: 2.2, ease: "power1.out" });

  measure();
  if (canFollow()) gsap.set(slide, { x: restX });

  const onMove = (e: PointerEvent) => {
    if (!canFollow()) return;

    const box = slide.getBoundingClientRect();
    const isNear =
      e.clientX >= box.left - proximity &&
      e.clientX <= box.right + proximity &&
      e.clientY >= box.top - proximity &&
      e.clientY <= box.bottom + proximity;

    if (!isNear) return;

    const rect = track.getBoundingClientRect();
    const target = e.clientX - rect.left - slide.offsetWidth / 2;
    xTo(gsap.utils.clamp(0, maxOffset, target));
  };

  const onResize = () => {
    const previous = (gsap.getProperty(slide, "x") as number) || 0;
    measure();
    gsap.set(slide, {
      x: canFollow() ? gsap.utils.clamp(0, maxOffset, previous) : 0,
    });
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", onResize);
    gsap.killTweensOf(slide);
    gsap.set(slide, { x: 0 });
  };
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
  const reversed = options?.reversed ?? false;
  const halfWidth = track.scrollWidth / 2;

  if (halfWidth <= 0) return null;

  // Pixel loop is more reliable than xPercent once fonts/images settle.
  return gsap.fromTo(
    track,
    { x: reversed ? -halfWidth : 0 },
    {
      x: reversed ? 0 : -halfWidth,
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
let navPinDrive = false;

export function setNavPinDrive(active: boolean) {
  navPinDrive = active;
}

export function isNavPinDrive() {
  return navPinDrive;
}

export function setNavInvert(inverted: boolean) {
  document.querySelector("header")?.classList.toggle("nav-invert", inverted);
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

const SCRUB_SECTION_IDS = new Set(["works", "services"]);

const REVEAL_BLOCK_SELECTOR = [
  "[data-about-reveal]",
  "[data-price-reveal]",
  "[data-process-reveal]",
  "[data-partner-reveal]",
  "[data-footer-reveal]",
  "[data-pos-reveal]",
  "[data-hero-sub]",
  "[data-works-title]",
  "[data-work-meta]",
  "[data-work-frame]",
  "[data-work-card]",
  "[data-service-card]",
  "#collection h2",
  "#collection p",
  "#collection .gf-root",
  "h1",
  "h2",
  "h3",
  "p",
  "article",
  "figure",
  "img",
  "video",
  "button",
  "a",
  "li",
].join(",");

const REVEAL_PRESETS = [
  { y: 56, x: 0, rotation: 0, scale: 1, filter: "blur(16px)", ease: "power3.out" },
  { y: 42, x: -16, rotation: -1.1, scale: 1, filter: "blur(10px)", ease: "power2.out" },
  { y: 48, x: 14, rotation: 1, scale: 1, filter: "blur(12px)", ease: "expo.out" },
  { y: 64, x: 0, rotation: 0, scale: 0.97, filter: "blur(9px)", ease: "power4.out" },
  { y: 36, x: 0, rotation: 0.55, scale: 1, filter: "blur(13px)", ease: "power3.out" },
] as const;

function sortByDocumentOrder(elements: HTMLElement[]) {
  return elements.sort((a, b) => {
    if (a === b) return 0;
    const position = a.compareDocumentPosition(b);
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

function isNestedRevealBlock(element: HTMLElement, blocks: HTMLElement[]) {
  return blocks.some(
    (other) => other !== element && other.contains(element),
  );
}

function expandHeadingLines(blocks: HTMLElement[]) {
  const expanded: HTMLElement[] = [];

  blocks.forEach((block) => {
    const lines = block.matches("h2[data-process-reveal]")
      ? block.querySelectorAll<HTMLElement>(":scope > span.block")
      : block.querySelectorAll<HTMLElement>(":scope > span.block.will-change-transform");

    if (lines.length > 1) {
      expanded.push(...Array.from(lines));
      return;
    }

    expanded.push(block);
  });

  return expanded;
}

function collectRevealTargets(section: HTMLElement) {
  const matched = sortByDocumentOrder(
    gsap.utils.toArray<HTMLElement>(section.querySelectorAll(REVEAL_BLOCK_SELECTOR)),
  );

  const blocks = matched.filter(
    (block) => !isNestedRevealBlock(block, matched),
  );

  const heroLines = gsap.utils.toArray<HTMLElement>(
    section.querySelectorAll("h1 span.will-change-transform"),
  );

  const merged = sortByDocumentOrder([
    ...new Set([...blocks, ...heroLines]),
  ]).filter((block) => !isNestedRevealBlock(block, blocks));

  return expandHeadingLines(merged);
}

function collectSectionElements(section: HTMLElement) {
  const tagged = collectRevealTargets(section);
  if (tagged.length >= 4) return tagged.slice(0, 28);

  const fallback = sortByDocumentOrder(
    gsap.utils.toArray<HTMLElement>(
      section.querySelectorAll(
        "h1, h2, h3, p, article, figure, img, video, [data-work-card], [data-service-card], .gf-root",
      ),
    ),
  ).filter((el) => {
    if (el.closest("header")) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });

  const merged = sortByDocumentOrder([
    ...new Set([...tagged, ...fallback]),
  ]).filter((el, _, all) => !isNestedRevealBlock(el, all));

  return merged.slice(0, 28);
}

export function revealNavigatedSection(section: HTMLElement) {
  if (prefersReducedMotion()) return null;

  // Pinned scrub sections own their timelines - don't fight them.
  // Still force Services title/cards visible after a nav jump (scrub can leave them hidden).
  if (SCRUB_SECTION_IDS.has(section.id)) {
    requestAnimationFrame(() => {
      refreshScrollTrigger();
      ScrollTrigger.update();
      if (section.id === "services") {
        gsap.set(section.querySelectorAll("[data-letter]"), { yPercent: 0 });
        gsap.set(section.querySelectorAll("[data-service-card]"), {
          yPercent: 0,
          autoAlpha: 1,
        });
      }
    });
    return null;
  }

  const targets = collectSectionElements(section).filter(
    (el) => !el.closest("[data-nomad-work]") && el.tagName !== "CANVAS",
  );
  if (!targets.length) return null;

  gsap.killTweensOf(targets);

  const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

  targets.forEach((target, index) => {
    const preset = REVEAL_PRESETS[index % REVEAL_PRESETS.length];
    const start = index * 0.07 + (index % 3) * 0.02;

    gsap.set(target, {
      y: preset.y,
      x: preset.x,
      rotation: preset.rotation,
      scale: preset.scale,
      opacity: 0,
      filter: preset.filter,
      transformOrigin: "50% 100%",
      willChange: "transform, opacity, filter",
    });

    timeline.to(
      target,
      {
        y: 0,
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9 + (index % 4) * 0.14,
        ease: preset.ease,
        clearProps: "willChange,filter",
      },
      start,
    );
  });

  return timeline;
}
