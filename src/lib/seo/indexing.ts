const DEFAULT_MIN_VENDOR_COUNT = 5;

const TRACKING_KEYS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'ref',
]);

type ParamValue = string | string[] | undefined;

export type SearchParamShape = Record<string, ParamValue>;

export type IndexingDecision = {
  shouldIndex: boolean;
  shouldFollow: boolean;
  vendorCount: number;
  minVendorCount: number;
  hasFilterParams: boolean;
  isPaginated: boolean;
  forcedNoindex: boolean;
};

function getConfiguredMinVendorCount(): number {
  const raw = process.env.SEO_MIN_VENDOR_COUNT || process.env.NEXT_PUBLIC_SEO_MIN_VENDOR_COUNT;
  const parsed = raw ? Number(raw) : DEFAULT_MIN_VENDOR_COUNT;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MIN_VENDOR_COUNT;
  }
  return Math.floor(parsed);
}

function hasValue(value: ParamValue): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some((item) => item.trim().length > 0);
  return false;
}

function readPageNumber(params: SearchParamShape): number {
  const raw = params.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return 1;
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

function hasFilterParams(params: SearchParamShape): boolean {
  return Object.entries(params).some(([key, value]) => {
    if (!hasValue(value)) return false;
    if (key === 'page') return false;
    if (TRACKING_KEYS.has(key)) return false;
    return true;
  });
}

export function getListingIndexingDecision({
  searchParams,
  vendorCount,
  minVendorCount = getConfiguredMinVendorCount(),
  forceNoindex = false,
}: {
  searchParams: SearchParamShape;
  vendorCount: number;
  minVendorCount?: number;
  forceNoindex?: boolean;
}): IndexingDecision {
  const page = readPageNumber(searchParams);
  const isPaginated = page > 1;
  const hasFilters = hasFilterParams(searchParams);
  const lowInventory = vendorCount < minVendorCount;

  const shouldIndex = !forceNoindex && !isPaginated && !hasFilters && !lowInventory;

  return {
    shouldIndex,
    shouldFollow: true,
    vendorCount,
    minVendorCount,
    hasFilterParams: hasFilters,
    isPaginated,
    forcedNoindex: forceNoindex || lowInventory,
  };
}

