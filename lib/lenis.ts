import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export type LenisInstance = Lenis;

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function createLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;

  (lenis as Lenis & { __ticker?: typeof tickerCallback }).__ticker =
    tickerCallback;

  return lenis;
}

export function destroyLenis() {
  if (!lenisInstance) return;

  const ticker = (lenisInstance as Lenis & { __ticker?: (time: number) => void })
    .__ticker;

  if (ticker) {
    gsap.ticker.remove(ticker);
  }

  lenisInstance.destroy();
  lenisInstance = null;
}

export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: { offset?: number; immediate?: boolean; lock?: boolean },
) {
  if (!lenisInstance) {
    if (typeof target === "string") {
      const element = document.querySelector(target) as HTMLElement | null;
      if (!element) return;

      const top =
        element.getBoundingClientRect().top +
        window.scrollY +
        (options?.offset ?? 0);

      window.scrollTo({ top, left: 0, behavior: "auto" });
    }
    return;
  }

  if (options?.immediate) {
    let top: number | null = null;

    if (typeof target === "number") {
      top = target;
    } else {
      const element =
        typeof target === "string"
          ? (document.querySelector(target) as HTMLElement | null)
          : target;

      if (element) {
        top =
          element.getBoundingClientRect().top +
          window.scrollY +
          (options?.offset ?? 0);
      }
    }

    if (top !== null) {
      window.scrollTo({ top, left: 0, behavior: "auto" });
    }
  }

  lenisInstance.scrollTo(target, {
    offset: options?.offset ?? -20,
    immediate: options?.immediate ?? false,
    lock: options?.lock ?? false,
  });
}
