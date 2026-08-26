"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { WorkItem } from "@/lib/constants";
import { getLenis } from "@/lib/lenis";

type WorkLightboxProps = {
  work: WorkItem | null;
  onClose: () => void;
};

export default function WorkLightbox({ work, onClose }: WorkLightboxProps) {
  useEffect(() => {
    if (!work) return;

    const lenis = getLenis();
    lenis?.stop();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
    };
  }, [work, onClose]);

  if (!work) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`View ${work.title}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-2xl"
        onClick={onClose}
        aria-label="Close preview"
      />

      <div className="relative z-10 flex max-h-[92svh] w-full max-w-[min(92vw,1100px)] flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:-top-3 md:-right-3"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M2 2l10 10M12 2 2 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="overflow-hidden rounded-sm shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <Image
            src={work.src}
            alt={work.title}
            width={1600}
            height={2000}
            unoptimized
            className="block h-auto max-h-[82svh] w-full object-contain"
            sizes="92vw"
            priority
          />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4 px-1 text-white">
          <div>
            <p className="font-display text-lg uppercase leading-tight md:text-xl">
              {work.title}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {work.client} · {work.year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
