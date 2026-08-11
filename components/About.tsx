"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "@/components/Marquee";
import { fadeUp, bindCursorSlideTrack } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-about-reveal]"), {
        trigger: root,
        stagger: 0.12,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const slide = slideRef.current;
    if (!track || !slide) return;

    return bindCursorSlideTrack(track, slide);
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative bg-transparent pb-14 text-white md:pb-20"
      data-nav-theme="dark"
    >
      <div className="relative z-[1]">
        <Marquee
        label="FiveoStudio"
        reversed
        duration={75}
        className="pt-2 md:pt-3"
        textClassName="text-[clamp(4.5rem,15vw,14rem)] text-white"
        glyphClassName="h-[clamp(3.75rem,12.5vw,11.5rem)] w-[clamp(3.75rem,12.5vw,11.5rem)]"
      />

      <div className="mt-24 px-5 md:mt-32 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-8">
          <div data-about-reveal className="hidden md:block lg:pt-2">
            <div ref={trackRef} className="relative w-full">
              <div
                ref={slideRef}
                data-cursor-grow
                className="w-full max-w-[420px] will-change-transform lg:w-[420px] lg:max-w-none"
              >
                <div className="glass glass-frame relative aspect-video w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/reels.avif"
                    alt="FIVEO showreels"
                    fill
                    sizes="420px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass glass-panel flex flex-col gap-10 rounded-3xl p-6 md:p-8">
            <div data-about-reveal>
              <p className="mb-5 text-[17px] leading-[1.6]">About Us</p>
              <p className="text-[17px] leading-[1.6] text-white/85">
                At FIVEO, we&apos;re not just a design team — we&apos;re your
                creative partners. We help brands grow with smart, consistent,
                and purpose-driven design. From startups to scale-ups, our
                subscription-based model gives you the flexibility to get
                top-tier branding without the traditional agency fuss.
              </p>
            </div>

            <div data-about-reveal>
              <p className="mb-5 text-[17px] leading-[1.6]">Our idealist</p>
              <p className="text-[17px] leading-[1.6] text-white/85">
                We believe great design is not just about how it looks — it&apos;s
                about how it works. That&apos;s why we take the time to
                understand your business, your goals, and your audience,
                delivering visual systems that are as strategic as they are
                stunning.{" "}
                <span className="font-semibold text-white">
                  Built for brands that move fast, think big, and value
                  thoughtful design.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
