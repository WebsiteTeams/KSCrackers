'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Flame, Sparkles, Check, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { IProduct } from '@/lib/mockData';
import { toast } from 'sonner';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  // Calculate discount percentage
  const discountPercent = product.mrp > product.sellingPrice
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} item(s) ready for checkout.`,
      icon: <Sparkles className="w-4 h-4 text-gold-500" />,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Fallback styling is handled directly in the render with Lucide icons now.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="glass-card group rounded-xl overflow-hidden flex flex-col h-full border border-white/5 hover:border-gold-500/30 hover:glow-gold transition-all duration-300 relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md tracking-wider flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            {discountPercent}% OFF
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-charcoal-900/90 text-gold-400 border border-gold-500/40 text-[9px] font-bold px-2 py-0.5 rounded shadow-md tracking-wider uppercase">
            Bestseller
          </span>
        )}
      </div>

      {/* Stock status indicator top right */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        {product.stock <= 0 ? (
          <span className="bg-red-950/80 text-red-400 border border-red-500/30 text-[9px] font-semibold px-2 py-0.5 rounded shadow">
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="bg-orange-950/80 text-orange-400 border border-orange-500/30 text-[9px] font-semibold px-2 py-0.5 rounded shadow animate-pulse">
            Low Stock
          </span>
        ) : null}
      </div>

      {/* Image Area */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-charcoal-950 cursor-pointer">
        {/* Cinematic Golden Glow Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-60 z-10" />
        <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Fallback Premium Graphic */}
        <div className="absolute inset-0 bg-charcoal-800 flex items-center justify-center text-charcoal-600 group-hover:scale-110 transition-transform duration-500 border border-white/5">
          <Package className="w-12 h-12 stroke-[1.5]" />
        </div>

        {/* Real Product Image (if it exists, absolute positioned overlay) */}
        {product.images && product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={(e) => {
              // Hide image if fails and let fallback graphic show
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 z-10 opacity-90"
            loading="lazy"
          />
        )}
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Label */}
        <span className="text-[10px] uppercase tracking-widest text-gold-500 font-semibold mb-1">
          {product.category.replace('-', ' ')}
        </span>

        {/* Title */}
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <h3 className="font-bold text-base text-white group-hover:text-gold-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Brief Desc */}
        <p className="text-xs text-charcoal-400 mt-1 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Pricing & Cart controls */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex items-baseline justify-between mb-3.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white">
                ₹{product.sellingPrice}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-xs text-charcoal-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            {product.mrp > product.sellingPrice && (
              <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                Save ₹{product.mrp - product.sellingPrice}
              </span>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex gap-2">
            {product.stock > 0 ? (
              <>
                {/* Quantity Control */}
                <div className="flex items-center bg-charcoal-800 border border-white/10 rounded-lg overflow-hidden shrink-0">
                  <span className="text-xs font-semibold px-2 text-charcoal-300 w-6 text-center select-none">
                    {quantity}
                  </span>
                  <div className="flex flex-col border-l border-white/10">
                    <button
                      onClick={incrementQty}
                      disabled={quantity >= product.stock}
                      className="p-1 text-charcoal-400 hover:text-white hover:bg-charcoal-700 transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent"
                      aria-label="Increase Quantity"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={decrementQty}
                      disabled={quantity <= 1}
                      className="p-1 text-charcoal-400 hover:text-white hover:bg-charcoal-700 transition-colors border-t border-white/10 cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent"
                      aria-label="Decrease Quantity"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add To Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-grow flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                    added
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 hover:glow-gold hover:opacity-90'
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
              </>
            ) : (
              <button
                disabled
                className="w-full bg-charcoal-800 text-charcoal-500 border border-white/5 py-2 rounded-lg text-xs font-bold tracking-wide uppercase cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
