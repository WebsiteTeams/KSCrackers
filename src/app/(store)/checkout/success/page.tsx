'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'UNKNOWN';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Icon Header */}
      <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto border border-gold-500/30">
        <CheckCircle2 className="w-12 h-12 text-gold-500" />
      </div>

      {/* Main Copy */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
          Order Placed Successfully
        </h1>
        <p className="text-charcoal-300 text-lg font-medium max-w-xl mx-auto">
          Thank you for choosing KS Crackers. Your festive celebration is safe with us!
        </p>
      </div>

      {/* Order Info Box */}
      <div className="glass-card bg-charcoal-900 border border-white/5 p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-charcoal-400 font-bold uppercase tracking-wider">Order Reference Number</p>
          <p className="text-2xl font-bold text-gold-500">{orderId}</p>
        </div>
        
        <div className="border-t border-white/5 pt-6 text-sm text-charcoal-300 space-y-4 leading-relaxed text-left">
          <h3 className="font-bold text-white uppercase tracking-wider">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold">1.</span>
              <span>Our support team is reviewing your order items for availability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold">2.</span>
              <span>You will receive an email or call within 24 hours to confirm payment details and dispatch timings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500 font-bold">3.</span>
              <span>Once payment is secured, your order will be shipped via specialized cargo.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/shop"
          className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-8 py-3.5 rounded-lg shadow-xl hover:opacity-95 transition-opacity text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto bg-charcoal-800 text-gold-500 border border-gold-500/30 hover:bg-gold-500/10 font-bold px-8 py-3.5 rounded-lg transition-all text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2"
        >
          <span>Return to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-gold-500">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
