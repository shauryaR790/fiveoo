"use client";

import {
  forwardRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  LIQUID_GLASS_PRESETS,
  type LiquidGlassPresetName,
} from "@/lib/liquid-glass/presets";
import { cn } from "@/lib/utils";

export type LiquidGlassProps = {
  children: ReactNode;
  preset?: LiquidGlassPresetName;
  cornerRadius?: number;
  padding?: string;
  overLight?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  as?: "div" | "button" | "span" | "a";
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-pressed"?: boolean;
  "data-chatbot-trigger"?: string;
};

/**
 * Lightweight Apple-style glass pill — one surface only.
 * No SVG displacement filters (those tanked scroll perf).
 */
export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      children,
      preset = "pill",
      cornerRadius,
      padding,
      overLight = false,
      className,
      contentClassName,
      style,
      as = "div",
      href,
      type = "button",
      onClick,
      disabled = false,
      ...aria
    },
    forwardedRef,
  ) {
    const recipe = LIQUID_GLASS_PRESETS[preset];
    const radius = cornerRadius ?? recipe.cornerRadius;
    const pad = padding ?? recipe.padding ?? "10px 18px";
    const blurPx = 10 + recipe.blurAmount * 36;
    const interactive = Boolean(onClick) || as === "button" || as === "a";

    const surfaceStyle: CSSProperties = {
      borderRadius: `${radius}px`,
      padding: pad,
      backdropFilter: `blur(${blurPx}px) saturate(${Math.max(recipe.saturation, 160)}%)`,
      WebkitBackdropFilter: `blur(${blurPx}px) saturate(${Math.max(recipe.saturation, 160)}%)`,
      background: overLight
        ? "linear-gradient(165deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0.4) 100%)"
        : "linear-gradient(165deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.14) 100%)",
      border: "1px solid rgba(255,255,255,0.38)",
      boxShadow: overLight
        ? [
            "0 10px 32px rgba(0,0,0,0.22)",
            "inset 0 1px 0 rgba(255,255,255,0.75)",
            "inset 0 -1px 0 rgba(255,255,255,0.18)",
            "inset 1px 0 0 rgba(255,255,255,0.2)",
          ].join(", ")
        : [
            "0 10px 32px rgba(0,0,0,0.28)",
            "inset 0 1px 0 rgba(255,255,255,0.55)",
            "inset 0 -1px 0 rgba(255,255,255,0.12)",
            "inset 1px 0 0 rgba(255,255,255,0.16)",
            "inset -1px 0 0 rgba(255,255,255,0.06)",
          ].join(", "),
      ...style,
    };

    const shared = {
      ref: forwardedRef as never,
      className: cn(
        "liquid-glass relative inline-flex max-w-full items-center justify-center overflow-hidden [&>*]:relative [&>*]:z-[1] transition-[transform,opacity,box-shadow,filter] duration-300 ease-out",
        interactive &&
          !disabled &&
          "cursor-pointer hover:brightness-110 hover:saturate-150 active:scale-[0.98]",
        disabled && "pointer-events-none opacity-40",
        className,
        contentClassName,
      ),
      style: surfaceStyle,
      onClick: disabled ? undefined : onClick,
      ...aria,
    };

    if (as === "a" && href) {
      return (
        <a href={href} {...shared}>
          {children}
        </a>
      );
    }

    if (as === "button") {
      return (
        <button type={type} disabled={disabled} {...shared}>
          {children}
        </button>
      );
    }

    if (as === "span") {
      return <span {...shared}>{children}</span>;
    }

    return <div {...shared}>{children}</div>;
  },
);

export default LiquidGlass;
