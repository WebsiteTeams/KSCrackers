import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const IMAGE_EXTENSIONS = new Set(['.webp', '.avif', '.jpg', '.jpeg', '.png']);

function collectImagePaths(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectImagePaths(full, out);
    else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.add('/' + path.relative(path.join(process.cwd(), 'public'), full).split(path.sep).join('/'));
    }
  }
}

const existingImages = new Set();
collectImagePaths(PUBLIC_IMAGES_DIR, existingImages);

const CANONICAL = {
  '1000-wala-crackers': { category: 'sparklers', primary: '/images/products/sparklers/1000-wala-crackers.webp' },
  'golden-sparklers-30cm': { category: 'sparklers', primary: '/images/products/sparklers/golden-sparklers-30cm.webp' },
  'flower-pot-deluxe': { category: 'flower-pots', primary: '/images/products/flower-pots/flower-pot-deluxe.webp' },
  'sky-shot-rocket-multi-color': { category: 'rockets', primary: '/images/products/rockets/sky-shot-rocket-multi-color.webp' },
  'spinning-wheel-ground-chakkar': { category: 'ground-chakkars', primary: '/images/products/ground-chakkars/spinning-wheel-ground-chakkar.webp' },
  'vibrant-fountain-show': { category: 'fountains', primary: '/images/products/fountains/vibrant-fountain-show.webp' },
  'shubh-deepawali-gift-box': { category: 'gift-boxes', primary: '/images/products/gift-boxes/shubh-deepawali-gift-box.webp' },
  'magic-whip-crackling-sparks': { category: 'kids-special', primary: '/images/products/kids-special/magic-whip-crackling-sparks.webp' },
  'family-combo-pack': { category: 'combos', primary: '/images/products/combos/family-combo-pack.webp' },
  'kids-special-toy-crackers-pack': { category: 'kids-special', primary: '/images/products/kids-special/kids-special-toy-crackers-pack.webp' },
  'premium-festive-combo': { category: 'combos', primary: '/images/products/combos/premium-festive-combo.webp' },
  'grand-celebration-combo': { category: 'combos', primary: '/images/products/combos/grand-celebration-combo.webp' },
};

const CATEGORY_LABELS = {
  combos: 'celebration combo pack',
  'gift-boxes': 'premium cracker gift box',
  sparklers: 'sparkler crackers',
  'flower-pots': 'flower pot cracker',
  rockets: 'sky rocket cracker',
  'ground-chakkars': 'ground chakkar cracker',
  fountains: 'fountain firework',
  'kids-special': 'kids special crackers',
};

function buildAlt(name, category) {
  const label = CATEGORY_LABELS[category] || 'cracker';
  return `${name} ${label}`;
}

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    category: String,
    images: mongoose.Schema.Types.Mixed,
    mrp: Number,
    sellingPrice: Number,
    stock: Number,
    featured: Boolean,
    bestSeller: Boolean,
    isOffer: Boolean,
    isActive: Boolean,
  },
  { strict: false, timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set. Nothing to migrate.');
    process.exit(1);
  }

  await mongoose.connect(uri, { bufferCommands: false });
  console.log('Connected to MongoDB');

  const products = await Product.find({}).lean();
  let categoryFixed = 0;
  let imagesFixed = 0;

  for (const doc of products) {
    const update = {};
    const canonical = CANONICAL[doc.slug];

    if (canonical && doc.category !== canonical.category) {
      update.category = canonical.category;
    }

    const rawImages = Array.isArray(doc.images) ? doc.images : [];
    const normalized = [];

    for (const entry of rawImages) {
      let url = '';
      let alt = '';
      let isPrimary = false;
      if (typeof entry === 'string') {
        url = entry.trim();
        isPrimary = normalized.length === 0;
      } else if (entry && typeof entry === 'object') {
        url = typeof entry.url === 'string' ? entry.url.trim() : '';
        alt = typeof entry.alt === 'string' ? entry.alt.trim() : '';
        isPrimary = Boolean(entry.isPrimary);
      }
      if (!url) continue;
      const isLocalMissing = url.startsWith('/') && !existingImages.has(url);
      const isCanonicalDefault = canonical && url === canonical.primary;
      if (isLocalMissing && !isCanonicalDefault) continue;
      normalized.push({ url, alt, isPrimary });
    }

    normalized.forEach((img, idx) => {
      img.isPrimary = idx === 0;
      if (!img.alt || /^image\d*$|^product$|^photo$|^test$/i.test(img.alt)) {
        img.alt = buildAlt(doc.name, update.category || doc.category);
      }
    });

    if (normalized.length === 0 && canonical) {
      normalized.push({
        url: canonical.primary,
        alt: buildAlt(doc.name, canonical.category),
        isPrimary: true,
      });
    }

    const changed =
      JSON.stringify(normalized) !== JSON.stringify(rawImages);
    if (changed) {
      update.images = normalized;
    }

    if (Object.keys(update).length > 0) {
      if (update.category !== undefined) categoryFixed++;
      if (update.images !== undefined) imagesFixed++;
      await Product.updateOne({ _id: doc._id }, { $set: update });
      console.log(`Updated ${doc.slug}:`, Object.keys(update).join(', '));
    }
  }

  console.log(`\nMigration complete. Categories fixed: ${categoryFixed}, image arrays fixed: ${imagesFixed}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
