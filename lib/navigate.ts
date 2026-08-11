import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { prefersReducedMotion, refreshScrollTrigger } from "@/lib/animations";

const OVERLAY_ID = "scroll-transition-overlay";

let isNavigating = false;

export function getNavScrollOffset() {
  const navHeight =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
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
  lenis?.scrollTo(top, { immediate: true, lock: true });
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

  const scrollTop = resolveScrollTop(target, offset);
  if (scrollTop === null) return;

  isNavigating = true;

  const overlay = document.getElementById(OVERLAY_ID);
  const lenis = getLenis();
  const root = document.documentElement;

  try {
    lenis?.stop();
    root.classList.add("is-scroll-navigating");

    if (overlay) {
      overlay.classList.add("is-active");
    }

    await wait(520);

    ScrollTrigger.disable(false);
    jumpToScrollTop(scrollTop);
    refreshScrollTrigger();
    ScrollTrigger.update();

    await nextFrame();
    await nextFrame();
    await wait(180);

    ScrollTrigger.enable();
    await nextFrame();
    await wait(220);

    if (overlay) {
      overlay.classList.remove("is-active");
    }

    await wait(560);
  } finally {
    root.classList.remove("is-scroll-navigating");
    lenis?.start();
    isNavigating = false;
  }
}
