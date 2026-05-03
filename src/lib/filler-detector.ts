/**
 * Filler Word Detection Utility
 * Detects common filler words in a speech transcript.
 * Easily extensible by adding new entries to FILLERS.
 */

export type FillerCounts = {
  umm: number;
  uh: number;
  like: number;
  "you know": number;
  matlab: number;
  basically: number;
  [key: string]: number; // allow dynamic access
};

const FILLERS: (keyof FillerCounts)[] = [
  "umm",
  "uh",
  "like",
  "you know",
  "matlab",
  "basically",
];

/**
 * Detects filler words in a transcript.
 * @param transcript - The speech transcript string.
 * @returns An object with filler words as keys and occurrence counts as values.
 */
export function detectFillers(transcript: string): FillerCounts {
  const result: FillerCounts = {
    umm: 0,
    uh: 0,
    like: 0,
    "you know": 0,
    matlab: 0,
    basically: 0,
  };

  if (!transcript) return result;

  const normalized = transcript.toLowerCase();

  for (const filler of FILLERS) {
    const fillerStr = filler as string;
    // Use word boundary for single-word fillers, phrase match for multi-word
    const pattern = fillerStr.includes(" ")
      ? new RegExp(fillerStr.replace(" ", "\\s+"), "gi")
      : new RegExp(`\\b${fillerStr}\\b`, "gi");

    const matches = normalized.match(pattern);
    result[filler] = matches ? matches.length : 0;
  }

  return result;
}

/**
 * Gets total filler count from a FillerCounts object.
 */
export function getTotalFillers(fillers: FillerCounts): number {
  return Object.values(fillers).reduce((sum, count) => sum + count, 0);
}

/**
 * Gets the most used filler word.
 */
export function getMostUsedFiller(fillers: FillerCounts): string | null {
  const sorted = Object.entries(fillers).sort(([, a], [, b]) => b - a);
  return sorted[0]?.[1] > 0 ? sorted[0][0] : null;
}
