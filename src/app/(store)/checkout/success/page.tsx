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
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Order Placed Successfully
        </h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto">
          Thank you for choosing KS Crackers. Your festive celebration is safe with us!
        </p>
      </div>

      <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm max-w-lg mx-auto space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Order Reference Number</p>
          <p className="text-2xl font-bold text-burgundy-700">{orderId}</p>
        </div>
        <div className="border-t border-stone-100 pt-6 text-sm text-stone-600 space-y-4 leading-relaxed text-left">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-burgundy-600 font-bold">1.</span>
              <span>Our support team is reviewing your order for availability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-burgundy-600 font-bold">2.</span>
              <span>You will receive an email or call within 24 hours to confirm payment and dispatch.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-burgundy-600 font-bold">3.</span>
              <span>Once payment is secured, your order ships via specialized cargo.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href="/shop" className="w-full sm:w-auto bg-burgundy-700 text-white font-semibold px-8 py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-burgundy-800 transition-colors">
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
        <Link href="/" className="w-full sm:w-auto bg-white text-stone-700 border border-stone-200 font-semibold px-8 py-3 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors">
          <span>Return to Home</span><ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-stone-500">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
