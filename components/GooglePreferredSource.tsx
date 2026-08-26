"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function GooglePreferredSource() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.querySelector("[google-add-preferred-source-btn]")) return;

    const badge = document.createElement("div");
    badge.setAttribute("google-add-preferred-source-btn", "");
    badge.setAttribute("data-theme", "dark");
    badge.setAttribute("data-lang", "en");
    host.appendChild(badge);
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      const badge = hostRef.current?.querySelector(
        "[google-add-preferred-source-btn]",
      );
      if (!badge) return;
      badge.setAttribute(
        "data-theme",
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
      <div ref={hostRef} className="google-preferred-source-host min-h-10" />
    </>
  );
}
