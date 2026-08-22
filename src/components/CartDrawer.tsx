'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-charcoal-900 border-l border-white/5 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-charcoal-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
                  <ShoppingBag className="w-12 h-12 text-charcoal-500" />
                  <p className="text-sm font-medium text-charcoal-300">Your cart is empty.</p>
                  <button
                    onClick={onClose}
                    className="text-gold-500 font-bold text-sm tracking-wide hover:underline cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-charcoal-800 rounded-lg overflow-hidden shrink-0 border border-white/5 relative">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-charcoal-800 text-charcoal-600">
                            <Package className="w-8 h-8 stroke-[1.5]" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-white line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => {
                              removeFromCart(item.product._id!);
                              toast.info('Item removed from cart');
                            }}
                            className="text-charcoal-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Controls */}
                          <div className="flex items-center bg-charcoal-800 rounded-md border border-white/10">
                            <button
                              onClick={() => handleUpdateQty(item.product._id!, item.quantity - 1, item.product.stock)}
                              className="p-1.5 text-charcoal-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center text-white select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.product._id!, item.quantity + 1, item.product.stock)}
                              className="p-1.5 text-charcoal-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-white text-sm">
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
              <div className="border-t border-white/5 p-6 bg-charcoal-900/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-charcoal-300 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-white">₹{cartTotal}</span>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold py-3.5 rounded-lg text-sm uppercase tracking-wider hover:opacity-95 transition-opacity"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full block text-center py-2 text-xs font-bold text-charcoal-400 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    View Cart Page
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
