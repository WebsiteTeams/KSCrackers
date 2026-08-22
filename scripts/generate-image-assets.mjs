import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const CATEGORIES = [
  { id: 'sparklers', name: 'Sparklers', hue1: '#f59e0b', hue2: '#fbbf24', glyph: 'sparkler' },
  { id: 'flower-pots', name: 'Flower Pots', hue1: '#f97316', hue2: '#fb923c', glyph: 'pot' },
  { id: 'rockets', name: 'Rockets', hue1: '#ef4444', hue2: '#f87171', glyph: 'rocket' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', hue1: '#a855f7', hue2: '#c084fc', glyph: 'wheel' },
  { id: 'fountains', name: 'Fountains', hue1: '#3b82f6', hue2: '#60a5fa', glyph: 'fountain' },
  { id: 'gift-boxes', name: 'Gift Boxes', hue1: '#eab308', hue2: '#facc15', glyph: 'gift' },
  { id: 'kids-special', name: 'Kids Special', hue1: '#ec4899', hue2: '#f472b6', glyph: 'star' },
  { id: 'combos', name: 'Combo Packs', hue1: '#10b981', hue2: '#34d399', glyph: 'combo' },
];

const PRODUCTS = [
  { slug: '1000-wala-crackers', category: 'sparklers' },
  { slug: 'golden-sparklers-30cm', category: 'sparklers' },
  { slug: 'flower-pot-deluxe', category: 'flower-pots' },
  { slug: 'sky-shot-rocket-multi-color', category: 'rockets' },
  { slug: 'spinning-wheel-ground-chakkar', category: 'ground-chakkars' },
  { slug: 'vibrant-fountain-show', category: 'fountains' },
  { slug: 'shubh-deepawali-gift-box', category: 'gift-boxes' },
  { slug: 'magic-whip-crackling-sparks', category: 'kids-special' },
  { slug: 'family-combo-pack', category: 'combos' },
  { slug: 'kids-special-toy-crackers-pack', category: 'kids-special' },
  { slug: 'premium-festive-combo', category: 'combos' },
  { slug: 'grand-celebration-combo', category: 'combos' },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function fireworkBursts(seed, count, w, h) {
  const rand = seededRandom(seed);
  const parts = [];
  for (let i = 0; i < count; i++) {
    const cx = Math.round(rand() * w);
    const cy = Math.round(rand() * h * 0.7);
    const r = 20 + Math.round(rand() * 50);
    const rays = [];
    for (let a = 0; a < 12; a++) {
      const angle = (Math.PI * 2 * a) / 12;
      const x2 = cx + Math.cos(angle) * r;
      const y2 = cy + Math.sin(angle) * r;
      rays.push(`<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="url(#burst)" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`);
    }
    parts.push(`<g opacity="${(0.25 + rand() * 0.45).toFixed(2)}">${rays.join('')}<circle cx="${cx}" cy="${cy}" r="3" fill="#fde68a"/></g>`);
  }
  return parts.join('\n');
}

function svgDoc({ title, subtitle, hue1, hue2, seed, w, h, label }) {
  const cx = w / 2;
  const titleSize = Math.round(w * 0.075);
  const subSize = Math.round(w * 0.036);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101014"/>
      <stop offset="55%" stop-color="#17171d"/>
      <stop offset="100%" stop-color="#0b0b0c"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${hue2}"/>
      <stop offset="50%" stop-color="#f5d76e"/>
      <stop offset="100%" stop-color="${hue1}"/>
    </linearGradient>
    <linearGradient id="burst" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="${hue1}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="${hue1}" stop-opacity="0.28"/>
      <stop offset="60%" stop-color="${hue1}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${hue1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${fireworkBursts(seed, 6, w, h)}
  <rect x="10" y="10" width="${w - 20}" height="${h - 20}" rx="${Math.round(w * 0.02)}" fill="none" stroke="url(#gold)" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${cx}" y="${h * 0.40}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${titleSize * 2.6}" fill="url(#gold)" opacity="0.92">&#10022;</text>
  <text x="${cx}" y="${h * 0.58}" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-weight="bold" font-size="${titleSize}" letter-spacing="${Math.round(titleSize * 0.14)}" fill="#f7f5f0">${label}</text>
  <text x="${cx}" y="${h * 0.58 + titleSize + subSize}" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="${subSize}" letter-spacing="${Math.round(subSize * 0.22)}" fill="#b9b4a6">${subtitle.toUpperCase()}</text>
</svg>`;
}

function writeSvg(relPath, content) {
  const abs = path.join(PUBLIC_DIR, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf-8');
}

let written = 0;

for (const cat of CATEGORIES) {
  const svg = svgDoc({
    title: cat.name,
    subtitle: cat.name,
    hue1: cat.hue1,
    hue2: cat.hue2,
    seed: 11 + cat.id.length,
    w: 800,
    h: 1000,
    label: cat.name,
  });
  writeSvg(path.join('images', 'categories', `${cat.id}.svg`), svg);
  written++;
}

for (const p of PRODUCTS) {
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const label = p.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const svg = svgDoc({
    title: label,
    subtitle: cat.name,
    hue1: cat.hue1,
    hue2: cat.hue2,
    seed: 29 + p.slug.length,
    w: 800,
    h: 800,
    label,
  });
  writeSvg(path.join('images', 'products', p.category, `${p.slug}.svg`), svg);
  written++;
}

console.log(`Generated ${written} branded SVG assets under public/images/`);
