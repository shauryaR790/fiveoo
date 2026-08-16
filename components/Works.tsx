"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORKS, WEBSITE_WORKS, type WorkItem } from "@/lib/constants";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
} from "@/lib/animations";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

function WorkCard({
  work,
  columns = 3,
  onVideoRef,
}: {
  work: WorkItem;
  columns?: 2 | 3;
  onVideoRef?: (id: string, node: HTMLVideoElement | null) => void;
}) {
  const colClass = columns === 2 ? "col-span-1 md:col-span-6" : "col-span-1 md:col-span-4";
  const imageSizes =
    columns === 2 ? "(max-width: 768px) 50vw, 50vw" : "(max-width: 768px) 33vw, 33vw";
  const isVideo = work.media === "video";

  const setVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      onVideoRef?.(work.id, node);
    },
    [onVideoRef, work.id],
  );

  return (
    <article data-work-card className={`group ${colClass}`}>
      <div
        data-work-meta
        className="mb-3 flex items-baseline justify-between gap-3 text-[12px] leading-none md:mb-[18px] md:text-[13px]"
      >
        <span className="truncate">{work.client}</span>
        <span className="shrink-0">{work.year}</span>
      </div>

      <div
        data-work-frame
        data-work-video={isVideo ? "true" : undefined}
        className={`theme-card relative overflow-hidden bg-transparent${isVideo ? "" : " will-change-transform"}`}
      >
        {isVideo ? (
          <video
            ref={setVideoRef}
            src={work.src}
            poster={work.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={work.title}
            className="block h-auto w-full max-w-none [transform:translateZ(0)]"
          />
        ) : (
          <Image
            src={work.src}
            alt={work.title}
            width={1600}
            height={2000}
            unoptimized
            className="block h-auto w-full max-w-none"
            sizes={imageSizes}
          />
        )}
        {!isVideo && (
          <>
            <div
              data-work-overlay
              className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 font-display text-base uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-5 md:text-xl">
              {work.title}
            </p>
          </>
        )}
      </div>
    </article>
  );
}

function WebsiteWorksGrid() {
  const videosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const scrollIdleRef = useRef(true);
  const activeIdRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const pauseAll = useCallback(() => {
    videosRef.current.forEach((video) => {
      video.pause();
    });
    activeIdRef.current = null;
  }, []);

  const playBestVisible = useCallback(() => {
    if (prefersReducedMotion() || !scrollIdleRef.current) return;

    let bestId: string | null = null;
    let bestRatio = 0;

    videosRef.current.forEach((video, id) => {
      const rect = video.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const ratio = Math.max(0, visibleBottom - visibleTop) / rect.height;

      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    if (!bestId || bestRatio < 0.45) {
      pauseAll();
      return;
    }

    if (activeIdRef.current === bestId) {
      const current = videosRef.current.get(bestId);
      if (current?.paused) void current.play().catch(() => {});
      return;
    }

    pauseAll();
    const next = videosRef.current.get(bestId);
    if (!next) return;

    activeIdRef.current = bestId;
    if (next.readyState === 0) next.load();
    void next.play().catch(() => {});
  }, [pauseAll]);

  const registerVideo = useCallback(
    (id: string, node: HTMLVideoElement | null) => {
      const existing = videosRef.current.get(id);
      if (existing) observerRef.current?.unobserve(existing);

      if (node) {
        videosRef.current.set(id, node);
        observerRef.current?.observe(node);
        if (scrollIdleRef.current) playBestVisible();
      } else {
        videosRef.current.delete(id);
      }
    },
    [playBestVisible],
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const onScrollActivity = () => {
      scrollIdleRef.current = false;
      pauseAll();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        scrollIdleRef.current = true;
        playBestVisible();
      }, 160);
    };

    const lenis = getLenis();
    lenis?.on("scroll", onScrollActivity);
    window.addEventListener("scroll", onScrollActivity, { passive: true });

    observerRef.current = new IntersectionObserver(
      () => {
        if (scrollIdleRef.current) playBestVisible();
      },
      { threshold: [0, 0.35, 0.65, 1] },
    );

    videosRef.current.forEach((video) => observerRef.current?.observe(video));
    const initTimer = setTimeout(playBestVisible, 400);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(initTimer);
      observerRef.current?.disconnect();
      observerRef.current = null;
      window.removeEventListener("scroll", onScrollActivity);
      lenis?.off("scroll", onScrollActivity);
      pauseAll();
    };
  }, [pauseAll, playBestVisible]);

  return (
    <div className="grid grid-cols-2 items-start gap-1.5 pt-8 md:grid-cols-12 md:gap-2.5 md:pt-16 md:gap-y-8">
      {WEBSITE_WORKS.map((work) => (
        <WorkCard key={work.id} work={work} columns={2} onVideoRef={registerVideo} />
      ))}
    </div>
  );
}

export default function Works() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const title = root.querySelector<HTMLElement>("[data-works-title]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", root);
      const risers = cards.flatMap((card) => [
        card.querySelector("[data-work-meta]"),
        card.querySelector("[data-work-frame]"),
      ]);

      if (prefersReducedMotion() || !title) {
        gsap.set(title, {
          color:
            getComputedStyle(document.documentElement)
              .getPropertyValue("--color-fg")
              .trim() || "currentColor",
        });
        return;
      }

      const totalWorks = WORKS.length + WEBSITE_WORKS.length;
      const pinDistance = `${120 + Math.max(0, totalWorks - 6) * 18}%`;

      gsap.set(title, { transformOrigin: "top center" });

      const introScale = 2.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onEnter: () => setNavInvert(false),
          onEnterBack: () => setNavInvert(false),
          onLeaveBack: () => setNavInvert(false),
        },
      });

      tl.fromTo(
        title,
        {
          scale: introScale,
          y: () => {
            const layoutTop = title.offsetTop;
            const scaledH = title.offsetHeight * introScale;
            return window.innerHeight / 2 - layoutTop - scaledH / 2;
          },
        },
        { scale: 1, y: 0, ease: "power1.inOut", duration: 0.68 },
        0,
      ).fromTo(
        risers,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.45,
          stagger: 0.05,
        },
        0.42,
      );

      if (isMobileViewport()) return;

      cards.forEach((card) => {
        const frame = card.querySelector("[data-work-frame]");
        const meta = card.querySelector("[data-work-meta]");
        if (frame?.getAttribute("data-work-video") === "true") return;

        const hover = gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
          })
          .to(frame, { scale: 1.01 }, 0)
          .to(card.querySelector("[data-work-overlay]"), { opacity: 1 }, 0)
          .to(meta, { x: 8 }, 0);

        card.addEventListener("mouseenter", () => hover.play());
        card.addEventListener("mouseleave", () => hover.reverse());
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="works"
      ref={rootRef}
      className="relative theme-surface overflow-hidden"
      data-nav-theme="dark"
    >
      <div className="relative px-3 pb-16 md:px-10 md:pb-24 lg:px-12">
        <h2
          data-works-title
          className="font-display pt-[calc(var(--nav-height)+1.25rem)] text-center text-[clamp(2rem,6.2vw,5.25rem)] uppercase leading-[0.88] text-[var(--color-fg)] will-change-transform"
        >
          Selected
          <br />
          Works
          <br />
          (2023–2026)
        </h2>

        <div className="grid grid-cols-3 items-start gap-1.5 pt-10 md:grid-cols-12 md:gap-2.5 md:pt-24 md:gap-y-8">
          {WORKS.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>

        <WebsiteWorksGrid />
      </div>
    </section>
  );
}
