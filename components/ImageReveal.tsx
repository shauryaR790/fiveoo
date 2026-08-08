"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { imageReveal, prefersReducedMotion } from "@/lib/animations";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export default function ImageReveal({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      imageReveal(media, { trigger: root, scaleFrom: 1.12 });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`}>
      <div
        ref={mediaRef}
        className={`relative h-full w-full will-change-transform ${imageClassName}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={src.endsWith(".svg")}
          className="object-cover"
        />
      </div>
    </div>
  );
}
