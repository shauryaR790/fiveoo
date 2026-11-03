/**
 * Hero layout plans — flip `HERO_PLAN` when asked for “plan A” or “plan B”.
 *
 * Plan A — Large left FIVEO mark, no showcase reel, heading right.
 * Plan B — Larger nav FIVEO mark, original frontfiveo showreel (left), heading right.
 */
export type HeroPlan = "a" | "b";

export const HERO_PLAN: HeroPlan = "b";

export const isHeroPlanA = () => HERO_PLAN === "a";
export const isHeroPlanB = () => HERO_PLAN === "b";
