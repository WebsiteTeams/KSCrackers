import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  isOffer: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
