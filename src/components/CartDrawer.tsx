'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import ProductImageView from './ProductImageView';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const cartTotal = getCartTotal();

  const handleUpdateQty = (productId: string, qty: number, maxStock: number) => {
    if (qty > 0 && qty <= maxStock) {
      updateQuantity(productId, qty);
    } else if (qty <= 0) {
      removeFromCart(productId);
      toast.info('Item removed from cart');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900/40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-white border-l border-stone-200 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-burgundy-700" />
                <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                  Your Cart
                </h2>
              </div>
              <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors rounded-lg hover:bg-stone-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-10 h-10 text-stone-300" />
                  <p className="text-sm text-stone-500">Your cart is empty</p>
                  <button onClick={onClose} className="text-sm font-medium text-burgundy-700 hover:text-burgundy-800 transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-md overflow-hidden shrink-0 border border-stone-100 relative">
                        <ProductImageView product={item.product} sizes="64px" fit="cover" compact />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-semibold text-stone-900 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => { removeFromCart(item.product._id!); toast.info('Item removed'); }}
                            className="text-stone-300 hover:text-red-500 p-0.5 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center bg-white rounded border border-stone-200">
                            <button onClick={() => handleUpdateQty(item.product._id!, item.quantity - 1, item.product.stock)} className="p-1 text-stone-400 hover:text-stone-700">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold w-6 text-center text-stone-900">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.product._id!, item.quantity + 1, item.product.stock)} className="p-1 text-stone-400 hover:text-stone-700">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-stone-900">
                            ₹{item.product.sellingPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-stone-100 px-6 py-4 space-y-3 bg-stone-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-bold text-stone-900 text-lg">₹{cartTotal}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-sm hover:bg-burgundy-800 transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full block text-center py-2 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
