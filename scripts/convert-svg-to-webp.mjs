import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/* ─── Image conversion targets ─── */

const PRODUCT_SVGS = [
  { svg: 'images/products/sparklers/1000-wala-crackers.svg', w: 800, h: 800 },
  { svg: 'images/products/sparklers/golden-sparklers-30cm.svg', w: 800, h: 800 },
  { svg: 'images/products/flower-pots/flower-pot-deluxe.svg', w: 800, h: 800 },
  { svg: 'images/products/rockets/sky-shot-rocket-multi-color.svg', w: 800, h: 800 },
  { svg: 'images/products/ground-chakkars/spinning-wheel-ground-chakkar.svg', w: 800, h: 800 },
  { svg: 'images/products/fountains/vibrant-fountain-show.svg', w: 800, h: 800 },
  { svg: 'images/products/gift-boxes/shubh-deepawali-gift-box.svg', w: 800, h: 800 },
  { svg: 'images/products/kids-special/magic-whip-crackling-sparks.svg', w: 800, h: 800 },
  { svg: 'images/products/combos/family-combo-pack.svg', w: 800, h: 800 },
  { svg: 'images/products/kids-special/kids-special-toy-crackers-pack.svg', w: 800, h: 800 },
  { svg: 'images/products/combos/premium-festive-combo.svg', w: 800, h: 800 },
  { svg: 'images/products/combos/grand-celebration-combo.svg', w: 800, h: 800 },
];

const CATEGORY_SVGS = [
  { svg: 'images/categories/sparklers.svg', w: 800, h: 1000 },
  { svg: 'images/categories/flower-pots.svg', w: 800, h: 1000 },
  { svg: 'images/categories/rockets.svg', w: 800, h: 1000 },
  { svg: 'images/categories/ground-chakkars.svg', w: 800, h: 1000 },
  { svg: 'images/categories/fountains.svg', w: 800, h: 1000 },
  { svg: 'images/categories/gift-boxes.svg', w: 800, h: 1000 },
  { svg: 'images/categories/kids-special.svg', w: 800, h: 1000 },
  { svg: 'images/categories/combos.svg', w: 800, h: 1000 },
];

const BANNER_SVGS = [
  { svg: 'images/banners/hero.svg', w: 1920, h: 800 },
  { svg: 'images/banners/festival-offer.svg', w: 1920, h: 800 },
  { svg: 'images/banners/about-sivakasi.svg', w: 1920, h: 800 },
];

const PLACEHOLDER_SVGS = [
  { svg: 'images/placeholders/product-image-soon.svg', w: 800, h: 800 },
  { svg: 'images/placeholders/category-image-soon.svg', w: 600, h: 750 },
];

/* ─── Convert a single SVG to WebP ─── */
async function convertSvgToWebp(svgRelPath, width, height) {
  const svgAbsPath = path.join(PUBLIC_DIR, svgRelPath);
  const webpRelPath = svgRelPath.replace(/\.svg$/, '.webp');
  const webpAbsPath = path.join(PUBLIC_DIR, webpRelPath);

  if (!fs.existsSync(svgAbsPath)) {
    console.log(`  SKIP (not found): ${svgRelPath}`);
    return false;
  }

  try {
    const svgBuffer = fs.readFileSync(svgAbsPath);
    await sharp(svgBuffer, { density: 150 })
      .resize(width, height, { fit: 'contain', background: { r: 15, g: 15, b: 19, alpha: 1 } })
      .webp({ quality: 85, effort: 4 })
      .toFile(webpAbsPath);

    const svgSize = fs.statSync(svgAbsPath).size;
    const webpSize = fs.statSync(webpAbsPath).size;
    const ratio = ((1 - webpSize / svgSize) * 100).toFixed(0);
    console.log(`  OK: ${svgRelPath} → ${webpRelPath} (${(webpSize / 1024).toFixed(1)}KB, ${ratio}% vs SVG)`);
    return true;
  } catch (err) {
    console.error(`  FAIL: ${svgRelPath} — ${err.message}`);
    return false;
  }
}

/* ─── Main ─── */
async function main() {
  console.log('Converting SVG assets to WebP...\n');

  let ok = 0;
  let fail = 0;

  console.log('Products:');
  for (const item of PRODUCT_SVGS) {
    const result = await convertSvgToWebp(item.svg, item.w, item.h);
    if (result) ok++; else fail++;
  }

  console.log('\nCategories:');
  for (const item of CATEGORY_SVGS) {
    const result = await convertSvgToWebp(item.svg, item.w, item.h);
    if (result) ok++; else fail++;
  }

  console.log('\nBanners:');
  for (const item of BANNER_SVGS) {
    const result = await convertSvgToWebp(item.svg, item.w, item.h);
    if (result) ok++; else fail++;
  }

  console.log('\nPlaceholders:');
  for (const item of PLACEHOLDER_SVGS) {
    const result = await convertSvgToWebp(item.svg, item.w, item.h);
    if (result) ok++; else fail++;
  }

  console.log(`\nDone: ${ok} converted, ${fail} failed`);
}

main().catch(console.error);
