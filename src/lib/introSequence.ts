/**
 * Shared contract between the intro overlay and the hero entrance so the two
 * read as one continuous sequence: runner intro -> curtain reveal -> hero.
 */

export const INTRO_SEEN_KEY = "shon-intro-seen";

/** Fired on `window` when the curtain has cleared enough of the hero to start it. */
export const HERO_REVEAL_EVENT = "shon:hero-reveal";

/**
 * Offset into the 2.4s curtain wipe at which the hero entrance starts.
 * The wipe eases from left to right, so by ~1.15s the centred hero column is
 * clear and only the far right edge is still covered — the hero rises just
 * behind the moving edge instead of waiting for the curtain to finish.
 */
export const HERO_REVEAL_AT_MS = 1150;
