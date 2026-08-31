export const SCORE_WEIGHTS = {
  purity: 0.25,
  testing: 0.25,
  transparency: 0.2,
  shipping: 0.1,
  value: 0.1,
  service: 0.1,
} as const;

export type ScoreDimension = keyof typeof SCORE_WEIGHTS;

export interface DimensionScores {
  purity: number;
  testing: number;
  transparency: number;
  shipping: number;
  value: number;
  service: number;
}

export function computeGlobalScore(scores: DimensionScores): number {
  const dimensions = Object.keys(SCORE_WEIGHTS) as ScoreDimension[];
  const total = dimensions.reduce((acc, key) => acc + scores[key] * SCORE_WEIGHTS[key], 0);
  return Math.round(total * 10) / 10;
}
