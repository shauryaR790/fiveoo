"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from "@/lib/liquid-glass/maps";
import {
  LIQUID_GLASS_PRESETS,
  type LiquidGlassMode,
  type LiquidGlassPresetName,
} from "@/lib/liquid-glass/presets";
import { cn } from "@/lib/utils";

type GlassSize = { width: number; height: number };

function getMap(mode: LiquidGlassMode) {
  switch (mode) {
    case "polar":
      return polarDisplacementMap;
    case "prominent":
      return prominentDisplacementMap;
    case "shader":
    case "standard":
    default:
      return displacementMap;
  }
}

function GlassFilter({
  id,
  displacementScale,
  aberrationIntensity,
  width,
  height,
  mode,
}: {
  id: string;
  displacementScale: number;
  aberrationIntensity: number;
  width: number;
  height: number;
  mode: LiquidGlassMode;
}) {
  const scale = displacementScale * (mode === "shader" ? 1 : -1);

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
      width={width}
      height={height}
      aria-hidden
    >
      <defs>
        <filter
          id={id}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            result="DISPLACEMENT_MAP"
            href={getMap(mode)}
            preserveAspectRatio="xMidYMid slice"
          />
          <feColorMatrix
            in="DISPLACEMENT_MAP"
            type="matrix"
            values="0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0 0 0 1 0"
            result="EDGE_INTENSITY"
          />
          <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
            <feFuncA
              type="discrete"
              tableValues={`0 ${aberrationIntensity * 0.05} 1`}
            />
          </feComponentTransfer>
          <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="B"
            result="RED_DISPLACED"
          />
          <feColorMatrix
            in="RED_DISPLACED"
            type="matrix"
            values="1 0 0 0 0
                 0 0 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
            result="RED_CHANNEL"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            scale={scale - aberrationIntensity * 0.05 * (mode === "shader" ? -1 : 1)}
            xChannelSelector="R"
            yChannelSelector="B"
            result="GREEN_DISPLACED"
          />
          <feColorMatrix
            in="GREEN_DISPLACED"
            type="matrix"
            values="0 0 0 0 0
                 0 1 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
            result="GREEN_CHANNEL"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="DISPLACEMENT_MAP"
            scale={scale - aberrationIntensity * 0.1 * (mode === "shader" ? -1 : 1)}
            xChannelSelector="R"
            yChannelSelector="B"
            result="BLUE_DISPLACED"
          />
          <feColorMatrix
            in="BLUE_DISPLACED"
            type="matrix"
            values="0 0 0 0 0
                 0 0 0 0 0
                 0 0 1 0 0
                 0 0 0 1 0"
            result="BLUE_CHANNEL"
          />
          <feBlend
            in="GREEN_CHANNEL"
            in2="BLUE_CHANNEL"
            mode="screen"
            result="GB_COMBINED"
          />
          <feBlend
            in="RED_CHANNEL"
            in2="GB_COMBINED"
            mode="screen"
            result="RGB_COMBINED"
          />
          <feGaussianBlur
            in="RGB_COMBINED"
            stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)}
            result="ABERRATED_BLURRED"
          />
          <feComposite
            in="ABERRATED_BLURRED"
            in2="EDGE_MASK"
            operator="in"
            result="EDGE_ABERRATION"
          />
          <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feComposite
            in="CENTER_ORIGINAL"
            in2="INVERTED_MASK"
            operator="in"
            result="CENTER_CLEAN"
          />
          <feComposite
            in="EDGE_ABERRATION"
            in2="CENTER_CLEAN"
            operator="over"
          />
        </filter>
      </defs>
    </svg>
  );
}

function usePrefersReducedEffects() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 767px)");

    const sync = () => {
      // SVG displacement is expensive; keep CSS glass on phones / reduced motion.
      setReduced(motion.matches || (coarse.matches && narrow.matches));
    };

    sync();
    motion.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  return reduced;
}

export type LiquidGlassProps = {
  children: ReactNode;
  preset?: LiquidGlassPresetName;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  cornerRadius?: number;
  mode?: LiquidGlassMode;
  padding?: string;
  overLight?: boolean;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  as?: "div" | "button" | "span" | "a";
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-pressed"?: boolean;
  "data-chatbot-trigger"?: string;
};

/**
 * Layout-safe Apple liquid glass surface.
 * Built from rdev/liquid-glass-react refraction filters without the floating
 * center transform that the upstream default export forces.
 */
export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(
  function LiquidGlass(
    {
      children,
      preset = "card",
      displacementScale,
      blurAmount,
      saturation,
      aberrationIntensity,
      cornerRadius,
      mode,
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
    const resolved = {
      displacementScale: displacementScale ?? recipe.displacementScale,
      blurAmount: blurAmount ?? recipe.blurAmount,
      saturation: saturation ?? recipe.saturation,
      aberrationIntensity: aberrationIntensity ?? recipe.aberrationIntensity,
      cornerRadius: cornerRadius ?? recipe.cornerRadius,
      mode: mode ?? recipe.mode,
      padding: padding ?? recipe.padding ?? "0",
    };

    const filterId = useId().replace(/:/g, "");
    const rootRef = useRef<HTMLElement | null>(null);
    const [size, setSize] = useState<GlassSize>({ width: 320, height: 120 });
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const reduced = usePrefersReducedEffects();
    const [isFirefox, setIsFirefox] = useState(false);

    useEffect(() => {
      setIsFirefox(navigator.userAgent.toLowerCase().includes("firefox"));
    }, []);

    useEffect(() => {
      const node = rootRef.current;
      if (!node) return;

      const update = () => {
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSize({
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      };

      update();
      const observer = new ResizeObserver(update);
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    const blurPx = (overLight ? 12 : 4) + resolved.blurAmount * 32;
    const useSvgFilter = !reduced && !isFirefox && size.width > 0;

    const backdropStyle: CSSProperties = {
      borderRadius: `${resolved.cornerRadius}px`,
      backdropFilter: `blur(${blurPx}px) saturate(${resolved.saturation}%)`,
      WebkitBackdropFilter: `blur(${blurPx}px) saturate(${resolved.saturation}%)`,
      filter: useSvgFilter ? `url(#lg-${filterId})` : undefined,
      background: overLight
        ? "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.18))"
        : "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
    };

    const highlightAngle = 135 + mouseOffset.x * 1.2;
    const interactive = Boolean(onClick) || as === "button" || as === "a";

    const setRefs = (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const sharedProps = {
      ref: setRefs,
      className: cn(
        "liquid-glass group/glass relative isolate block max-w-full",
        interactive && !disabled && "cursor-pointer",
        disabled && "pointer-events-none opacity-40",
        className,
      ),
      style: {
        borderRadius: `${resolved.cornerRadius}px`,
        ...style,
      } as CSSProperties,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false);
        setActive(false);
        setMouseOffset({ x: 0, y: 0 });
      },
      onMouseDown: () => {
        if (!disabled) setActive(true);
      },
      onMouseUp: () => setActive(false),
      onMouseMove: (event: ReactMouseEvent<HTMLElement>) => {
        if (reduced || disabled) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setMouseOffset({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 100,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 100,
        });
      },
      onClick: disabled ? undefined : onClick,
      ...aria,
    };

    const body = (
      <>
        {useSvgFilter ? (
          <GlassFilter
            id={`lg-${filterId}`}
            displacementScale={
              overLight
                ? resolved.displacementScale * 0.5
                : resolved.displacementScale
            }
            aberrationIntensity={resolved.aberrationIntensity}
            width={size.width}
            height={size.height}
            mode={resolved.mode}
          />
        ) : null}

        <span
          className="liquid-glass__material pointer-events-none absolute inset-0 overflow-hidden transition-[box-shadow,transform] duration-200 ease-out"
          style={{
            ...backdropStyle,
            boxShadow: overLight
              ? "0 16px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.45)"
              : "0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
            transform: active && interactive ? "scale(0.985)" : "scale(1)",
          }}
          aria-hidden
        />

        {/* Specular rim — Apple edge light */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            borderRadius: `${resolved.cornerRadius}px`,
            padding: "1.25px",
            opacity: hovered ? 0.9 : 0.65,
            mixBlendMode: "screen",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            background: `linear-gradient(
              ${highlightAngle}deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,${0.14 + Math.abs(mouseOffset.x) * 0.006}) 34%,
              rgba(255,255,255,${0.42 + Math.abs(mouseOffset.x) * 0.01}) 66%,
              rgba(255,255,255,0) 100%
            )`,
            boxShadow:
              "inset 0 0 0 0.5px rgba(255,255,255,0.35), inset 0 1px 2px rgba(255,255,255,0.2)",
          }}
          aria-hidden
        />

        <span
          className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-200"
          style={{
            borderRadius: `${resolved.cornerRadius}px`,
            opacity: hovered || active ? 0.55 : 0.28,
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)",
          }}
          aria-hidden
        />

        <div
          className={cn(
            "relative z-[1] flex w-full min-w-0",
            contentClassName,
          )}
          style={{ padding: resolved.padding }}
        >
          {children}
        </div>
      </>
    );

    if (as === "a" && href) {
      return (
        <a href={href} {...sharedProps}>
          {body}
        </a>
      );
    }

    if (as === "button") {
      return (
        <button type={type} disabled={disabled} {...sharedProps}>
          {body}
        </button>
      );
    }

    if (as === "span") {
      return (
        <span {...sharedProps}>
          {body}
        </span>
      );
    }

    return (
      <div {...sharedProps}>
        {body}
      </div>
    );
  },
);

export default LiquidGlass;
