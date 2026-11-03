import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import {
  prefersReducedMotion,
  refreshScrollTrigger,
  revealNavigatedSection,
} from "@/lib/animations";
import { playSiteLoader } from "@/lib/site-loader";

const NAV_LOADER_DURATION = 2100;
const DROP_OFFSET = 96;

let isNavigating = false;

export function getNavScrollOffset() {
  const navHeight =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-height",
      ),
    ) || 88;

  return -navHeight;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function resolveScrollTop(target: string, offset: number) {
  const element = document.querySelector(target) as HTMLElement | null;
  if (!element) return null;

  return element.getBoundingClientRect().top + window.scrollY + offset;
}

function jumpToScrollTop(top: number) {
  window.scrollTo({ top, left: 0, behavior: "auto" });

  const lenis = getLenis();
  lenis?.scrollTo(top, { immediate: true });
}

export async function navigateToSection(
  target: string,
  options?: { offset?: number },
) {
  if (typeof window === "undefined") return;
  if (!target.startsWith("#") || target === "#") return;

  const offset = options?.offset ?? getNavScrollOffset();

  if (prefersReducedMotion()) {
    scrollToTarget(target, { offset, immediate: true });
    refreshScrollTrigger();
    return;
  }

  if (isNavigating) return;

  // Measure after a refresh so pinned spacers are included.
  refreshScrollTrigger();
  const scrollTop = resolveScrollTop(target, offset);
  if (scrollTop === null) return;

  isNavigating = true;

  const lenis = getLenis();
  const root = document.documentElement;

  try {
    lenis?.stop();
    root.classList.add("is-scroll-navigating");

    const loaderDone = playSiteLoader({ duration: NAV_LOADER_DURATION });

    await wait(360);

    // Do NOT ScrollTrigger.disable() — that breaks pinned scrub sections.
    const approach = Math.max(0, scrollTop - DROP_OFFSET);
    jumpToScrollTop(approach);
    ScrollTrigger.update();

    await loaderDone;

    root.classList.remove("is-scroll-navigating");
    await nextFrame();
    refreshScrollTrigger();
    ScrollTrigger.update();
    lenis?.start();

    scrollToTarget(target, { offset, immediate: false });
    await wait(480);

    const section = document.querySelector(target) as HTMLElement | null;
    if (section) {
      revealNavigatedSection(section);
    }

    await wait(120);
    refreshScrollTrigger();
    ScrollTrigger.update();
    await wait(400);
  } finally {
    root.classList.remove("is-scroll-navigating");
    lenis?.start();
    isNavigating = false;
  }
}
