import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { DEFAULT_PRODUCTS, IProduct, IOrder } from './mockData';
import { normalizeProductImages, resolveDisplayImages } from './images';
import { createLocalFileFilter } from './imageManifest';

const FALLBACK_FILE_PATH = path.join(process.cwd(), 'db_fallback.json');

function withNormalizedImages<T extends IProduct>(product: T): T {
  return {
    ...product,
    images: normalizeProductImages(product.images, product.name, product.category),
  };
}

// Helper to initialize fallback file if it doesn't exist
function initFallbackDb() {
  if (!fs.existsSync(FALLBACK_FILE_PATH)) {
    const initialData = {
      products: DEFAULT_PRODUCTS.map((p, idx) => ({
        ...p,
        _id: `mock-prod-${idx + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      orders: [],
    };
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readFallbackDb(): { products: IProduct[]; orders: IOrder[] } {
  try {
    initFallbackDb();
    const data = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading fallback db file:', error);
    return { products: [], orders: [] };
  }
}

function writeFallbackDb(data: { products: IProduct[]; orders: IOrder[] }) {
  try {
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing fallback db file:', error);
  }
}

// Check if database connection is available
async function isDbConnected(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  const conn = await connectToDatabase();
  return conn !== null;
}

export async function getProducts(): Promise<IProduct[]> {
  try {
    if (await isDbConnected()) {
      const docs = await Product.find({}).sort({ createdAt: -1 }).lean();
      return (docs as unknown as IProduct[])
        .map((doc) => ({ ...doc, _id: String(doc._id) }))
        .map(withNormalizedImages);
    }
  } catch (error) {
    console.error('MongoDB error in getProducts, falling back:', error);
  }
  const db = readFallbackDb();
  return db.products.filter(p => p.isActive !== false).map(withNormalizedImages);
}

export async function getStorefrontProducts(): Promise<IProduct[]> {
  const products = await getProducts();
  const fileFilter = createLocalFileFilter();
  return products.map((product) => ({
    ...product,
    images: resolveDisplayImages(product, fileFilter),
  }));
}

export async function getProductBySlug(slug: string): Promise<IProduct | null> {
  try {
    if (await isDbConnected()) {
      const doc = await Product.findOne({ slug }).lean();
      if (!doc) return null;
      return withNormalizedImages({ ...(doc as unknown as IProduct), _id: String((doc as unknown as { _id: unknown })._id) });
    }
  } catch (error) {
    console.error(`MongoDB error in getProductBySlug for ${slug}, falling back:`, error);
  }
  const db = readFallbackDb();
  const found = db.products.find((p) => p.slug === slug && p.isActive !== false);
  return found ? withNormalizedImages(found) : null;
}

export async function getStorefrontProductBySlug(slug: string): Promise<IProduct | null> {
  const product = await getProductBySlug(slug);
  if (!product) return null;
  const fileFilter = createLocalFileFilter();
  return {
    ...product,
    images: resolveDisplayImages(product, fileFilter),
  };
}

export async function createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
  const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const data = withNormalizedImages({ ...productData, slug });

  try {
    if (await isDbConnected()) {
      return await Product.create(data);
    }
  } catch (error) {
    console.error('MongoDB error in createProduct, falling back:', error);
  }

  const db = readFallbackDb();
  const newProduct: IProduct = {
    ...data,
    _id: `mock-prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.push(newProduct);
  writeFallbackDb(db);
  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
  try {
    if (await isDbConnected()) {
      const existingDoc = await Product.findById(id).lean();
      if (!existingDoc) return null;
      const existing = {
        ...(existingDoc as unknown as IProduct),
        _id: String((existingDoc as unknown as { _id: unknown })._id),
      };
      const merged = withNormalizedImages({ ...existing, ...productData });
      const { _id: _ignored, ...patchWithoutId } = merged;
      void _ignored;
      return await Product.findByIdAndUpdate(id, patchWithoutId, { new: true });
    }
  } catch (error) {
    console.error(`MongoDB error in updateProduct for ${id}, falling back:`, error);
  }

  const db = readFallbackDb();
  const productIndex = db.products.findIndex((p) => p._id === id);
  if (productIndex === -1) return null;

  const merged = withNormalizedImages({
    ...db.products[productIndex],
    ...productData,
    updatedAt: new Date().toISOString(),
  });

  db.products[productIndex] = merged;
  writeFallbackDb(db);
  return merged;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    if (await isDbConnected()) {
      const result = await Product.findByIdAndDelete(id);
      return result !== null;
    }
  } catch (error) {
    console.error(`MongoDB error in deleteProduct for ${id}, falling back:`, error);
  }

  const db = readFallbackDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p._id !== id);
  writeFallbackDb(db);
  return db.products.length < initialLength;
}

export async function getOrders(): Promise<IOrder[]> {
  try {
    if (await isDbConnected()) {
      return await Order.find({}).sort({ createdAt: -1 });
    }
  } catch (error) {
    console.error('MongoDB error in getOrders, falling back:', error);
  }
  const db = readFallbackDb();
  return db.orders;
}

export async function createOrder(orderData: Omit<IOrder, '_id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<IOrder> {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `KSC-${randNum}`;
  const data = { ...orderData, orderNumber };

  try {
    if (await isDbConnected()) {
      return await Order.create(data);
    }
  } catch (error) {
    console.error('MongoDB error in createOrder, falling back:', error);
  }

  const db = readFallbackDb();
  const newOrder: IOrder = {
    ...data,
    _id: `mock-ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  writeFallbackDb(db);
  return newOrder;
}

export async function updateOrder(id: string, orderData: Partial<IOrder>): Promise<IOrder | null> {
  try {
    if (await isDbConnected()) {
      return await Order.findByIdAndUpdate(id, orderData, { new: true });
    }
  } catch (error) {
    console.error(`MongoDB error in updateOrder for ${id}, falling back:`, error);
  }

  const db = readFallbackDb();
  const orderIndex = db.orders.findIndex((o) => o._id === id);
  if (orderIndex === -1) return null;

  const updatedOrder = {
    ...db.orders[orderIndex],
    ...orderData,
    updatedAt: new Date().toISOString(),
  };

  db.orders[orderIndex] = updatedOrder;
  writeFallbackDb(db);
  return updatedOrder;
}
