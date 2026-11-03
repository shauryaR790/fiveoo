type SiteLoaderPlayer = (options?: { duration?: number }) => Promise<void>;

let player: SiteLoaderPlayer | null = null;
let playQueue: Promise<void> = Promise.resolve();

export function registerSiteLoader(next: SiteLoaderPlayer | null) {
  player = next;
}

/** Replays the full-page FIVEO mark intro. Resolves once the overlay has faded out. */
export function playSiteLoader(options?: { duration?: number }) {
  if (!player) return Promise.resolve();

  const run = player;
  playQueue = playQueue.then(() => run(options)).catch(() => undefined);
  return playQueue;
}
