import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const FALLBACK_PATH = path.join(process.cwd(), 'db_fallback.json');

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
    console.error('MONGODB_URI is not set. Nothing to sync.');
    process.exit(1);
  }

  const raw = fs.readFileSync(FALLBACK_PATH, 'utf-8');
  const { products } = JSON.parse(raw);

  await mongoose.connect(uri, { bufferCommands: false });
  console.log('Connected to MongoDB');

  let inserted = 0;
  let updated = 0;

  for (const product of products) {
    const { _id, ...doc } = product;
    const result = await Product.updateOne(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
    else if (result.modifiedCount > 0) updated++;
  }

  const total = await Product.countDocuments();
  console.log(`Sync complete. Inserted: ${inserted}, Updated: ${updated}, Total in catalog: ${total}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
