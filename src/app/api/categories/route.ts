import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CATEGORIES_PATH = path.join(process.cwd(), 'categories.json');

const FALLBACK_CATEGORIES = [
  { id: 'sparklers', name: 'Sparklers', image: '/images/categories/sparklers.webp' },
  { id: 'flower-pots', name: 'Flower Pots', image: '/images/categories/flower-pots.webp' },
  { id: 'rockets', name: 'Rockets', image: '/images/categories/rockets.webp' },
  { id: 'ground-chakkars', name: 'Ground Chakkars', image: '/images/categories/ground-chakkars.webp' },
  { id: 'fountains', name: 'Fountains', image: '/images/categories/fountains.webp' },
  { id: 'gift-boxes', name: 'Gift Boxes', image: '/images/categories/gift-boxes.webp' },
  { id: 'kids-special', name: 'Kids Special', image: '/images/categories/kids-special.webp' },
  { id: 'combos', name: 'Combo Packs', image: '/images/categories/combos.webp' },
];

interface CategoryEntry {
  id: string;
  name: string;
  image: string;
}

function readCategories(): CategoryEntry[] {
  try {
    if (fs.existsSync(CATEGORIES_PATH)) {
      return JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf-8'));
    }
  } catch { /* ignore */ }
  return [...FALLBACK_CATEGORIES];
}

function writeCategories(categories: CategoryEntry[]) {
  fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(categories, null, 2), 'utf-8');
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  const categories = readCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, image } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const categories = readCategories();
    const id = slugify(name.trim());

    if (categories.some((c) => c.id === id)) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const newCategory: CategoryEntry = {
      id,
      name: name.trim(),
      image: image || `/images/categories/${id}.webp`,
    };

    categories.push(newCategory);
    writeCategories(categories);

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Category create error:', error);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, image, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    }

    const categories = readCategories();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (image) categories[index].image = image;
    if (name && typeof name === 'string' && name.trim().length > 0) {
      categories[index].name = name.trim();
    }

    writeCategories(categories);

    return NextResponse.json({ success: true, category: categories[index] });
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    }

    const categories = readCategories();
    const filtered = categories.filter((c) => c.id !== id);

    if (filtered.length === categories.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    writeCategories(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
