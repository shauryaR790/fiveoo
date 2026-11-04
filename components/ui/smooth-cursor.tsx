"use client";

import {
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

/** True desktop pointer only — avoids dual cursors on touch / hybrid Macs. */
const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

const COLOR_SPRING = {
  stiffness: 280,
  damping: 32,
  mass: 0.85,
  restDelta: 0.001,
};

function isTrackablePointer(pointerType: string) {
  return pointerType === "mouse" || pointerType === "pen";
}

function parseRgb(
  color: string,
): { r: number; g: number; b: number; a: number } | null {
  if (!color || color === "transparent") return null;

  const rgbMatch = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/,
  );
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : 1,
    };
  }

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex.slice(0, 6);

    if (normalized.length !== 6) return null;

    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
      a: 1,
    };
  }

  return null;
}

function getRelativeLuminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isLightBackgroundAt(x: number, y: number) {
  let node = document.elementFromPoint(x, y);

  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const parsed = parseRgb(style.backgroundColor);

    if (parsed && parsed.a > 0.08) {
      return getRelativeLuminance(parsed.r, parsed.g, parsed.b) > 0.62;
    }

    node = node.parentElement;
  }

  return false;
}

const DefaultCursorSVG: FC<{ theme: MotionValue<number> }> = ({ theme }) => {
  const fill = useTransform(theme, [0, 1], ["#ffffff", "#000000"]);
  const stroke = useTransform(theme, [0, 1], ["#000000", "#ffffff"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
      aria-hidden
    >
      <g filter="url(#smooth-cursor-shadow)">
        <motion.path
          d="M25 3.5L43.5 40.5L25 33.5L6.5 40.5L25 3.5Z"
          fill={fill}
        />
        <motion.path
          d="M25 5.5L41.2 39.2L25 32.8L8.8 39.2L25 5.5Z"
          stroke={stroke}
          strokeWidth={2.25}
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="smooth-cursor-shadow"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

function hideSystemCursor() {
  document.documentElement.classList.add("has-custom-cursor");
  document.documentElement.style.setProperty("cursor", "none", "important");
  document.body?.style.setProperty("cursor", "none", "important");
}

function showSystemCursor() {
  document.documentElement.classList.remove("has-custom-cursor");
  document.documentElement.style.removeProperty("cursor");
  document.body?.style.removeProperty("cursor");
}

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const cursorTheme = useSpring(0, COLOR_SPRING);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);

    const updateEnabled = () => {
      const nextIsEnabled = mediaQuery.matches;
      setIsEnabled(nextIsEnabled);

      if (!nextIsEnabled) {
        setIsVisible(false);
        showSystemCursor();
      }
    };

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
      showSystemCursor();
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | null = null;
    hideSystemCursor();

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const smoothPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      setIsVisible(true);
      hideSystemCursor();

      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);

      cursorTheme.set(isLightBackgroundAt(currentPos.x, currentPos.y) ? 1 : 0);

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2),
      );

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      // Arrow tip points up by default → +90° so it aims along movement.
      if (speed > 0.08) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);

        if (timeout !== null) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          scale.set(1);
        }, 150);
      }
    };

    let rafId = 0;
    const throttledPointerMove = (e: PointerEvent) => {
      if (!isTrackablePointer(e.pointerType)) {
        return;
      }

      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        smoothPointerMove(e);
        rafId = 0;
      });
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => hideSystemCursor();

    window.addEventListener("pointermove", throttledPointerMove, {
      passive: true,
    });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", throttledPointerMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      showSystemCursor();
      if (rafId) cancelAnimationFrame(rafId);
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [cursorX, cursorY, cursorTheme, rotation, scale, isEnabled]);

  if (!isEnabled) {
    return null;
  }

  const cursorNode = cursor ?? <DefaultCursorSVG theme={cursorTheme} />;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 10001,
        pointerEvents: "none",
        willChange: "transform",
        opacity: isVisible ? 1 : 0,
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.15,
      }}
    >
      {cursorNode}
    </motion.div>
  );
}
