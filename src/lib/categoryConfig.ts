import fs from 'fs';
import path from 'path';
import { DEFAULT_CATEGORY_IMAGES } from './images';

const CATEGORIES_PATH = path.join(process.cwd(), 'categories.json');

interface CategoryEntry {
  id: string;
  name: string;
  image: string;
}

const FALLBACK_CATEGORIES: CategoryEntry[] = [
  { id: 'sparklers', name: 'Sparklers', image: '/images/categories/sparklers.jpg' },
  { id: 'flower-pots', name: 'Flower Pots', image: '/images/categories/flower-pots.jpg' },
  { id: 'rockets', name: 'Rockets', image: '/images/categories/rockets.jpg' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', image: '/images/categories/ground-chakkars.jpg' },
  { id: 'fountains', name: 'Fountains', image: '/images/categories/fountains.jpg' },
  { id: 'gift-boxes', name: 'Gift Boxes', image: '/images/categories/gift-boxes.jpg' },
  { id: 'kids-special', name: 'Kids Special', image: '/images/categories/kids-special.jpg' },
  { id: 'combos', name: 'Combo Packs', image: '/images/categories/combos.jpg' },
];

export function readCategoriesFile(): CategoryEntry[] {
  try {
    if (fs.existsSync(CATEGORIES_PATH)) {
      return JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf-8'));
    }
  } catch { /* ignore */ }
  return [...FALLBACK_CATEGORIES];
}

export function getCategoryImages(): Record<string, string> {
  const categories = readCategoriesFile();
  const result: Record<string, string> = {};
  for (const cat of categories) {
    result[cat.id] = cat.image || DEFAULT_CATEGORY_IMAGES[cat.id] || '';
  }
  return result;
}

export function getCategoryList(): { id: string; name: string }[] {
  return readCategoriesFile().map((c) => ({ id: c.id, name: c.name }));
}
