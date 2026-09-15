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

export const PLACEHOLDER_PRODUCT_IMAGE = '/images/placeholders/product-image-soon.webp';
export const PLACEHOLDER_CATEGORY_IMAGE = '/images/placeholders/category-image-soon.webp';

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

export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  sparklers: '/images/categories/sparklers.jpg',
  'flower-pots': '/images/categories/flower-pots.jpg',
  rockets: '/images/categories/rockets.jpg',
  'ground-chakkars': '/images/categories/ground-chakkars.jpg',
  fountains: '/images/categories/fountains.jpg',
  'gift-boxes': '/images/categories/gift-boxes.jpg',
  'kids-special': '/images/categories/kids-special.jpg',
  combos: '/images/categories/combos.jpg',
};

export const categoryImages: Record<string, string> = { ...DEFAULT_CATEGORY_IMAGES };

export interface ProductImageConfig {
  primary: string;
  gallery?: string[];
}

export const productImages: Record<string, ProductImageConfig> = {
  '1000-wala-crackers': {
    primary: '/images/products/sparklers/1000-wala-crackers.jpg',
  },
  'golden-sparklers-30cm': {
    primary: '/images/products/sparklers/golden-sparklers-30cm.jpg',
  },
  'flower-pot-deluxe': {
    primary: '/images/products/flower-pots/flower-pot-deluxe.jpg',
  },
  'sky-shot-rocket-multi-color': {
    primary: '/images/products/rockets/sky-shot-rocket-multi-color.jpg',
  },
  'spinning-wheel-ground-chakkar': {
    primary: '/images/products/ground-chakkars/spinning-wheel-ground-chakkar.jpg',
  },
  'vibrant-fountain-show': {
    primary: '/images/products/fountains/vibrant-fountain-show.jpg',
  },
  'shubh-deepawali-gift-box': {
    primary: '/images/products/gift-boxes/shubh-deepawali-gift-box.jpg',
  },
  'magic-whip-crackling-sparks': {
    primary: '/images/products/kids-special/magic-whip-crackling-sparks.jpg',
  },
  'family-combo-pack': {
    primary: '/images/products/combos/family-combo-pack.jpg',
  },
  'kids-special-toy-crackers-pack': {
    primary: '/images/products/kids-special/kids-special-toy-crackers-pack.jpg',
  },
  'premium-festive-combo': {
    primary: '/images/products/combos/premium-festive-combo.jpg',
  },
  'grand-celebration-combo': {
    primary: '/images/products/combos/grand-celebration-combo.jpg',
  },
};

export const bannerImages = {
  hero: '/images/banners/hero.webp',
  festivalOffer: '/images/banners/festival-offer.webp',
  about: '/images/banners/about-sivakasi.webp',
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
  existingFileFilter?: (url: string) => boolean,
  categoryImagesOverride?: Record<string, string>
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

  const catImages = categoryImagesOverride || categoryImages;
  const categoryFallback = catImages[product.category];
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
