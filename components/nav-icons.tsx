import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function iconClass(className?: string) {
  return className ?? "h-[22px] w-[22px]";
}

export function AboutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} aria-hidden>
      <circle cx="9" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.8 19.2c.6-3 2.8-4.6 5.2-4.6s4.6 1.6 5.2 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16.6" cy="8.4" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.2 14.8c1.7-.3 3.2.4 4 1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorksIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ServicesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} aria-hidden>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CareersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} aria-hidden>
      <rect x="3.5" y="8" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 8V6.8A1.8 1.8 0 0 1 10.8 5h2.4A1.8 1.8 0 0 1 15 6.8V8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3.5 13h17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PricingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={iconClass(className)} aria-hidden>
      <path
        d="M12.8 3.6 20.4 11a2 2 0 0 1 0 2.8l-6.6 6.6a2 2 0 0 1-2.8 0L3.6 12.8V3.6h9.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.35" fill="currentColor" />
    </svg>
  );
}

export const NAV_LINK_ICONS: Record<string, (props: IconProps) => ReactNode> = {
  "#about": AboutIcon,
  "#works": WorksIcon,
  "#services": ServicesIcon,
  "#careers": CareersIcon,
  "#pricing": PricingIcon,
};
