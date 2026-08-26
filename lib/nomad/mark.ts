const SVG = "http://www.w3.org/2000/svg";
const FI_GAP = 5;
const FONT = 'italic 700 58px Georgia, "Times New Roman", Times, serif';

export const MARK_DURATION = 4800;
export const MARK_DURATION_REDUCED = 900;

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const elasticOut = (t: number) => {
  if (t === 0 || t === 1) return t;
  return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

type MarkState = {
  wordG: SVGGElement;
  maskRect: SVGRectElement | null;
  starG: SVGGElement;
  dock: { x: number; y: number; rot: number };
  bb: DOMRect;
};

function buildStar(g: SVGGElement, color: string) {
  g.replaceChildren();
  for (let i = 0; i < 6; i++) {
    const ln = document.createElementNS(SVG, "line");
    ln.setAttribute("x1", "0");
    ln.setAttribute("y1", "0");
    ln.setAttribute("x2", "0");
    ln.setAttribute("y2", "-11");
    ln.setAttribute("stroke", color);
    ln.setAttribute("stroke-width", "3.1");
    ln.setAttribute("stroke-linecap", "butt");
    ln.setAttribute("transform", `rotate(${i * 60})`);
    g.append(ln);
  }
}

function placeStar(
  star: SVGGElement,
  x: number,
  y: number,
  rot: number,
  scale = 1,
) {
  star.setAttribute(
    "transform",
    `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(1)}) scale(${scale.toFixed(3)})`,
  );
}

export async function initMark(svg: SVGSVGElement, ink = "#ffffff") {
  const color = ink === "currentColor" ? "currentColor" : ink;
  try {
    await document.fonts.load("700 58px Georgia");
  } catch {
    /* serif fallback */
  }

  const wordG = svg.querySelector(".mark__word") as SVGGElement | null;
  const maskRect = svg.querySelector(".mark__mask-rect") as SVGRectElement | null;
  const starG = svg.querySelector(".mark__star") as SVGGElement | null;
  if (!wordG || !starG) return;

  wordG.replaceChildren();

  const text = document.createElementNS(SVG, "text");
  text.setAttribute("x", "240");
  text.setAttribute("y", "78");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "58");
  text.setAttribute("font-weight", "700");
  text.setAttribute("font-style", "italic");
  text.setAttribute("font-family", 'Georgia, "Times New Roman", Times, serif');
  text.setAttribute("fill", color);

  const tF = document.createElementNS(SVG, "tspan");
  tF.textContent = "f";
  const tRest = document.createElementNS(SVG, "tspan");
  tRest.setAttribute("dx", String(FI_GAP));
  tRest.textContent = "iveo";
  text.append(tF, tRest);
  wordG.append(text);

  const bb = text.getBBox();
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return;

  ctx.font = FONT;
  const prefixW = ctx.measureText("f").width + FI_GAP + ctx.measureText("ive").width;
  const totalW = prefixW + ctx.measureText("o").width;
  const oLeft = bb.x + (bb.width - totalW) / 2 + prefixW;
  const oW = ctx.measureText("o").width;
  const dock = { x: oLeft + oW * 0.88 + 8, y: bb.y + 12, rot: 16 };

  buildStar(starG, color);
  placeStar(starG, dock.x, dock.y, dock.rot, 0);

  (svg as SVGSVGElement & { _markState?: MarkState })._markState = {
    wordG,
    maskRect,
    starG,
    dock,
    bb,
  };
}

export function setMarkFinal(svg: SVGSVGElement) {
  const state = (svg as SVGSVGElement & { _markState?: MarkState })._markState;
  if (!state) return;

  const { wordG, maskRect, starG, dock, bb } = state;

  wordG.style.opacity = "1";
  wordG.style.filter = "none";

  if (maskRect) {
    maskRect.setAttribute("x", String(bb.x - 20));
    maskRect.setAttribute("y", String(bb.y - 20));
    maskRect.setAttribute("height", String(bb.height + 40));
    maskRect.setAttribute("width", String(bb.width + 40));
  }

  placeStar(starG, dock.x, dock.y, dock.rot, 1);
  starG.style.opacity = "1";
}

export function cropMarkViewBox(svg: SVGSVGElement, padding = 2) {
  const state = (svg as SVGSVGElement & { _markState?: MarkState })._markState;
  if (!state) return;

  const { bb, dock } = state;
  const starPad = 14;
  const minX = bb.x - padding;
  const minY = bb.y - starPad - padding;
  const maxX = Math.max(bb.x + bb.width, dock.x + starPad) + padding;
  const maxY = bb.y + bb.height + padding;

  svg.setAttribute(
    "viewBox",
    `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
  );
}

export function playMark(
  svg: SVGSVGElement,
  { reduced = false }: { reduced?: boolean } = {},
) {
  const state = (svg as SVGSVGElement & { _markState?: MarkState })._markState;
  if (!state) return Promise.resolve();

  const duration = reduced ? MARK_DURATION_REDUCED : MARK_DURATION;
  const { wordG, maskRect, starG, dock, bb } = state;

  if (reduced) {
    wordG.style.opacity = "1";
    wordG.style.filter = "none";
    if (maskRect) maskRect.setAttribute("width", String(bb.width + 40));
    placeStar(starG, dock.x, dock.y, dock.rot, 1);
    starG.style.opacity = "1";
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  const WORD_IN = 900;
  const STAR_AT = 1100;
  const STAR_POP = 480;

  return new Promise<void>((resolve) => {
    const t0 = performance.now();
    const maskX = bb.x - 20;
    const maskW = bb.width + 40;

    const tick = (now: number) => {
      const t = now - t0;

      if (t < WORD_IN) {
        const p = easeOutExpo(t / WORD_IN);
        if (maskRect) {
          maskRect.setAttribute("x", String(maskX));
          maskRect.setAttribute("y", String(bb.y - 20));
          maskRect.setAttribute("height", String(bb.height + 40));
          maskRect.setAttribute("width", String(maskW * p));
        }
        const blur = (1 - p) * 5;
        wordG.style.opacity = String(Math.min(1, p * 1.2));
        wordG.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";
      } else {
        if (maskRect) maskRect.setAttribute("width", String(maskW));
        wordG.style.opacity = "1";
        wordG.style.filter = "none";
      }

      if (t < STAR_AT) {
        starG.style.opacity = "0";
        placeStar(starG, dock.x, dock.y, dock.rot, 0);
      } else if (t < STAR_AT + STAR_POP) {
        const p = elasticOut((t - STAR_AT) / STAR_POP);
        starG.style.opacity = String(Math.min(1, (t - STAR_AT) / 120));
        placeStar(starG, dock.x, dock.y, dock.rot, p);
      } else {
        starG.style.opacity = "1";
        placeStar(starG, dock.x, dock.y, dock.rot, 1);
      }

      if (t < duration) requestAnimationFrame(tick);
      else resolve();
    };

    if (maskRect) {
      maskRect.setAttribute("x", String(maskX));
      maskRect.setAttribute("y", String(bb.y - 20));
      maskRect.setAttribute("height", String(bb.height + 40));
      maskRect.setAttribute("width", "0");
    }
    wordG.style.opacity = "0";
    starG.style.opacity = "0";

    requestAnimationFrame(tick);
  });
}
