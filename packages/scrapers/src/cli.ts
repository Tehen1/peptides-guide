import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Vendor } from '@peptides-guide/shared';
import { mergeVendors } from './normalize.js';
import { parsePeptideScores } from './parse-peptidescores.js';
import { parsePeptideSupermarket } from './parse-peptidesupermarket.js';

const root = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const target = resolve(root, 'packages/shared/src/data/vendors.json');
const psPath = resolve(root, process.env.PEPTIDESCORES_CSV_PATH ?? 'data/raw/peptidescores.csv');
const psmPath = resolve(root, process.env.PEPTIDESUPERMARKET_CSV_PATH ?? 'data/raw/peptidesupermarket.csv');
const seed = JSON.parse(readFileSync(target, 'utf8')) as { _meta: Record<string, unknown>; vendors: Vendor[] };
const ps = existsSync(psPath) ? parsePeptideScores(readFileSync(psPath, 'utf8')) : { vendors: [], errors: ['peptidescores.csv absent'] };
const psm = existsSync(psmPath) ? parsePeptideSupermarket(readFileSync(psmPath, 'utf8')) : { vendors: [], errors: ['peptidesupermarket.csv absent'] };
[...ps.errors, ...psm.errors].forEach((error) => console.error(`[warn] ${error}`));
const vendors = mergeVendors([...seed.vendors, ...psm.vendors, ...ps.vendors]);
writeFileSync(target, `${JSON.stringify({ _meta: { ...seed._meta, generatedAt: new Date().toISOString(), generator: 'packages/scrapers' }, vendors }, null, 2)}\n`);
console.log(`[ok] ${vendors.length} vendors normalisés`);
