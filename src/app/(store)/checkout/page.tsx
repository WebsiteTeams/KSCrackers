'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/lib/store';
import { ArrowLeft, ShoppingBag, MapPin, Truck, Store, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  mobile: z.string().regex(/^[5-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(3, 'City must be at least 3 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  deliveryType: z.enum(['Delivery', 'Pickup']),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, getCartTotal, getOriginalTotal, getDiscountTotal } = useCartStore();
  const cartTotal = getCartTotal();
  const originalTotal = getOriginalTotal();
  const discountTotal = getDiscountTotal();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { deliveryType: 'Delivery', notes: '' },
  });

  const selectedDeliveryType = watch('deliveryType');

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) { toast.error('Your cart is empty.'); return; }
    setIsSubmitting(true);
    const toastId = toast.loading('Processing your order...');
    try {
      const orderPayload = {
        customer: data,
        items: items.map((item) => ({ productId: item.product._id!, name: item.product.name, price: item.product.sellingPrice, quantity: item.quantity, image: item.product.images?.[0]?.url ?? '' })),
        subtotal: originalTotal, discount: discountTotal, total: cartTotal, paymentStatus: 'Pending', status: 'New',
      };
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderPayload) });
      if (!response.ok) throw new Error('Failed to save order');
      const savedOrder = await response.json();
      clearCart();
      toast.dismiss(toastId);
      toast.success('Order placed successfully!');
      setTimeout(() => router.push(`/checkout/success?orderId=${savedOrder.orderNumber}`), 1000);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.dismiss(toastId);
      toast.error('Server error processing checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto"><ShoppingBag className="w-8 h-8 text-stone-400" /></div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Your Cart is Empty</h1>
        <p className="text-sm text-stone-500">Add items before proceeding to checkout.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-burgundy-700 text-white font-semibold px-8 py-3 rounded-lg text-sm">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="p-2 bg-white border border-stone-200 text-stone-500 hover:text-stone-900 rounded-lg transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Checkout</h1>
          <p className="text-sm text-stone-500 mt-1">Verify products and fill delivery information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 bg-white border border-stone-200 p-6 md:p-8 rounded-xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <MapPin className="w-4 h-4 text-burgundy-600" /> Shipping Details
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
              <button type="button" onClick={() => setValue('deliveryType', 'Delivery')}
                className={`py-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${selectedDeliveryType === 'Delivery' ? 'bg-burgundy-50 text-burgundy-700 border-burgundy-300' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}>
                <Truck className="w-4 h-4" /> Home Delivery
              </button>
              <button type="button" onClick={() => setValue('deliveryType', 'Pickup')}
                className={`py-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${selectedDeliveryType === 'Pickup' ? 'bg-burgundy-50 text-burgundy-700 border-burgundy-300' : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'}`}>
                <Store className="w-4 h-4" /> Store Pickup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Full Name *</label>
                <input type="text" placeholder="John Doe" {...register('name')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.name ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Mobile Number *</label>
                <input type="tel" placeholder="9876543210" {...register('mobile')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.mobile ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email Address *</label>
              <input type="email" placeholder="john@example.com" {...register('email')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.email ? 'border-red-500' : 'border-stone-200'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                {selectedDeliveryType === 'Delivery' ? 'Delivery Address *' : 'Pickup Verification Address *'}
              </label>
              <input type="text" placeholder="House No, Street, Area" {...register('address')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.address ? 'border-red-500' : 'border-stone-200'}`} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">City / Town *</label>
                <input type="text" placeholder="Sivakasi" {...register('city')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.city ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Pincode *</label>
                <input type="text" placeholder="626123" {...register('pincode')} className={`w-full bg-stone-50 border rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 ${errors.pincode ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Additional Notes</label>
              <textarea rows={3} placeholder="Gift packing requests, delivery times, landmark..." {...register('notes')} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 resize-none placeholder-stone-400" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-burgundy-700 text-white font-semibold py-4 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-burgundy-800 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              <ClipboardList className="w-4 h-4 text-burgundy-600" /> Order Items ({items.length})
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center text-sm gap-4">
                  <div className="min-w-0">
                    <span className="font-semibold text-stone-900 block truncate">{item.product.name}</span>
                    <span className="text-xs text-stone-500">Qty: {item.quantity} x ₹{item.product.sellingPrice}</span>
                  </div>
                  <span className="font-semibold text-stone-900 shrink-0">₹{item.product.sellingPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal (MRP)</span><span>₹{originalTotal}</span></div>
              {discountTotal > 0 && <div className="flex justify-between text-green-700 font-medium"><span>Festive Discount</span><span>-₹{discountTotal}</span></div>}
              <div className="flex justify-between text-stone-600"><span>Shipping Fee</span><span className="text-xs font-semibold text-green-700">Free Delivery</span></div>
              <div className="border-t border-stone-100 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-stone-900 text-base">Grand Total</span>
                <span className="text-xl text-burgundy-700">₹{cartTotal}</span>
              </div>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs text-stone-500 leading-relaxed">
              <span className="text-stone-700 font-semibold block mb-1">Shipping Disclaimer:</span>
              Firecracker consignments require specialized road-cargo transit. Shipping dates will be coordinated by our support team.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
