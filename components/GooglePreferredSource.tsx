"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const PUBLISHER_SCRIPT = "https://news.google.com/swg/js/v1/publisher.js";

export default function GooglePreferredSource() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [showFallback, setShowFallback] = useState(false);

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

    const timer = window.setTimeout(() => {
      const badge = hostRef.current?.querySelector(
        "[google-add-preferred-source-btn]",
      );
      const rendered =
        badge &&
        (badge.childElementCount > 0 ||
          (badge.textContent?.trim().length ?? 0) > 0);
      if (!rendered) setShowFallback(true);
    }, 3500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const domain =
    typeof window !== "undefined" ? window.location.hostname : "fiveoo.com";
  const deeplink = `https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`;

  return (
    <div className="google-preferred-source-wrap">
      <Script
        src={PUBLISHER_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => {
          window.setTimeout(() => {
            const badge = hostRef.current?.querySelector(
              "[google-add-preferred-source-btn]",
            );
            const rendered =
              badge &&
              (badge.childElementCount > 0 ||
                (badge.textContent?.trim().length ?? 0) > 0);
            if (!rendered) setShowFallback(true);
          }, 2000);
        }}
      />
      <div ref={hostRef} className="google-preferred-source-host min-h-10">
        <div
          google-add-preferred-source-btn=""
          data-theme="dark"
          data-lang="en"
        />
      </div>
      {showFallback ? (
        <a
          href={deeplink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-fg)]/20 px-4 py-2 text-[13px] text-[var(--color-fg)] transition-opacity hover:opacity-70"
        >
          Add FIVEO as a Google Preferred Source
        </a>
      ) : null}
    </div>
  );
}
