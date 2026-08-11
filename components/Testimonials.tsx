"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { TESTIMONIALS } from "@/lib/constants";
import { fadeUp } from "@/lib/animations";
export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string>("02");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      fadeUp(root.querySelectorAll("[data-partner-reveal]"), {
        trigger: root,
        stagger: 0.08,
        y: 28,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="partners"
      ref={rootRef}
      className="relative overflow-hidden bg-black px-5 pb-10 pt-20 text-white md:px-10 md:pb-12 md:pt-28 lg:px-16"
      data-nav-theme="dark"
      aria-label="Our partners"
      style={{ fontFamily: "var(--font-card)" }}
    >
      <h2
        data-partner-reveal
        className="font-display mb-14 text-[clamp(3.25rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.055em] md:mb-20 md:whitespace-nowrap"
      >
        Our Partner Says
      </h2>

      <div className="w-full">
        {TESTIMONIALS.map((item, index) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              data-partner-reveal
              className={`glass glass-panel overflow-hidden rounded-2xl ${index === 0 ? "" : "mt-3"}`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? "" : item.id)}
                className="grid w-full grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem_2.5rem] items-center gap-3 py-6 text-left md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)_6rem_2.75rem] md:gap-6 md:py-8"
              >
                <span className="text-[15px] font-medium tracking-[-0.02em] md:text-[17px]">
                  ({item.id})
                </span>

                <span className="flex min-w-0 items-center">
                  <span
                    className={`relative h-9 shrink-0 overflow-hidden rounded-full bg-black/10 transition-[width,margin,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-10 ${
                      isOpen
                        ? "mr-3 w-9 opacity-100 md:mr-3.5 md:w-10"
                        : "mr-0 w-0 opacity-0"
                    }`}
                  >
                    <Image
                      src={item.avatar}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <span className="truncate text-[16px] font-normal tracking-[-0.02em] md:text-[19px]">
                    {item.name}
                  </span>
                </span>

                <span className="flex min-w-0 items-center">
                  <span
                    className={`relative h-9 shrink-0 overflow-hidden rounded-full bg-black transition-[width,margin,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-10 ${
                      isOpen
                        ? "mr-3 w-9 opacity-100 md:mr-3.5 md:w-10"
                        : "mr-0 w-0 opacity-0"
                    }`}
                  >
                    <Image
                      src={item.logo}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                  <span className="truncate text-[16px] font-normal tracking-[-0.02em] md:text-[19px]">
                    {item.company}
                  </span>
                </span>

                <span className="text-[15px] font-normal tracking-[-0.02em] md:text-[17px]">
                  {item.year}
                </span>

                <span
                  className="glass glass-chip flex h-9 w-9 items-center justify-center rounded-full md:h-10 md:w-10"
                  aria-hidden
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      d="M3.2 5.2 7 9l3.8-3.8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-10 pb-10 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)_6rem_2.75rem] md:gap-6 md:pb-14">
                    <div className="hidden md:block" aria-hidden />
                    <div>
                      <p className="mb-4 text-[13px] font-medium tracking-[-0.01em] text-white/45 md:text-[14px]">
                        Feedback
                      </p>
                      <p className="max-w-[34rem] text-[22px] font-normal leading-[1.3] tracking-[-0.02em] text-white md:text-[28px]">
                        {item.feedback}
                      </p>
                    </div>

                    <div className="md:col-span-3">
                      <p className="mb-4 text-[13px] font-medium tracking-[-0.01em] text-white/45 md:text-[14px]">
                        Services
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {item.services.map((service) => (
                          <span
                            key={service}
                            className="glass glass-chip glass-pill px-4 py-2 text-[13px] font-normal tracking-[-0.015em] md:px-5 md:py-2.5 md:text-[14px]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
