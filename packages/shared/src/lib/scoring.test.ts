import { describe, expect, it } from 'vitest';
import { SCORE_WEIGHTS, computeGlobalScore } from './scoring';

describe('SCORE_WEIGHTS', () => {
  it('pèse les six dimensions à 100 %', () => {
    const total = Object.values(SCORE_WEIGHTS).reduce((acc, weight) => acc + weight, 0);
    expect(total).toBeCloseTo(1);
  });
});

describe('computeGlobalScore', () => {
  it('calcule la moyenne pondérée arrondie à 1 décimale', () => {
    expect(computeGlobalScore({ purity: 100, testing: 100, transparency: 100, shipping: 97, value: 99, service: 99 })).toBe(99.5);
  });
});
