import { parse } from 'csv-parse/sync';
import type { Vendor } from '@peptides-guide/shared';
import { baseVendor, slugify } from './normalize.js';
import type { ParseResult } from './parse-peptidescores.js';

function breadth(count: number): Vendor['catalogBreadth'] {
  if (count < 20) return 'narrow';
  if (count < 50) return 'medium';
  if (count < 80) return 'broad';
  return 'very-broad';
}

export function parsePeptideSupermarket(csv: string): ParseResult {
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true }) as Record<string, string>[];
  const vendors: Vendor[] = [];
  const errors: string[] = [];
  rows.forEach((row, index) => {
    const name = row.Supplier?.trim();
    const rating = Number(row.Rating);
    if (!name || !Number.isFinite(rating)) {
      errors.push(`peptidesupermarket ligne ${index + 2}: nom ou rating invalide`);
      return;
    }
    const products = Number(row.Products);
    const price = Number(row['Price From']);
    vendors.push({
      ...baseVendor({ name, scoreGlobal: rating, source: 'peptidesupermarket' }),
      basedIn: 'United Kingdom', shipsTo: ['UK', 'EU'],
      badges: (row.Badges ?? '').split(/[;|]/).map((value) => value.trim()).filter(Boolean),
      catalogBreadth: Number.isFinite(products) ? breadth(products) : 'medium',
      sourceUrl: `https://peptidesupermarket.co.uk/suppliers/${slugify(name)}`,
      notesFr: `Supplier UK noté ${rating >= 90 ? 'Excellent' : 'High'} (${rating}/100) : ${Number.isFinite(products) ? `${products} produits` : 'catalogue non documenté'}, livraison ${row.Shipping ?? 'non documentée'}, ${Number.isFinite(price) ? `dès £${price.toFixed(2)}` : 'prix non documenté'}.`,
    });
  });
  return { vendors, errors };
}
