'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { IProduct } from '@/lib/mockData';
import { toast } from 'sonner';
import ProductImageView from './ProductImageView';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const discountPercent = product.mrp > product.sellingPrice
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-stone-50 overflow-hidden">
        <div className="absolute inset-0 p-3">
          <ProductImageView
            product={product}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fit="contain"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-burgundy-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-stone-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              Bestseller
            </span>
          )}
        </div>

        {/* Stock */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-200">
            Low Stock
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute top-2 right-2 bg-red-50 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
            Sold Out
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-terracotta-600 font-semibold">
            {product.category.replace('-', ' ')}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-stone-900 mt-0.5 line-clamp-1 hover:text-burgundy-700 transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-stone-900">
            ₹{product.sellingPrice}
          </span>
          {product.mrp > product.sellingPrice && (
            <span className="text-xs text-stone-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        {product.stock > 0 ? (
          <div className="flex gap-2">
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg overflow-hidden shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                className="p-1.5 text-stone-400 hover:text-stone-700"
                aria-label="Decrease quantity"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <span className="text-xs font-semibold w-6 text-center text-stone-900 select-none">{quantity}</span>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.min(product.stock, q + 1)); }}
                className="p-1.5 text-stone-400 hover:text-stone-700"
                aria-label="Increase quantity"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex-grow flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-semibold transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-burgundy-700 text-white hover:bg-burgundy-800'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-stone-100 text-stone-400 border border-stone-200 py-2 rounded-lg text-xs font-semibold cursor-not-allowed"
          >
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
}
