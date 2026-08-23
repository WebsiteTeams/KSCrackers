'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import ProductImageView from '@/components/ProductImageView';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, getOriginalTotal, getDiscountTotal } = useCartStore();
  const cartTotal = getCartTotal();
  const originalTotal = getOriginalTotal();
  const discountTotal = getDiscountTotal();

  const handleQtyChange = (productId: string, quantity: number, stock: number) => {
    if (quantity > stock) { toast.error(`Only ${stock} items available.`); return; }
    updateQuantity(productId, quantity);
  };

  const handleRemove = (productId: string, name: string) => {
    removeFromCart(productId);
    toast.success(`${name} removed from cart.`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Your Cart is Empty</h1>
        <p className="text-sm text-stone-500 leading-relaxed">Add premium Sivakasi crackers to light up your celebrations.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-burgundy-700 text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-burgundy-800 transition-colors">
          <span>Continue Shopping</span><ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Shopping Cart</h1>
        <p className="text-sm text-stone-500 mt-1">Manage items selected for order confirmation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
            {items.map((item) => (
              <div key={item.product._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-stone-100 last:border-b-0 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 relative bg-stone-50 rounded-lg overflow-hidden shrink-0 border border-stone-100">
                    <ProductImageView product={item.product} sizes="80px" fit="cover" compact />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-sm text-stone-900 hover:text-burgundy-700 transition-colors line-clamp-1">
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-burgundy-600 uppercase tracking-wider font-medium block">
                      {item.product.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                  <div className="flex items-center bg-stone-100 rounded-lg overflow-hidden shrink-0">
                    <button onClick={() => handleQtyChange(item.product._id!, item.quantity - 1, item.product.stock)} className="p-2 text-stone-500 hover:text-stone-900" aria-label="Decrease"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm font-semibold text-stone-900 px-3 min-w-[32px] text-center">{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.product._id!, item.quantity + 1, item.product.stock)} className="p-2 text-stone-500 hover:text-stone-900" aria-label="Increase"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-base font-bold text-stone-900 block">₹{item.product.sellingPrice * item.quantity}</span>
                      {item.product.mrp > item.product.sellingPrice && <span className="text-xs text-stone-400 line-through block">₹{item.product.mrp * item.quantity}</span>}
                    </div>
                    <button onClick={() => handleRemove(item.product._id!, item.product.name)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/shop" className="text-sm font-medium text-stone-500 hover:text-burgundy-700 transition-colors flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h3>
            <div className="space-y-3 text-sm border-b border-stone-100 pb-4">
              <div className="flex justify-between text-stone-600"><span>Original Price</span><span>₹{originalTotal}</span></div>
              {discountTotal > 0 && <div className="flex justify-between text-green-700 font-medium"><span>Festive Discount</span><span>- ₹{discountTotal}</span></div>}
              <div className="flex justify-between text-stone-600"><span>Shipping</span><span className="text-xs font-semibold text-green-700">Calculated at Checkout</span></div>
            </div>
            <div className="flex justify-between items-baseline font-bold">
              <span className="text-base text-stone-900">Final Total</span>
              <span className="text-2xl text-burgundy-700">₹{cartTotal}</span>
            </div>
            {discountTotal > 0 && (
              <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-xs leading-relaxed font-medium">
                You are saving ₹{discountTotal} on this festive order.
              </div>
            )}
            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="w-full bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-burgundy-800 transition-colors">
                <span>Proceed to Checkout</span><ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => { clearCart(); toast.success('Cart cleared.'); }} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 rounded-lg text-xs font-medium transition-colors">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
