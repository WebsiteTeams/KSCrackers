'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Minus,
  Sparkles,
  Percent
} from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal, 
    getOriginalTotal, 
    getDiscountTotal 
  } = useCartStore();

  const cartTotal = getCartTotal();
  const originalTotal = getOriginalTotal();
  const discountTotal = getDiscountTotal();

  const handleQtyChange = (productId: string, quantity: number, stock: number) => {
    if (quantity > stock) {
      toast.error(`Only ${stock} items available in inventory.`);
      return;
    }
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.success(`${name} removed from cart.`);
  };

  // Helper for mock graphic background
  const getIllustrationBg = (slug: string) => {
    if (slug.includes('sparkler')) return { icon: '✨', bg: 'from-amber-600/30 to-yellow-500/20' };
    if (slug.includes('pot')) return { icon: '🌋', bg: 'from-orange-600/30 to-amber-600/20' };
    if (slug.includes('rocket')) return { icon: '🚀', bg: 'from-red-600/30 to-orange-500/20' };
    if (slug.includes('chakkar')) return { icon: '🌀', bg: 'from-yellow-600/30 to-amber-500/20' };
    if (slug.includes('fountain')) return { icon: '⛲', bg: 'from-teal-600/30 to-blue-500/20' };
    if (slug.includes('gift')) return { icon: '🎁', bg: 'from-purple-600/30 to-pink-500/20' };
    if (slug.includes('kids')) return { icon: '🧸', bg: 'from-green-600/30 to-emerald-500/20' };
    return { icon: '💥', bg: 'from-amber-700/30 to-orange-600/20' };
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-charcoal-850 rounded-full flex items-center justify-center mx-auto border border-gold-500/10">
          <ShoppingBag className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-charcoal-400 leading-relaxed font-medium">
          Add premium Sivakasi crackers and explore festive packages to light up your celebrations.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-8 py-3.5 rounded-lg shadow-xl text-xs uppercase tracking-wider cursor-pointer hover:opacity-95 transition-opacity"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
          SHOPPING CART
        </h1>
        <p className="text-xs text-charcoal-400 mt-1 font-medium">
          Manage items selected for order confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden p-6 space-y-6 shadow-lg">
            {items.map((item) => {
              const illustration = getIllustrationBg(item.product.slug);
              return (
                <div
                  key={item.product._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/5 last:border-b-0 last:pb-0 gap-4"
                >
                  {/* Thumbnail and Title */}
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail graphic fallback */}
                    <div className="w-20 h-20 relative bg-charcoal-950 rounded-xl overflow-hidden shrink-0 border border-white/5 flex items-center justify-center">
                      <div className={`absolute inset-0 bg-gradient-to-br ${illustration.bg} flex items-center justify-center text-3xl select-none`}>
                        {illustration.icon}
                      </div>
                      {item.product.images && item.product.images[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          className="absolute inset-0 w-full h-full object-cover z-10 opacity-90"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-bold text-base text-white hover:text-gold-500 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-gold-500 uppercase tracking-wider font-semibold block">
                        {item.product.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price controls */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                    {/* Qty count control */}
                    <div className="flex items-center bg-charcoal-900 border border-white/10 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() => handleQtyChange(item.product._id!, item.quantity - 1, item.product.stock)}
                        className="p-2 text-charcoal-400 hover:text-white"
                        aria-label="Decrease Quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-white px-3 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.product._id!, item.quantity + 1, item.product.stock)}
                        className="p-2 text-charcoal-400 hover:text-white"
                        aria-label="Increase Quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price and delete button */}
                    <div className="flex items-center gap-6">
                      <div className="text-right space-y-0.5">
                        <span className="text-base font-bold text-white block">
                          ₹{item.product.sellingPrice * item.quantity}
                        </span>
                        {item.product.mrp > item.product.sellingPrice && (
                          <span className="text-xs text-charcoal-400 line-through block">
                            ₹{item.product.mrp * item.quantity}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemove(item.product._id!, item.product.name)}
                        className="p-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/30 text-red-400 rounded-lg transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue shopping trigger */}
          <div className="flex items-center">
            <Link
              href="/shop"
              className="text-sm font-semibold text-charcoal-300 hover:text-gold-500 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Pricing Summary Card */}
        <div className="space-y-4">
          <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6 shadow-lg">
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">
              Order Summary
            </h3>

            {/* Calculations breakdown */}
            <div className="space-y-3.5 text-sm border-b border-white/5 pb-4">
              <div className="flex justify-between font-semibold text-charcoal-300">
                <span>Items Original Price</span>
                <span>₹{originalTotal}</span>
              </div>
              
              {discountTotal > 0 && (
                <div className="flex justify-between font-semibold text-green-400">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" />
                    Festive Discount
                  </span>
                  <span>- ₹{discountTotal}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-charcoal-300">
                <span>Shipping / Dispatch</span>
                <span className="text-gold-500 font-bold uppercase text-xs">Calculated at Checkout</span>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-baseline font-bold">
              <span className="text-base text-white">Final Total</span>
              <span className="text-2xl text-gradient-gold">₹{cartTotal}</span>
            </div>

            {/* Notification disclaimer */}
            {discountTotal > 0 && (
              <div className="bg-green-950/20 text-green-400 border border-green-500/10 p-3 rounded-lg text-xs leading-relaxed font-semibold flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>Excellent choice! You are saving ₹{discountTotal} on this festive order.</span>
              </div>
            )}

            {/* Checkout CTAs */}
            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold py-3.5 rounded-lg shadow-xl hover:opacity-95 transition-opacity text-sm uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared successfully.');
                }}
                className="w-full bg-charcoal-800/50 hover:bg-charcoal-800 text-charcoal-400 border border-white/5 py-2.5 rounded-lg text-xs font-semibold uppercase cursor-pointer"
              >
                Clear Cart Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
