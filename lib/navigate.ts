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

function waitForOverlayTransition(el: HTMLElement) {
  return new Promise<void>((resolve) => {
    const finish = () => {
      el.removeEventListener("transitionend", onEnd);
      resolve();
    };

    const onEnd = (event: TransitionEvent) => {
      if (event.target === el) finish();
    };

    el.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 650);
  });
}

export async function navigateToSection(
  target: string,
  options?: { offset?: number },
) {
  if (typeof window === "undefined") return;
  if (!target.startsWith("#") || target === "#") return;

  const offset = options?.offset ?? getNavScrollOffset();

  if (prefersReducedMotion()) {
    scrollToTarget(target, { offset });
    refreshScrollTrigger();
    return;
  }

  if (isNavigating) return;
  isNavigating = true;

  const overlay = document.getElementById(OVERLAY_ID);
  const lenis = getLenis();

  try {
    lenis?.stop();

    if (overlay) {
      overlay.classList.add("is-active");
      await waitForOverlayTransition(overlay);
    } else {
      await wait(360);
    }

    scrollToTarget(target, { offset, immediate: true });
    refreshScrollTrigger();

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    await wait(120);

    if (overlay) {
      overlay.classList.remove("is-active");
      await waitForOverlayTransition(overlay);
    } else {
      await wait(480);
    }
  } finally {
    lenis?.start();
    isNavigating = false;
  }
}
