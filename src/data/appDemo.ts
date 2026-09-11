// ── AxonRing App Demo Data ──
// Powers the "Inside the App" showcase on the home page: a representative day
// in the companion app. Static and illustrative — this is marketing content,
// not live user data.

export interface SleepStage {
  stage: 'Deep' | 'REM' | 'Light' | 'Awake';
  minutes: number;
  color: string;
}

export interface HeartRatePoint {
  time: string;
  bpm: number;
}

export interface TapEvent {
  id: string;
  merchant: string;
  amount: number;
  time: string;
  category: 'coffee' | 'transit' | 'retail' | 'grocery';
}

export interface ReadinessFactor {
  label: string;
  value: string;
  // Share of the contribution bar, 0-1.
  weight: number;
}

// Sleep-stage hues use the validated dark-surface categorical palette
// (slots 1-4, fixed order). Do not re-order or substitute without re-running
// the palette validator against the zinc-900 chart surface.
export const SLEEP_STAGES: SleepStage[] = [
  { stage: 'Deep', minutes: 96, color: '#3987e5' },
  { stage: 'REM', minutes: 84, color: '#d95926' },
  { stage: 'Light', minutes: 214, color: '#199e70' },
  { stage: 'Awake', minutes: 17, color: '#c98500' },
];

export const SLEEP_TOTAL_MINUTES = SLEEP_STAGES.reduce((s, x) => s + x.minutes, 0);

export const READINESS_SCORE = 87;

export const READINESS_FACTORS: ReadinessFactor[] = [
  { label: 'Resting heart rate', value: '52 bpm', weight: 0.3 },
  { label: 'HRV balance', value: 'Balanced', weight: 0.28 },
  { label: 'Sleep quality', value: '6h 51m', weight: 0.26 },
  { label: 'Recovery time', value: 'Optimal', weight: 0.16 },
];

export const HEART_RATE_DAY: HeartRatePoint[] = [
  { time: '12a', bpm: 54 }, { time: '2a', bpm: 51 }, { time: '4a', bpm: 49 },
  { time: '6a', bpm: 53 }, { time: '8a', bpm: 68 }, { time: '10a', bpm: 74 },
  { time: '12p', bpm: 71 }, { time: '2p', bpm: 78 }, { time: '4p', bpm: 92 },
  { time: '6p', bpm: 118 }, { time: '8p', bpm: 76 }, { time: '10p', bpm: 61 },
];

export const RECENT_TAPS: TapEvent[] = [
  { id: 't1', merchant: 'Blue Bottle Coffee', amount: 5.75, time: '8:12 AM', category: 'coffee' },
  { id: 't2', merchant: 'Metro Transit', amount: 2.90, time: '8:41 AM', category: 'transit' },
  { id: 't3', merchant: 'Whole Foods Market', amount: 43.18, time: '12:26 PM', category: 'grocery' },
  { id: 't4', merchant: 'Uniqlo', amount: 68.00, time: '4:03 PM', category: 'retail' },
  { id: 't5', merchant: 'Metro Transit', amount: 2.90, time: '6:15 PM', category: 'transit' },
];

export const TAP_STATS = {
  thisMonth: 47,
  totalSpend: 612.44,
  avgTapTime: '0.4s',
};
