"use client";

import Script from "next/script";

export default function GooglePreferredSource() {
  const deeplink =
    "https://www.google.com/preferences/source?q=" +
    encodeURIComponent(
      typeof window !== "undefined" ? window.location.hostname : "fiveoo.com",
    );

  return (
    <div className="google-preferred-source-wrap">
      <Script
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
      <div
        google-add-preferred-source-btn=""
        data-theme="dark"
        data-lang="en"
        className="google-preferred-source-host"
      />
      <a
        href={deeplink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-fg)]/20 px-4 py-2 text-[13px] text-[var(--color-fg)] transition-opacity hover:opacity-70"
      >
        Add FIVEO as a Google Preferred Source
      </a>
    </div>
  );
}
