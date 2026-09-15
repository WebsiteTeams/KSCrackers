import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/* ─── Category definitions ─── */
const CATEGORIES = [
  { id: 'sparklers', name: 'Sparklers', hue1: '#f59e0b', hue2: '#fbbf24', accent: '#fde68a' },
  { id: 'flower-pots', name: 'Flower Pots', hue1: '#f97316', hue2: '#fb923c', accent: '#fed7aa' },
  { id: 'rockets', name: 'Rockets', hue1: '#ef4444', hue2: '#f87171', accent: '#fecaca' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', hue1: '#a855f7', hue2: '#c084fc', accent: '#e9d5ff' },
  { id: 'fountains', name: 'Fountains', hue1: '#3b82f6', hue2: '#60a5fa', accent: '#bfdbfe' },
  { id: 'gift-boxes', name: 'Gift Boxes', hue1: '#eab308', hue2: '#facc15', accent: '#fef08a' },
  { id: 'kids-special', name: 'Kids Special', hue1: '#ec4899', hue2: '#f472b6', accent: '#fbcfe8' },
  { id: 'combos', name: 'Combo Packs', hue1: '#10b981', hue2: '#34d399', accent: '#a7f3d0' },
];

/* ─── Product definitions ─── */
const PRODUCTS = [
  { slug: '1000-wala-crackers', category: 'sparklers', label: '1000 Wala Crackers' },
  { slug: 'golden-sparklers-30cm', category: 'sparklers', label: 'Golden Sparklers (30cm)' },
  { slug: 'flower-pot-deluxe', category: 'flower-pots', label: 'Flower Pot Deluxe' },
  { slug: 'sky-shot-rocket-multi-color', category: 'rockets', label: 'Sky Shot Rocket (Multi-Color)' },
  { slug: 'spinning-wheel-ground-chakkar', category: 'ground-chakkars', label: 'Spinning Wheel Ground Chakkar' },
  { slug: 'vibrant-fountain-show', category: 'fountains', label: 'Vibrant Fountain Show' },
  { slug: 'shubh-deepawali-gift-box', category: 'gift-boxes', label: 'Shubh Deepawali Gift Box (31 Items)' },
  { slug: 'magic-whip-crackling-sparks', category: 'kids-special', label: 'Magic Whip & Crackling Sparks' },
  { slug: 'family-combo-pack', category: 'combos', label: 'Family Combo Pack' },
  { slug: 'kids-special-toy-crackers-pack', category: 'kids-special', label: 'Kids Special Toy Crackers Pack' },
  { slug: 'premium-festive-combo', category: 'combos', label: 'Premium Festive Combo' },
  { slug: 'grand-celebration-combo', category: 'combos', label: 'Grand Celebration Combo' },
];

/* ─── Utility: seeded PRNG ─── */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* ─── Shared SVG wrapper ─── */
function wrapSvg(w, h, content, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0f13"/>
      <stop offset="50%" stop-color="#16161c"/>
      <stop offset="100%" stop-color="#0a0a0e"/>
    </linearGradient>
    ${defs}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${content}
</svg>`;
}



/* ─── Sparkler stick ─── */
function sparklerStick(x, y, len, angle, color) {
  const rad = (angle * Math.PI) / 180;
  const ex = x + Math.cos(rad) * len;
  const ey = y + Math.sin(rad) * len;
  return `<line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#8B7355" stroke-width="3" stroke-linecap="round"/>
  <line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>`;
}

/* ─── Sparkler sparks ─── */
function sparklerSparks(cx, cy, count, maxR, hue) {
  const parts = [];
  const rand = seededRandom(cx * 100 + cy);
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const r = 8 + rand() * maxR;
    const x2 = cx + Math.cos(angle) * r;
    const y2 = cy + Math.sin(angle) * r;
    const c = rand() > 0.5 ? '#fde68a' : hue;
    parts.push(`<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="${0.8 + rand() * 1.2}" stroke-linecap="round" opacity="${(0.4 + rand() * 0.5).toFixed(2)}"/>`);
    if (rand() > 0.6) {
      parts.push(`<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${1 + rand() * 2}" fill="${c}" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`);
    }
  }
  return parts.join('\n');
}

/* ─── Fountain eruption ─── */
function fountainEruption(cx, baseY, maxH, spread, hue, seed) {
  const rand = seededRandom(seed);
  const parts = [];
  const rays = 24;
  for (let i = 0; i < rays; i++) {
    const angle = -Math.PI / 2 + (rand() - 0.5) * (Math.PI * 0.7);
    const h = maxH * (0.4 + rand() * 0.6);
    const drift = (rand() - 0.5) * spread;
    const tipX = cx + drift;
    const tipY = baseY - h;
    const midX = cx + drift * 0.3;
    const midY = baseY - h * 0.6;
    const c = rand() > 0.4 ? hue : '#fde68a';
    parts.push(`<path d="M${cx},${baseY} Q${midX.toFixed(1)},${midY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)}" stroke="${c}" stroke-width="${1 + rand() * 1.5}" fill="none" stroke-linecap="round" opacity="${(0.5 + rand() * 0.4).toFixed(2)}"/>`);
    if (rand() > 0.5) {
      parts.push(`<circle cx="${tipX.toFixed(1)}" cy="${tipY.toFixed(1)}" r="${1.5 + rand() * 2.5}" fill="${c}" opacity="${(0.6 + rand() * 0.3).toFixed(2)}"/>`);
    }
  }
  return parts.join('\n');
}

/* ─── Rocket with trail ─── */
function rocketTrail(cx, cy, hue) {
  const parts = [];
  parts.push(`<path d="M${cx},${cy} L${cx - 6},${cy + 30} L${cx},${cy + 22} L${cx + 6},${cy + 30} Z" fill="${hue}" opacity="0.9"/>`);
  parts.push(`<path d="M${cx - 4},${cy + 30} Q${cx},${cy + 55} ${cx + 4},${cy + 30}" fill="#f59e0b" opacity="0.8"/>`);
  parts.push(`<path d="M${cx - 3},${cy + 38} Q${cx},${cy + 60} ${cx + 3},${cy + 38}" fill="#ef4444" opacity="0.6"/>`);
  for (let i = 0; i < 8; i++) {
    const ox = (Math.random() - 0.5) * 12;
    const oy = 45 + i * 6;
    parts.push(`<circle cx="${cx + ox}" cy="${cy + oy}" r="${1 + Math.random() * 2}" fill="#fde68a" opacity="${(0.3 + Math.random() * 0.4).toFixed(2)}"/>`);
  }
  return parts.join('\n');
}

/* ─── Spinning chakkar ─── */
function chakkarWheel(cx, cy, r, hue) {
  const parts = [];
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hue}" stroke-width="3" opacity="0.7"/>`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="${r * 0.3}" fill="${hue}" opacity="0.5"/>`);
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16;
    const x1 = cx + Math.cos(angle) * r * 0.3;
    const y1 = cy + Math.sin(angle) * r * 0.3;
    const x2 = cx + Math.cos(angle) * r;
    const y2 = cy + Math.sin(angle) * r;
    parts.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${hue}" stroke-width="1" opacity="0.5"/>`);
  }
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20;
    const sr = r + 8 + Math.random() * 25;
    const sx = cx + Math.cos(angle) * sr;
    const sy = cy + Math.sin(angle) * sr;
    parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${1 + Math.random() * 2}" fill="#fde68a" opacity="${(0.3 + Math.random() * 0.4).toFixed(2)}"/>`);
  }
  return parts.join('\n');
}

/* ─── Gift box ─── */
function giftBox(cx, cy, w, h, hue) {
  const parts = [];
  parts.push(`<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="6" fill="${hue}" opacity="0.25"/>`);
  parts.push(`<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="6" fill="none" stroke="${hue}" stroke-width="2" opacity="0.7"/>`);
  parts.push(`<line x1="${cx}" y1="${cy - h / 2}" x2="${cx}" y2="${cy + h / 2}" stroke="${hue}" stroke-width="2" opacity="0.5"/>`);
  parts.push(`<line x1="${cx - w / 2}" y1="${cy}" x2="${cx + w / 2}" y2="${cy}" stroke="${hue}" stroke-width="2" opacity="0.5"/>`);
  parts.push(`<path d="M${cx - 20},${cy - h / 2} Q${cx - 10},${cy - h / 2 - 18} ${cx},${cy - h / 2}" stroke="${hue}" stroke-width="2.5" fill="none"/>`);
  parts.push(`<path d="M${cx + 20},${cy - h / 2} Q${cx + 10},${cy - h / 2 - 18} ${cx},${cy - h / 2}" stroke="${hue}" stroke-width="2.5" fill="none"/>`);
  return parts.join('\n');
}

/* ─── Small colorful cracker ─── */
function smallCracker(cx, cy, hue) {
  return `<rect x="${cx - 8}" y="${cy - 4}" width="16" height="8" rx="2" fill="${hue}" opacity="0.8"/>
  <rect x="${cx - 10}" y="${cy - 3}" width="3" height="6" rx="1" fill="#f5d76e" opacity="0.6"/>
  <line x1="${cx + 8}" y1="${cy}" x2="${cx + 18}" y2="${cy - 5}" stroke="#8B7355" stroke-width="1.5" stroke-linecap="round"/>`;
}

/* ─── Category-specific SVG illustrations ─── */
function categorySparklers(w, h) {
  const parts = [];
  const rand = seededRandom(42);
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const stickPositions = [
    { x: cx - 120, y: cy + 80, angle: -75 },
    { x: cx - 40, y: cy + 100, angle: -80 },
    { x: cx + 40, y: cy + 90, angle: -70 },
    { x: cx + 120, y: cy + 85, angle: -78 },
    { x: cx - 80, y: cy + 110, angle: -73 },
    { x: cx + 80, y: cy + 105, angle: -77 },
  ];
  for (const s of stickPositions) {
    parts.push(sparklerStick(s.x, s.y, 160, s.angle, '#f5d76e'));
  }
  for (const s of stickPositions) {
    const rad = (s.angle * Math.PI) / 180;
    const tipX = s.x + Math.cos(rad) * 160;
    const tipY = s.y + Math.sin(rad) * 160;
    parts.push(sparklerSparks(tipX, tipY, 12, 45, '#f59e0b'));
  }
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#f5d76e" opacity="0.9">Sparklers</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">ILLUMINATE YOUR NIGHT</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryFlowerPots(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2 + 40;
  const defs = `<radialGradient id="glow" cx="50%" cy="35%" r="65%">
    <stop offset="0%" stop-color="#f97316" stop-opacity="0.3"/>
    <stop offset="60%" stop-color="#f97316" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const potPositions = [
    { x: cx - 140, y: cy + 60 },
    { x: cx, y: cy + 40 },
    { x: cx + 140, y: cy + 55 },
  ];
  for (const p of potPositions) {
    parts.push(`<path d="M${p.x - 25},${p.y} L${p.x - 20},${p.y + 35} L${p.x + 20},${p.y + 35} L${p.x + 25},${p.y} Z" fill="#2d2d35" stroke="#f97316" stroke-width="1.5" opacity="0.8"/>`);
    parts.push(`<rect x="${p.x - 28}" y="${p.y - 5}" width="56" height="8" rx="3" fill="#3d3d45" stroke="#f97316" stroke-width="1" opacity="0.7"/>`);
    parts.push(fountainEruption(p.x, p.y - 5, 120, 80, '#f97316', p.x * 7 + p.y));
  }
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#fb923c" opacity="0.9">Flower Pots</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">BLOOMING CELEBRATIONS</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryRockets(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#ef4444" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const rocketPositions = [
    { x: cx - 100, y: cy - 80 },
    { x: cx + 60, y: cy - 100 },
    { x: cx - 30, y: cy - 40 },
  ];
  for (const r of rocketPositions) {
    parts.push(rocketTrail(r.x, r.y, '#ef4444'));
  }
  for (const r of rocketPositions) {
    const burstCx = r.x + (Math.random() - 0.5) * 40;
    const burstCy = r.y - 80 - Math.random() * 60;
    parts.push(sparklerSparks(burstCx, burstCy, 15, 50, '#f87171'));
  }
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#f87171" opacity="0.9">Rockets</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">SOARING SKY HIGH</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryGroundChakkars(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#a855f7" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#a855f7" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(chakkarWheel(cx - 120, cy + 20, 55, '#a855f7'));
  parts.push(chakkarWheel(cx + 120, cy - 10, 45, '#c084fc'));
  parts.push(chakkarWheel(cx, cy + 60, 40, '#a855f7'));
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="42" font-weight="bold" fill="#c084fc" opacity="0.9">Ground Chakkars</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">SPINNING GOLDEN WHEELS</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryFountains(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2 + 60;
  const defs = `<radialGradient id="glow" cx="50%" cy="35%" r="65%">
    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
    <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(`<rect x="${cx - 35}" y="${cy}" width="70" height="50" rx="4" fill="#1e293b" stroke="#3b82f6" stroke-width="2" opacity="0.8"/>`);
  parts.push(`<rect x="${cx - 40}" y="${cy - 5}" width="80" height="10" rx="3" fill="#2d3a4f" stroke="#3b82f6" stroke-width="1.5" opacity="0.7"/>`);
  parts.push(fountainEruption(cx, cy - 5, 200, 140, '#3b82f6', 777));
  parts.push(fountainEruption(cx - 80, cy + 20, 120, 80, '#60a5fa', 888));
  parts.push(fountainEruption(cx + 80, cy + 15, 130, 85, '#60a5fa', 999));
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#60a5fa" opacity="0.9">Fountains</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">CASCADING SPARKS</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryGiftBoxes(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#eab308" stop-opacity="0.25"/>
    <stop offset="60%" stop-color="#eab308" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx, cy, 160, 120, '#eab308'));
  parts.push(giftBox(cx - 180, cy + 40, 80, 60, '#facc15'));
  parts.push(giftBox(cx + 180, cy + 30, 90, 65, '#facc15'));
  parts.push(sparklerSparks(cx - 200, cy - 100, 8, 40, '#eab308'));
  parts.push(sparklerSparks(cx + 200, cy - 80, 8, 40, '#eab308'));
  parts.push(sparklerSparks(cx, cy - 140, 10, 50, '#eab308'));
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#facc15" opacity="0.9">Gift Boxes</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">FESTIVE GIFT SETS</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryKidsSpecial(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#ec4899" stop-opacity="0.2"/>
    <stop offset="60%" stop-color="#ec4899" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const colors = ['#ec4899', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];
  const positions = [
    { x: cx - 150, y: cy - 60 }, { x: cx - 50, y: cy - 80 }, { x: cx + 50, y: cy - 70 },
    { x: cx + 150, y: cy - 50 }, { x: cx - 100, y: cy + 20 }, { x: cx, y: cy },
    { x: cx + 100, y: cy + 10 }, { x: cx - 70, y: cy + 80 }, { x: cx + 70, y: cy + 70 },
  ];
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const c = colors[i % colors.length];
    parts.push(smallCracker(p.x, p.y, c));
    parts.push(sparklerSparks(p.x, p.y - 15, 5, 20, c));
  }
  const starPositions = [
    { x: cx - 180, y: cy - 140 }, { x: cx + 160, y: cy - 120 },
    { x: cx - 30, y: cy - 160 }, { x: cx + 120, y: cy + 100 },
  ];
  for (const s of starPositions) {
    parts.push(`<text x="${s.x}" y="${s.y}" font-size="24" fill="#fbbf24" opacity="0.5">&#10022;</text>`);
  }
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#f472b6" opacity="0.9">Kids Special</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">SAFE &amp; COLORFUL FUN</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function categoryCombos(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/>
    <stop offset="60%" stop-color="#10b981" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx, cy + 40, 200, 130, '#10b981'));
  parts.push(sparklerStick(cx - 60, cy + 100, 100, -80, '#34d399'));
  parts.push(sparklerSparks(cx - 60 + Math.cos((-80 * Math.PI) / 180) * 100, cy + 100 + Math.sin((-80 * Math.PI) / 180) * 100, 8, 30, '#34d399'));
  parts.push(fountainEruption(cx + 60, cy + 60, 80, 50, '#10b981', 1234));
  parts.push(chakkarWheel(cx - 140, cy + 60, 30, '#34d399'));
  parts.push(`<text x="${cx}" y="${h - 60}" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="#34d399" opacity="0.9">Combo Packs</text>`);
  parts.push(`<text x="${cx}" y="${h - 30}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="18" fill="#b9b4a6" letter-spacing="6">EVERYTHING YOU NEED</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

const CATEGORY_GENERATORS = {
  sparklers: categorySparklers,
  'flower-pots': categoryFlowerPots,
  rockets: categoryRockets,
  'ground-chakkars': categoryGroundChakkars,
  fountains: categoryFountains,
  'gift-boxes': categoryGiftBoxes,
  'kids-special': categoryKidsSpecial,
  combos: categoryCombos,
};

/* ─── Product-specific SVG illustrations ─── */
function product1000WalaCrackers(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const rand = seededRandom(1000);
  for (let row = 0; row < 6; row++) {
    const y = cy - 120 + row * 55;
    const count = 18 + Math.floor(rand() * 6);
    for (let i = 0; i < count; i++) {
      const x = cx - 220 + i * 24;
      const color = rand() > 0.5 ? '#ef4444' : '#f59e0b';
      parts.push(`<rect x="${x}" y="${y}" width="12" height="6" rx="2" fill="${color}" opacity="0.85"/>`);
      parts.push(`<line x1="${x + 12}" y1="${y + 3}" x2="${x + 20}" y2="${y + 1}" stroke="#8B7355" stroke-width="1" opacity="0.5"/>`);
    }
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#f5d76e" opacity="0.9">1000 Wala Crackers</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productGoldenSparklers(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const stickAngles = [-85, -75, -65, -80, -70, -78, -72, -82];
  for (let i = 0; i < stickAngles.length; i++) {
    const x = cx - 180 + i * 50;
    parts.push(sparklerStick(x, cy + 120, 200, stickAngles[i], '#f5d76e'));
    const rad = (stickAngles[i] * Math.PI) / 180;
    const tipX = x + Math.cos(rad) * 200;
    const tipY = cy + 120 + Math.sin(rad) * 200;
    parts.push(sparklerSparks(tipX, tipY, 15, 55, '#fbbf24'));
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#f5d76e" opacity="0.9">Golden Sparklers (30cm)</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productFlowerPotDeluxe(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2 + 60;
  const defs = `<radialGradient id="glow" cx="50%" cy="35%" r="65%">
    <stop offset="0%" stop-color="#f97316" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(`<path d="M${cx - 45},${cy} L${cx - 35},${cy + 60} L${cx + 35},${cy + 60} L${cx + 45},${cy} Z" fill="#2d2d35" stroke="#f97316" stroke-width="2" opacity="0.8"/>`);
  parts.push(`<rect x="${cx - 50}" y="${cy - 8}" width="100" height="12" rx="4" fill="#3d3d45" stroke="#f97316" stroke-width="1.5" opacity="0.7"/>`);
  parts.push(fountainEruption(cx, cy - 8, 220, 160, '#f97316', 4242));
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#fb923c" opacity="0.9">Flower Pot Deluxe</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productSkyShotRocket(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="35%" r="60%">
    <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(rocketTrail(cx, cy - 40, '#ef4444'));
  const colors = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7'];
  for (let i = 0; i < 5; i++) {
    const bx = cx + (Math.random() - 0.5) * 200;
    const by = cy - 180 + (Math.random() - 0.5) * 80;
    parts.push(sparklerSparks(bx, by, 12, 45, colors[i]));
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#f87171" opacity="0.9">Sky Shot Rocket (Multi-Color)</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productSpinningWheelChakkar(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#a855f7" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(chakkarWheel(cx, cy, 100, '#a855f7'));
  parts.push(`<circle cx="${cx}" cy="${cy}" r="8" fill="#fde68a" opacity="0.8"/>`);
  const trailRand = seededRandom(555);
  for (let i = 0; i < 30; i++) {
    const angle = trailRand() * Math.PI * 2;
    const r = 105 + trailRand() * 40;
    const sx = cx + Math.cos(angle) * r;
    const sy = cy + Math.sin(angle) * r;
    parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${1 + trailRand() * 2.5}" fill="#fde68a" opacity="${(0.4 + trailRand() * 0.4).toFixed(2)}"/>`);
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#c084fc" opacity="0.9">Spinning Wheel Ground Chakkar</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productVibrantFountainShow(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2 + 80;
  const defs = `<radialGradient id="glow" cx="50%" cy="30%" r="65%">
    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(`<rect x="${cx - 50}" y="${cy}" width="100" height="70" rx="5" fill="#1e293b" stroke="#3b82f6" stroke-width="2" opacity="0.8"/>`);
  parts.push(`<rect x="${cx - 55}" y="${cy - 8}" width="110" height="14" rx="4" fill="#2d3a4f" stroke="#3b82f6" stroke-width="1.5" opacity="0.7"/>`);
  parts.push(fountainEruption(cx, cy - 8, 280, 180, '#3b82f6', 3333));
  parts.push(fountainEruption(cx - 60, cy + 10, 150, 90, '#60a5fa', 4444));
  parts.push(fountainEruption(cx + 60, cy + 10, 160, 95, '#60a5fa', 5555));
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#60a5fa" opacity="0.9">Vibrant Fountain Show</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productShubhDeepawaliGiftBox(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#eab308" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx, cy, 220, 160, '#eab308'));
  for (let i = 0; i < 8; i++) {
    const sx = cx - 180 + i * 50;
    const sy = cy + 95;
    parts.push(`<rect x="${sx}" y="${sy}" width="35" height="14" rx="3" fill="#f59e0b" opacity="0.7"/>`);
    parts.push(`<rect x="${sx - 2}" y="${sy + 2}" width="5" height="10" rx="1.5" fill="#fde68a" opacity="0.5"/>`);
  }
  for (let i = 0; i < 4; i++) {
    parts.push(`<rect x="${cx - 100 + i * 55}" y="${cy + 120}" width="40" height="18" rx="4" fill="#ef4444" opacity="0.6"/>`);
  }
  parts.push(sparklerSparks(cx - 180, cy - 120, 10, 35, '#eab308'));
  parts.push(sparklerSparks(cx + 180, cy - 100, 10, 35, '#eab308'));
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#facc15" opacity="0.9">Shubh Deepawali Gift Box</text>`);
  parts.push(`<text x="${cx}" y="${h - 25}" text-anchor="middle" font-family="Verdana, sans-serif" font-size="14" fill="#b9b4a6" letter-spacing="4">31 ITEMS</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productMagicWhipCracklingSparks(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#ec4899" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const colors = ['#ec4899', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];
  for (let i = 0; i < 7; i++) {
    const x = cx - 160 + i * 55;
    const y = cy - 20;
    const c = colors[i];
    parts.push(`<path d="M${x},${y + 40} Q${x + (Math.random() - 0.5) * 30},${y} ${x + (Math.random() - 0.5) * 20},${y - 40}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>`);
    parts.push(sparklerSparks(x, y - 40, 6, 20, c));
  }
  for (let i = 0; i < 12; i++) {
    const sx = cx - 180 + Math.random() * 360;
    const sy = cy - 100 + Math.random() * 200;
    parts.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${2 + Math.random() * 3}" fill="${colors[Math.floor(Math.random() * colors.length)]}" opacity="${(0.3 + Math.random() * 0.4).toFixed(2)}"/>`);
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#f472b6" opacity="0.9">Magic Whip &amp; Crackling Sparks</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productFamilyComboPack(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx - 100, cy + 20, 130, 90, '#10b981'));
  parts.push(chakkarWheel(cx + 130, cy + 40, 35, '#34d399'));
  parts.push(sparklerStick(cx - 60, cy + 70, 80, -78, '#34d399'));
  parts.push(sparklerSparks(cx - 60 + Math.cos((-78 * Math.PI) / 180) * 80, cy + 70 + Math.sin((-78 * Math.PI) / 180) * 80, 6, 25, '#34d399'));
  parts.push(fountainEruption(cx + 40, cy + 60, 60, 40, '#10b981', 6666));
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#34d399" opacity="0.9">Family Combo Pack</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productKidsSpecialToyCrackersPack(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="45%" r="60%">
    <stop offset="0%" stop-color="#ec4899" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  const colors = ['#ec4899', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c', '#ef4444'];
  const positions = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      positions.push({ x: cx - 150 + col * 100, y: cy - 100 + row * 80 });
    }
  }
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    const c = colors[i % colors.length];
    const type = i % 4;
    if (type === 0) {
      parts.push(smallCracker(p.x, p.y, c));
    } else if (type === 1) {
      parts.push(`<circle cx="${p.x}" cy="${p.y}" r="10" fill="${c}" opacity="0.7"/>`);
      parts.push(`<circle cx="${p.x}" cy="${p.y}" r="4" fill="#fde68a" opacity="0.8"/>`);
    } else if (type === 2) {
      parts.push(`<rect x="${p.x - 6}" y="${p.y - 12}" width="12" height="24" rx="3" fill="${c}" opacity="0.7"/>`);
      parts.push(`<line x1="${p.x}" y1="${p.y - 12}" x2="${p.x}" y2="${p.y - 22}" stroke="#fde68a" stroke-width="1.5" opacity="0.6"/>`);
    } else {
      parts.push(`<polygon points="${p.x},${p.y - 12} ${p.x - 8},${p.y + 6} ${p.x + 8},${p.y + 6}" fill="${c}" opacity="0.7"/>`);
    }
    parts.push(sparklerSparks(p.x, p.y, 4, 15, c));
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#f472b6" opacity="0.9">Kids Special Toy Crackers Pack</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productPremiumFestiveCombo(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="40%" r="65%">
    <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx, cy + 30, 200, 140, '#10b981'));
  parts.push(rocketTrail(cx - 80, cy - 80, '#ef4444'));
  parts.push(sparklerStick(cx + 60, cy + 100, 120, -75, '#34d399'));
  parts.push(sparklerSparks(cx + 60 + Math.cos((-75 * Math.PI) / 180) * 120, cy + 100 + Math.sin((-75 * Math.PI) / 180) * 120, 10, 35, '#34d399'));
  parts.push(chakkarWheel(cx + 150, cy + 50, 30, '#10b981'));
  parts.push(fountainEruption(cx - 150, cy + 80, 70, 45, '#34d399', 8888));
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#34d399" opacity="0.9">Premium Festive Combo</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

function productGrandCelebrationCombo(w, h) {
  const parts = [];
  const cx = w / 2, cy = h / 2;
  const defs = `<radialGradient id="glow" cx="50%" cy="40%" r="65%">
    <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
  </radialGradient>`;
  parts.push(`<rect width="${w}" height="${h}" fill="url(#glow)"/>`);
  parts.push(giftBox(cx, cy + 50, 240, 150, '#10b981'));
  parts.push(rocketTrail(cx - 100, cy - 60, '#ef4444'));
  parts.push(rocketTrail(cx + 100, cy - 80, '#f59e0b'));
  parts.push(sparklerStick(cx - 60, cy + 120, 130, -80, '#34d399'));
  parts.push(sparklerSparks(cx - 60 + Math.cos((-80 * Math.PI) / 180) * 130, cy + 120 + Math.sin((-80 * Math.PI) / 180) * 130, 10, 35, '#34d399'));
  parts.push(fountainEruption(cx + 80, cy + 100, 90, 60, '#10b981', 9999));
  parts.push(chakkarWheel(cx - 180, cy + 80, 35, '#34d399'));
  parts.push(chakkarWheel(cx + 180, cy + 70, 30, '#10b981'));
  for (let i = 0; i < 5; i++) {
    const bx = cx + (Math.random() - 0.5) * 300;
    const by = cy - 140 + (Math.random() - 0.5) * 60;
    parts.push(sparklerSparks(bx, by, 8, 30, ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899'][i]));
  }
  parts.push(`<text x="${cx}" y="${h - 50}" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#34d399" opacity="0.9">Grand Celebration Combo</text>`);
  return wrapSvg(w, h, parts.join('\n'), defs);
}

const PRODUCT_GENERATORS = {
  '1000-wala-crackers': product1000WalaCrackers,
  'golden-sparklers-30cm': productGoldenSparklers,
  'flower-pot-deluxe': productFlowerPotDeluxe,
  'sky-shot-rocket-multi-color': productSkyShotRocket,
  'spinning-wheel-ground-chakkar': productSpinningWheelChakkar,
  'vibrant-fountain-show': productVibrantFountainShow,
  'shubh-deepawali-gift-box': productShubhDeepawaliGiftBox,
  'magic-whip-crackling-sparks': productMagicWhipCracklingSparks,
  'family-combo-pack': productFamilyComboPack,
  'kids-special-toy-crackers-pack': productKidsSpecialToyCrackersPack,
  'premium-festive-combo': productPremiumFestiveCombo,
  'grand-celebration-combo': productGrandCelebrationCombo,
};

/* ─── File writer ─── */
function writeSvg(relPath, content) {
  const abs = path.join(PUBLIC_DIR, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf-8');
}

async function svgToWebp(svgContent, webpRelPath, width, height) {
  const abs = path.join(PUBLIC_DIR, webpRelPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  await sharp(Buffer.from(svgContent), { density: 150 })
    .resize(width, height, { fit: 'contain', background: { r: 15, g: 15, b: 19, alpha: 1 } })
    .webp({ quality: 85, effort: 4 })
    .toFile(abs);
}

/* ─── Main generation ─── */
let written = 0;

async function main() {
  for (const cat of CATEGORIES) {
    const generator = CATEGORY_GENERATORS[cat.id];
    if (generator) {
      const svgContent = generator(800, 1000);
      writeSvg(path.join('images', 'categories', `${cat.id}.svg`), svgContent);
      await svgToWebp(svgContent, path.join('images', 'categories', `${cat.id}.webp`), 800, 1000);
      written++;
    }
  }

  for (const p of PRODUCTS) {
    const generator = PRODUCT_GENERATORS[p.slug];
    if (generator) {
      const svgContent = generator(800, 800);
      writeSvg(path.join('images', 'products', p.category, `${p.slug}.svg`), svgContent);
      await svgToWebp(svgContent, path.join('images', 'products', p.category, `${p.slug}.webp`), 800, 800);
      written++;
    }
  }

  console.log(`Generated ${written} product/category assets (SVG + WebP) under public/images/`);
}

main().catch(console.error);
