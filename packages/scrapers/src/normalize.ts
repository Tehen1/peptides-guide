import type { Vendor } from '@peptides-guide/shared';

const PRECEDENCE: Record<Vendor['source'], number> = { manual: 0, peptidescores: 1, peptidesupermarket: 2 };

export function slugify(input: string): string {
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function baseVendor(init: { name: string; scoreGlobal: number; source: Vendor['source'] }): Vendor {
  const score = Math.round(init.scoreGlobal * 10) / 10;
  return {
    slug: slugify(init.name), name: init.name, logo: null, website: null, affiliateUrl: null, affiliateNetwork: null,
    couponCode: null, couponDiscount: null, couponStackable: false,
    scoreGlobal: score, scorePurity: score, scoreTesting: score, scoreTransparency: score, scoreShipping: score, scoreValue: score, scoreService: score,
    badges: [], testingLabs: [], testingPanel: '', coaAccess: 'request', coaArchive: false, conformityTesting: '',
    formats: ['vials'], catalogBreadth: 'medium', rarePeptides: false, customSynthesis: false,
    basedIn: 'United States', shipsTo: ['US'], shippingSpeed: 'variable', freeShippingThreshold: null, domesticOnly: false,
    payments: [], yearsOperating: null, communityFav: false, risingStar: false, newEntry: false,
    source: init.source, lastVerified: new Date().toISOString().slice(0, 10), notesFr: '', sourceUrl: null,
  };
}

export function mergeVendors(inputs: Vendor[]): Vendor[] {
  const bySlug = new Map<string, Vendor>();
  for (const vendor of inputs) {
    const existing = bySlug.get(vendor.slug);
    if (!existing || PRECEDENCE[vendor.source] < PRECEDENCE[existing.source]) bySlug.set(vendor.slug, vendor);
    else if (PRECEDENCE[vendor.source] === PRECEDENCE[existing.source]) bySlug.set(vendor.slug, { ...existing, ...vendor, lastVerified: vendor.lastVerified });
  }
  return [...bySlug.values()].sort((a, b) => b.scoreGlobal - a.scoreGlobal);
}
