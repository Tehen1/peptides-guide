import { parse } from 'csv-parse/sync';
import type { Vendor } from '@peptides-guide/shared';
import { baseVendor } from './normalize.js';

export interface ParseResult { vendors: Vendor[]; errors: string[]; }

export function parsePeptideScores(csv: string): ParseResult {
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true }) as Record<string, string>[];
  const vendors: Vendor[] = [];
  const errors: string[] = [];
  rows.forEach((row, index) => {
    const name = row.Vendor?.trim();
    const score = Number(row.Score);
    if (!name || !Number.isFinite(score)) {
      errors.push(`peptidescores ligne ${index + 2}: nom ou score invalide`);
      return;
    }
    const notes = row.Notes ?? '';
    vendors.push({
      ...baseVendor({ name, scoreGlobal: score, source: 'peptidescores' }),
      couponCode: row.Coupon?.trim() || null,
      couponDiscount: row.Discount?.trim() || null,
      basedIn: row['Based In']?.trim() || 'United States',
      testingPanel: notes,
      domesticOnly: /domestic[- ]only/i.test(notes),
    });
  });
  return { vendors, errors };
}
