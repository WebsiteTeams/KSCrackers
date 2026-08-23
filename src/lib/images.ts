export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface ResolvedProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export const PLACEHOLDER_PRODUCT_IMAGE = '/images/placeholders/product-image-soon.svg';
export const PLACEHOLDER_CATEGORY_IMAGE = '/images/placeholders/category-image-soon.svg';

export const CATEGORIES: Category[] = [
  { id: 'sparklers', name: 'Sparklers' },
  { id: 'flower-pots', name: 'Flower Pots' },
  { id: 'rockets', name: 'Rockets' },
  { id: 'ground-chakkars', name: 'Ground Chakkars' },
  { id: 'fountains', name: 'Fountains' },
  { id: 'gift-boxes', name: 'Gift Boxes' },
  { id: 'kids-special', name: 'Kids Special' },
  { id: 'combos', name: 'Combo Packs' },
];

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.name])
);

export const categoryImages: Record<string, string> = {
  sparklers: '/images/categories/sparklers.svg',
  'flower-pots': '/images/categories/flower-pots.svg',
  rockets: '/images/categories/rockets.svg',
  'ground-chakkars': '/images/categories/ground-chakkars.svg',
  fountains: '/images/categories/fountains.svg',
  'gift-boxes': '/images/categories/gift-boxes.svg',
  'kids-special': '/images/categories/kids-special.svg',
  combos: '/images/categories/combos.svg',
};

export interface ProductImageConfig {
  primary: string;
  gallery?: string[];
}

export const productImages: Record<string, ProductImageConfig> = {
  '1000-wala-crackers': {
    primary: '/images/products/sparklers/1000-wala-crackers.svg',
  },
  'golden-sparklers-30cm': {
    primary: '/images/products/sparklers/golden-sparklers-30cm.svg',
  },
  'flower-pot-deluxe': {
    primary: '/images/products/flower-pots/flower-pot-deluxe.svg',
  },
  'sky-shot-rocket-multi-color': {
    primary: '/images/products/rockets/sky-shot-rocket-multi-color.svg',
  },
  'spinning-wheel-ground-chakkar': {
    primary: '/images/products/ground-chakkars/spinning-wheel-ground-chakkar.svg',
  },
  'vibrant-fountain-show': {
    primary: '/images/products/fountains/vibrant-fountain-show.svg',
  },
  'shubh-deepawali-gift-box': {
    primary: '/images/products/gift-boxes/shubh-deepawali-gift-box.svg',
  },
  'magic-whip-crackling-sparks': {
    primary: '/images/products/kids-special/magic-whip-crackling-sparks.svg',
  },
  'family-combo-pack': {
    primary: '/images/products/combos/family-combo-pack.svg',
  },
  'kids-special-toy-crackers-pack': {
    primary: '/images/products/kids-special/kids-special-toy-crackers-pack.svg',
  },
  'premium-festive-combo': {
    primary: '/images/products/combos/premium-festive-combo.svg',
  },
  'grand-celebration-combo': {
    primary: '/images/products/combos/grand-celebration-combo.svg',
  },
};

export const bannerImages = {
  hero: '/images/banners/hero.svg',
  festivalOffer: '/images/banners/festival-offer.svg',
  about: '/images/banners/about-sivakasi.svg',
};

function buildDefaultAlt(name: string, category: string): string {
  const base = `${name} KS Crackers`;
  switch (category) {
    case 'combos':
      return `${name} celebration combo pack`;
    case 'gift-boxes':
      return `${name} premium cracker gift box`;
    case 'sparklers':
      return `${name} sparkler crackers`;
    case 'flower-pots':
      return `${name} flower pot cracker`;
    case 'rockets':
      return `${name} sky rocket cracker`;
    case 'ground-chakkars':
      return `${name} ground chakkar cracker`;
    case 'fountains':
      return `${name} fountain firework`;
    case 'kids-special':
      return `${name} kids special crackers`;
    default:
      return base;
  }
}

export function getCategoryLabel(categoryId: string): string {
  return CATEGORY_LABELS[categoryId] || categoryId.replace(/-/g, ' ');
}

export function getProductImageConfig(slug: string): ProductImageConfig | undefined {
  return productImages[slug];
}

export function getDefaultProductImages(
  slug: string,
  name: string,
  category: string
): ProductImage[] {
  const config = productImages[slug];
  if (!config) return [];
  const urls = [config.primary, ...(config.gallery ?? [])];
  return urls.map((url, idx) => ({
    url,
    alt: idx === 0 ? buildDefaultAlt(name, category) : `${buildDefaultAlt(name, category)} - view ${idx + 1}`,
    isPrimary: idx === 0,
  }));
}

export function isLocalImagePath(url: string): boolean {
  return typeof url === 'string' && url.startsWith('/');
}

export function normalizeProductImages(
  input: unknown,
  name: string,
  category: string
): ProductImage[] {
  const source = Array.isArray(input) ? input : [];
  const normalized: ProductImage[] = [];

  source.forEach((entry, idx) => {
    let url = '';
    let alt = '';
    let isPrimary = false;

    if (typeof entry === 'string') {
      url = entry.trim();
      isPrimary = normalized.length === 0 && idx === 0;
    } else if (entry && typeof entry === 'object') {
      const record = entry as Partial<ProductImage>;
      url = typeof record.url === 'string' ? record.url.trim() : '';
      alt = typeof record.alt === 'string' ? record.alt.trim() : '';
      isPrimary = Boolean(record.isPrimary);
    }

    if (!url) return;

    normalized.push({
      url,
      alt: alt || buildDefaultAlt(name, category),
      isPrimary,
    });
  });

  const dedupedUrls = new Set<string>();
  const deduped = normalized.filter((img) => {
    if (dedupedUrls.has(img.url)) return false;
    dedupedUrls.add(img.url);
    return true;
  });

  if (deduped.length > 0 && !deduped.some((img) => img.isPrimary)) {
    deduped[0].isPrimary = true;
  }

  return deduped.sort((a, b) => Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false));
}

export function resolveDisplayImages(
  product: { slug: string; name: string; category: string; images?: unknown },
  existingFileFilter?: (url: string) => boolean
): ProductImage[] {
  const stored = normalizeProductImages(product.images, product.name, product.category);

  const available =
    typeof existingFileFilter === 'function'
      ? stored.filter((img) => !isLocalImagePath(img.url) || existingFileFilter(img.url))
      : stored;

  if (available.length > 0) return available;

  const fallback = getDefaultProductImages(product.slug, product.name, product.category);

  let usableFallback: ProductImage[];
  if (typeof existingFileFilter === 'function') {
    usableFallback = fallback.filter(
      (img) => !isLocalImagePath(img.url) || existingFileFilter(img.url)
    );
  } else {
    usableFallback = fallback;
  }

  if (usableFallback.length > 0) return usableFallback;

  const categoryFallback = categoryImages[product.category];
  if (categoryFallback) {
    const categoryImage: ProductImage[] = [
      {
        url: categoryFallback,
        alt: `${product.name} KS Crackers`,
        isPrimary: true,
      },
    ];
    if (typeof existingFileFilter === 'function') {
      const usableCategory = categoryImage.filter(
        (img) => !isLocalImagePath(img.url) || existingFileFilter(img.url)
      );
      if (usableCategory.length > 0) return usableCategory;
    } else {
      return categoryImage;
    }
  }

  return [
    {
      url: PLACEHOLDER_PRODUCT_IMAGE,
      alt: `${product.name} KS Crackers`,
      isPrimary: true,
    },
  ];
}

export function getPrimaryProductImage(
  product: { slug: string; name: string; category: string; images?: unknown },
  existingFileFilter?: (url: string) => boolean
): ProductImage | null {
  const images = resolveDisplayImages(product, existingFileFilter);
  return images.length > 0 ? images[0] : null;
}

export function buildOrderItemSnapshot(
  product: { name: string; slug: string; category: string; images?: unknown },
  existingFileFilter?: (url: string) => boolean
): string {
  const primary = getPrimaryProductImage(product, existingFileFilter);
  return primary ? primary.url : '';
}

export function getCategoryImage(categoryId: string): string | null {
  return categoryImages[categoryId] || null;
}
