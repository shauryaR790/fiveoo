"use client";

import Script from "next/script";

export default function GooglePreferredSource() {
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
    </div>
  );
}
