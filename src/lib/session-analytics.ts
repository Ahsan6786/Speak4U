/**
 * Session Analytics Utility
 * Computes speaking metrics from a transcript.
 */

import { detectFillers, FillerCounts } from "./filler-detector";

export interface SessionMeta {
  words_spoken: number;
  speaking_pace_wpm: number;
  duration_seconds: number;
}

export interface SessionAnalytics {
  fillers: FillerCounts;
  meta: SessionMeta;
}

/**
 * Computes session analytics from a transcript.
 * @param transcript - The raw speech transcript.
 * @param durationSeconds - The duration of the recording in seconds (default: 60).
 */
export function computeSessionAnalytics(
  transcript: string,
  durationSeconds: number = 60
): SessionAnalytics {
  const words = transcript
    ? transcript.trim().split(/\s+/).filter(Boolean)
    : [];
  const words_spoken = words.length;
  const durationMinutes = durationSeconds / 60;
  const speaking_pace_wpm =
    durationMinutes > 0 ? Math.round(words_spoken / durationMinutes) : 0;

  const fillers = detectFillers(transcript);

  return {
    fillers,
    meta: {
      words_spoken,
      speaking_pace_wpm,
      duration_seconds: durationSeconds,
    },
  };
}

/**
 * Computes an average of a numeric field across sessions.
 */
export function computeAverage(
  sessions: any[],
  getter: (s: any) => number
): number {
  if (!sessions.length) return 0;
  const total = sessions.reduce((sum, s) => sum + (getter(s) || 0), 0);
  return Math.round(total / sessions.length);
}

/**
 * Computes trend between last N sessions vs previous N sessions.
 * Returns percentage change (positive = improvement).
 */
export function computeTrend(
  sessions: any[],
  getter: (s: any) => number,
  windowSize: number = 7
): number {
  if (sessions.length < 2) return 0;

  const recent = sessions.slice(-windowSize);
  const previous = sessions.slice(
    Math.max(0, sessions.length - windowSize * 2),
    Math.max(0, sessions.length - windowSize)
  );

  if (!previous.length) return 0;

  const recentAvg = computeAverage(recent, getter);
  const previousAvg = computeAverage(previous, getter);

  if (previousAvg === 0) return 0;
  return Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
}
