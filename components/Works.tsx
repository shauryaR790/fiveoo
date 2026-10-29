"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORKS, WEBSITE_WORKS, type WorkItem } from "@/lib/constants";
import NomadWorkCanvas from "@/components/NomadWorkCanvas";
import WorkLightbox from "@/components/WorkLightbox";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
  fadeUp,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

function WorkCard({
  work,
  columns = 3,
  onImageClick,
}: {
  work: WorkItem;
  columns?: 2 | 3;
  onImageClick?: (work: WorkItem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const colClass = columns === 2 ? "col-span-1 md:col-span-6" : "col-span-1 md:col-span-4";
  const imageSizes =
    columns === 2 ? "(max-width: 768px) 50vw, 50vw" : "(max-width: 768px) 33vw, 33vw";
  const isVideo = work.media === "video";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo || prefersReducedMotion()) return;

    const syncPlayback = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.load();
        }
        void video.play().catch(() => {});
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) syncPlayback(entry);
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: "80px 0px" },
    );

    observer.observe(video);

    const onReady = () => {
      const rect = video.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) void video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", onReady);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onReady();

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", onReady);
    };
  }, [isVideo]);

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
          work.href ? (
            <a
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${work.client} website`}
              className="group/video block cursor-pointer"
            >
              <video
                ref={videoRef}
                src={work.src}
                poster={work.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                tabIndex={-1}
                className="block h-auto w-full max-w-none [transform:translateZ(0)]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/video:bg-black/25" />
              <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 font-display text-sm uppercase leading-tight text-white opacity-100 transition-opacity duration-300 md:p-5 md:text-xl md:opacity-0 md:group-hover/video:opacity-100">
                Visit site →
              </p>
            </a>
          ) : (
            <video
              ref={videoRef}
              src={work.src}
              poster={work.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={work.title}
              className="block h-auto w-full max-w-none [transform:translateZ(0)]"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => onImageClick?.(work)}
            aria-label={`View ${work.title} full size`}
            className="group/image block w-full cursor-zoom-in text-left"
          >
            <Image
              src={work.src}
              alt={work.title}
              width={1600}
              height={2000}
              unoptimized
              className="block h-auto w-full max-w-none"
              sizes={imageSizes}
            />
            <div
              data-work-overlay
              className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100"
              aria-hidden
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 font-display text-base uppercase leading-tight text-white opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 md:p-5 md:text-xl">
              {work.title}
            </p>
          </button>
        )}
      </div>
    </article>
  );
}

function PosAdShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-pos-reveal]"), {
        trigger: root,
        stagger: 0.12,
        y: 40,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;

    const syncPlayback = (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          video.load();
        }
        void video.play().catch(() => {});
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) syncPlayback(entry);
      },
      { threshold: [0, 0.15, 0.35], rootMargin: "120px 0px" },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative mt-14 border-t border-[color-mix(in_srgb,var(--color-fg)_10%,transparent)] pt-10 md:mt-20 md:pt-16"
    >
      <div className="mb-8 flex flex-col gap-8 md:mb-10 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2
          data-pos-reveal
          className="font-display text-left text-[clamp(2rem,6.2vw,5.25rem)] uppercase leading-[0.88] tracking-[-0.03em] text-[var(--color-fg)]"
        >
          The new
          <br />
          POS software
        </h2>
        <p
          data-pos-reveal
          className="max-w-[34rem] font-[family-name:var(--font-card)] text-[15px] font-light leading-[1.55] tracking-[-0.02em] text-[var(--color-fg)]/90 md:text-[17px] lg:max-w-[38%] lg:text-[18px]"
        >
          Ring up sales, sync inventory, and take payments from one clean
          interface. Every transaction updates stock in real time, so your team
          moves fast at the counter while you track performance from a single
          dashboard—no patchwork tools, no slowdown at peak hours.
        </p>
      </div>

      <div
        data-pos-reveal
        className="theme-card relative w-full overflow-hidden rounded-[20px] bg-black md:rounded-[25px]"
      >
        <video
          ref={videoRef}
          src="/videos/POS_AD.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-label="FIVEO POS software product demo"
          className="block h-auto w-full max-w-none object-contain [transform:translateZ(0)] [backface-visibility:hidden]"
        />
      </div>
    </div>
  );
}

export default function Works() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [lightboxWork, setLightboxWork] = useState<WorkItem | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const pinRoot = pinRef.current;
    if (!root || !pinRoot) return;

    const ctx = gsap.context(() => {
      const title = pinRoot.querySelector<HTMLElement>("[data-works-title]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]", pinRoot);
      const risers = cards.flatMap((card) => [
        card.querySelector("[data-work-meta]"),
        card.querySelector("[data-work-frame]"),
      ]);

      if (prefersReducedMotion() || isMobileViewport() || !title) {
        gsap.set(title, {
          color:
            getComputedStyle(document.documentElement)
              .getPropertyValue("--color-fg")
              .trim() || "currentColor",
        });
        return;
      }

      const pinDistance = `${120 + Math.max(0, WORKS.length - 6) * 18}%`;

      gsap.set(title, { transformOrigin: "top center" });

      const introScale = 2.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRoot,
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
        const overlay = card.querySelector("[data-work-overlay]");
        if (!frame || !meta || !overlay) return;

        const hover = gsap
          .timeline({
            paused: true,
            defaults: { duration: 0.4, ease: "power2.out" },
          })
          .to(frame, { scale: 1.01 }, 0)
          .to(overlay, { opacity: 1 }, 0)
          .to(meta, { x: 8 }, 0);

        card.addEventListener("mouseenter", () => hover.play());
        card.addEventListener("mouseleave", () => hover.reverse());
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const openLightbox = (work: WorkItem) => setLightboxWork(work);
  const closeLightbox = () => setLightboxWork(null);

  return (
    <section
      id="works"
      ref={rootRef}
      className="relative theme-surface overflow-hidden"
      data-nav-theme="dark"
    >
      <div ref={pinRef} className="relative px-3 md:px-10 lg:px-12">
        <h2
          data-works-title
          className="font-display pt-[calc(var(--nav-height)+1.25rem)] text-center text-[clamp(2rem,6.2vw,5.25rem)] uppercase leading-[0.88] text-[var(--color-fg)] will-change-transform"
        >
          Selected
          <br />
          Works
          <br />
          (2023-2026)
        </h2>

        <div className="grid grid-cols-2 items-start gap-2 pt-8 md:grid-cols-12 md:gap-2.5 md:gap-y-8 md:pt-24">
          {WORKS.map((work) => (
            <WorkCard key={work.id} work={work} onImageClick={openLightbox} />
          ))}
        </div>
      </div>

      <div className="relative px-3 md:px-10 lg:px-12">
        <div className="grid grid-cols-2 items-start gap-1.5 pt-8 md:grid-cols-12 md:gap-2.5 md:pt-16 md:gap-y-8">
          {WEBSITE_WORKS.map((work) => (
            <WorkCard key={work.id} work={work} columns={2} />
          ))}
        </div>

        <PosAdShowcase />

        <NomadWorkCanvas />
      </div>
      <WorkLightbox work={lightboxWork} onClose={closeLightbox} />
      <div className="h-6 md:h-10" aria-hidden />
    </section>
  );
}
