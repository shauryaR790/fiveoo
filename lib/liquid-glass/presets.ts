export type LiquidGlassMode = "standard" | "polar" | "prominent" | "shader";

export type LiquidGlassPreset = {
  displacementScale: number;
  blurAmount: number;
  saturation: number;
  aberrationIntensity: number;
  cornerRadius: number;
  elasticity: number;
  mode: LiquidGlassMode;
  padding?: string;
};

/** Apple-inspired material recipes tuned for FIVEO’s dark-first studio UI. */
export const LIQUID_GLASS_PRESETS = {
  /** Floating navigation capsule / dock */
  nav: {
    displacementScale: 48,
    blurAmount: 0.14,
    saturation: 170,
    aberrationIntensity: 1.4,
    cornerRadius: 999,
    elasticity: 0,
    mode: "standard" as const,
    padding: "8px 12px",
  },
  /** Pricing / content cards */
  card: {
    displacementScale: 58,
    blurAmount: 0.11,
    saturation: 150,
    aberrationIntensity: 1.8,
    cornerRadius: 28,
    elasticity: 0,
    mode: "polar" as const,
    padding: "0",
  },
  /** Chat drawer / large panels */
  panel: {
    displacementScale: 42,
    blurAmount: 0.14,
    saturation: 140,
    aberrationIntensity: 1.2,
    cornerRadius: 32,
    elasticity: 0,
    mode: "standard" as const,
    padding: "0",
  },
  /** Compact controls (chat trigger, icon buttons) */
  control: {
    displacementScale: 56,
    blurAmount: 0.09,
    saturation: 135,
    aberrationIntensity: 1.6,
    cornerRadius: 14,
    elasticity: 0.22,
    mode: "standard" as const,
    padding: "0",
  },
  /** Pill CTAs / badges */
  pill: {
    displacementScale: 64,
    blurAmount: 0.1,
    saturation: 130,
    aberrationIntensity: 2,
    cornerRadius: 999,
    elasticity: 0.28,
    mode: "standard" as const,
    padding: "10px 18px",
  },
  /** Soft chips (plan badges, tags) */
  chip: {
    displacementScale: 40,
    blurAmount: 0.08,
    saturation: 125,
    aberrationIntensity: 1.2,
    cornerRadius: 999,
    elasticity: 0.12,
    mode: "standard" as const,
    padding: "10px 18px",
  },
} satisfies Record<string, LiquidGlassPreset>;

export type LiquidGlassPresetName = keyof typeof LIQUID_GLASS_PRESETS;
