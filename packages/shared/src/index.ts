export type { AffiliateNetwork, CatalogBreadth, CoaAccess, Payment, ShippingSpeed, Vendor, VendorFormat, VendorSource } from './types/vendor';
export { SCORE_WEIGHTS, computeGlobalScore } from './lib/scoring';
export type { DimensionScores, ScoreDimension } from './lib/scoring';

import type { Vendor } from './types/vendor';
import vendorData from './data/vendors.json';

export const vendors: Vendor[] = vendorData.vendors as unknown as Vendor[];
