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

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && value !== undefined) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  const onRefresh = () => {
    lenis.resize();
  };

  ScrollTrigger.addEventListener("refresh", onRefresh);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;

  (lenis as Lenis & { __ticker?: typeof tickerCallback; __onRefresh?: typeof onRefresh }).__ticker =
    tickerCallback;
  (lenis as Lenis & { __onRefresh?: typeof onRefresh }).__onRefresh = onRefresh;

  return lenis;
}

export function destroyLenis() {
  if (!lenisInstance) return;

  const ticker = (lenisInstance as Lenis & { __ticker?: (time: number) => void })
    .__ticker;
  const onRefresh = (lenisInstance as Lenis & { __onRefresh?: () => void })
    .__onRefresh;

  if (ticker) {
    gsap.ticker.remove(ticker);
  }

  if (onRefresh) {
    ScrollTrigger.removeEventListener("refresh", onRefresh);
  }

  ScrollTrigger.scrollerProxy(document.documentElement, {});

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
