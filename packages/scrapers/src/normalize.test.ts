import { describe, expect, it } from 'vitest';
import { slugify } from './normalize.js';
import { parsePeptideScores } from './parse-peptidescores.js';
import { parsePeptideSupermarket } from './parse-peptidesupermarket.js';

describe('normalisation', () => {
  it('normalise les slugs', () => expect(slugify('Certa Peptides — Édition')).toBe('certa-peptides-edition'));
  it('parse PeptideScores', () => {
    const result = parsePeptideScores('Vendor,Score,Coupon,Discount,Based In,Notes\nSouthern Aminos,99.7,PEPSCORES,15%,United States,test');
    expect(result.errors).toEqual([]);
    expect(result.vendors[0]?.slug).toBe('southern-aminos');
  });
  it('parse PeptideSupermarket', () => {
    const result = parsePeptideSupermarket('Supplier,Rating,Products,Price From,Shipping,Badges\nBioPlex Peptides,95,64,7.99,Free,Lab Tested');
    expect(result.errors).toEqual([]);
    expect(result.vendors[0]?.catalogBreadth).toBe('broad');
  });
});
