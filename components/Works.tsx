"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WORKS, WEBSITE_WORKS, type WorkItem } from "@/lib/constants";
import NomadWorkCanvas from "@/components/NomadWorkCanvas";
import WorkLightbox from "@/components/WorkLightbox";
import GlassFolder, {
  type FolderFile,
} from "@/components/ui/glass-folder-cards";
import {
  prefersReducedMotion,
  isMobileViewport,
  setNavInvert,
  fadeUp,
} from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

function workToFolderFile(work: WorkItem): FolderFile {
  const image = work.media === "video" ? work.poster : work.src;
  return {
    name: work.title,
    meta: `${work.client} · ${work.year}`,
    image,
    href: work.href,
  };
}

function useFolderWidth() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => (window.matchMedia("(max-width: 767px)").matches ? 280 : 320),
    () => 320,
  );
}

function WorkCollectionFolders({
  onSelectWork,
}: {
  onSelectWork: (work: WorkItem) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const folderWidth = useFolderWidth();
  const brandWorks = WORKS.slice(0, 3);
  const campaignWorks = WORKS.slice(3, 6);
  const webWorks = WEBSITE_WORKS.slice(0, 3);

  const openFrom = (pool: WorkItem[]) => (file: FolderFile) => {
    const match = pool.find((w) => w.title === file.name);
    // External sites use native <a href>; gallery pieces open the lightbox.
    if (!match || match.href) return;
    onSelectWork(match);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const heading = root.querySelector<HTMLElement>("[data-selection-heading]");
    const copy = root.querySelector<HTMLElement>("[data-selection-copy]");
    const folders = gsap.utils.toArray<HTMLElement>(
      "[data-work-folder]",
      root,
    );

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set([heading, copy, ...folders].filter(Boolean), {
          clearProps: "all",
        });
        return;
      }

      gsap.set([heading, copy].filter(Boolean), { y: 36, opacity: 0 });
      gsap.set(folders, { y: 110, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
        defaults: { ease: "power3.out" },
      });

      if (heading) {
        tl.to(heading, { y: 0, opacity: 1, duration: 0.75 }, 0);
      }
      if (copy) {
        tl.to(copy, { y: 0, opacity: 1, duration: 0.7 }, 0.12);
      }

      // Left → right: each folder starts when the previous is ~halfway up.
      folders.forEach((folder, index) => {
        tl.to(
          folder,
          { y: 0, opacity: 1, duration: 0.85 },
          0.28 + index * 0.42,
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="collection"
      ref={rootRef}
      className="relative mt-10 overflow-visible border-t border-[color-mix(in_srgb,var(--color-fg)_10%,transparent)] pt-8 md:mt-20 md:pt-16"
    >
      <div className="mb-6 flex flex-col gap-5 md:mb-10 md:gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2
          data-selection-heading
          className="font-display text-left text-[clamp(1.85rem,9vw,5.25rem)] uppercase leading-[0.88] tracking-[-0.03em] text-[var(--color-fg)] md:text-[clamp(2rem,6.2vw,5.25rem)]"
        >
          Work
          <br />
          selection
        </h2>
        <p
          data-selection-copy
          className="max-w-[34rem] font-[family-name:var(--font-card)] text-[14px] font-light leading-[1.55] tracking-[-0.02em] text-[var(--color-fg)]/90 md:text-[17px] lg:max-w-[38%] lg:text-[18px]"
        >
          Open a folder to browse selected brand systems, websites, and campaign
          pieces in one place. Hover to lean the glass, click to fan the files,
          and jump straight into the work—each collection is curated so you can
          move fast from first look to full project context without leaving the
          page.
        </p>
      </div>

      <div className="relative overflow-visible pt-4 md:pt-10">
        <div className="relative grid grid-cols-1 items-end justify-items-center gap-x-8 gap-y-10 overflow-visible md:grid-cols-2 md:gap-y-6 xl:grid-cols-3 xl:gap-x-10">
          <div data-work-folder className="w-full max-w-[320px] will-change-transform">
            <GlassFolder
              label="Brand"
              tone="dark"
              art="ember"
              seed={3}
              action="more"
              labelPlacement="top-left"
              appear={false}
              width={folderWidth}
              files={brandWorks.map(workToFolderFile)}
              menu={[{ label: "Browse gallery", onSelect: () => onSelectWork(brandWorks[0]) }]}
              onFileSelect={openFrom(brandWorks)}
            />
          </div>
          <div data-work-folder className="w-full max-w-[320px] will-change-transform">
            <GlassFolder
              label="Websites"
              tone="dark"
              art="glacier"
              seed={11}
              action="more"
              labelPlacement="top-left"
              appear={false}
              width={folderWidth}
              files={webWorks.map(workToFolderFile)}
              menu={[
                {
                  label: "Visit first site",
                  onSelect: () => {
                    if (webWorks[0]?.href) {
                      window.open(webWorks[0].href, "_blank", "noopener,noreferrer");
                    }
                  },
                },
              ]}
              onFileSelect={openFrom(webWorks)}
            />
          </div>
          <div
            data-work-folder
            className="w-full max-w-[320px] will-change-transform md:col-span-2 xl:col-span-1"
          >
            <GlassFolder
              label="Campaigns"
              tone="dark"
              art="dusk"
              seed={7}
              action="more"
              labelPlacement="top-right"
              appear={false}
              width={folderWidth}
              files={campaignWorks.map(workToFolderFile)}
              menu={[{ label: "Browse gallery", onSelect: () => onSelectWork(campaignWorks[0]) }]}
              onFileSelect={openFrom(campaignWorks)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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
      id="pos"
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
          src="/videos/web_pos.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-label="FIVEO POS software product demo"
          className="pointer-events-none block h-auto w-full max-w-none touch-pan-y object-contain [transform:translateZ(0)] [backface-visibility:hidden] md:pointer-events-auto"
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
      const uncover = pinRoot.querySelector<HTMLElement>("[data-works-uncover]");
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
        gsap.set([uncover, ...risers].filter(Boolean), { clearProps: "all" });
        return;
      }

      gsap.set(title, { transformOrigin: "top center" });
      gsap.set(uncover, { autoAlpha: 0, y: 80 });
      gsap.set(risers, { y: 120, opacity: 0 });

      const introScale = 2.2;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRoot,
          start: "top top",
          end: "+=120%",
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

      // Title settles at the top on black — then the section uncovers.
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
        { scale: 1, y: 0, ease: "power1.inOut", duration: 0.62 },
        0,
      )
        .to(
          uncover,
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.4 },
          0.58,
        )
        .to(
          risers,
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.42,
            stagger: 0.05,
          },
          0.64,
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
      className="relative bg-black text-white"
      data-nav-theme="dark"
    >
      <div
        ref={pinRef}
        className="relative min-h-0 overflow-visible bg-black px-3 pb-2 md:min-h-[100svh] md:px-10 md:pb-0 lg:px-12"
      >
        <h2
          data-works-title
          className="font-display pt-[calc(var(--nav-height)+0.85rem)] text-center text-[clamp(1.85rem,9vw,5.25rem)] uppercase leading-[0.88] text-white will-change-transform md:pt-[calc(var(--nav-height)+1.25rem)] md:text-[clamp(2rem,6.2vw,5.25rem)]"
        >
          Selected
          <br />
          Works
        </h2>

        <div data-works-uncover className="relative">
          <WorkCollectionFolders onSelectWork={openLightbox} />

          <div className="grid grid-cols-2 items-start gap-1.5 pt-8 md:grid-cols-12 md:gap-2.5 md:gap-y-8 md:pt-16">
            {WORKS.map((work) => (
              <WorkCard key={work.id} work={work} onImageClick={openLightbox} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-visible bg-black px-3 md:px-10 lg:px-12">
        <div className="grid grid-cols-2 items-start gap-1.5 pt-5 md:grid-cols-12 md:gap-2.5 md:pt-10 md:gap-y-8">
          {WEBSITE_WORKS.map((work) => (
            <WorkCard key={work.id} work={work} columns={2} />
          ))}
        </div>

        <PosAdShowcase />

        <NomadWorkCanvas />
      </div>
      <WorkLightbox work={lightboxWork} onClose={closeLightbox} />
      <div className="h-4 bg-black md:h-10" aria-hidden />
    </section>
  );
}
