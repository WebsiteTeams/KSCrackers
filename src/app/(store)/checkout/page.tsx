'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/lib/store';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MapPin, 
  Truck, 
  Store,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { toast } from 'sonner';

// Define Zod Validation Schema
const checkoutSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  mobile: z.string().regex(/^[5-9]\d{9}$/, 'Please enter a valid Indian 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(10, 'Address details must be at least 10 characters'),
  city: z.string().min(3, 'City name must be at least 3 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  deliveryType: z.enum(['Delivery', 'Pickup']),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    items, 
    clearCart,
    getCartTotal, 
    getOriginalTotal, 
    getDiscountTotal 
  } = useCartStore();

  const cartTotal = getCartTotal();
  const originalTotal = getOriginalTotal();
  const discountTotal = getDiscountTotal();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: 'Delivery',
      notes: '',
    },
  });

  const selectedDeliveryType = watch('deliveryType');

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Cannot place order.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Processing your festive order...');

    try {
      // 1. Prepare Order Payload
      const orderPayload = {
        customer: data,
        items: items.map((item) => ({
          productId: item.product._id!,
          name: item.product.name,
          price: item.product.sellingPrice,
          quantity: item.quantity,
          image: item.product.images[0] || '',
        })),
        subtotal: originalTotal,
        discount: discountTotal,
        total: cartTotal,
        paymentStatus: 'Pending',
        status: 'New',
      };

      // 2. Call local Route Handler to save order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save order in database');
      }

      const savedOrder = await response.json();
      const orderNumber = savedOrder.orderNumber;

      // 3. Clear cart store
      clearCart();

      // 4. Success notifications and route redirects
      toast.dismiss(toastId);
      toast.success('Order placed successfully!', {
        icon: <Sparkles className="w-4 h-4 text-gold-500" />,
      });

      // Delay redirect to let toast render
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${orderNumber}`);
      }, 1000);

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
        <div className="w-20 h-20 bg-charcoal-850 rounded-full flex items-center justify-center mx-auto border border-gold-500/10">
          <ShoppingBag className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="text-2xl font-bold text-white uppercase">Your Cart is Empty</h1>
        <p className="text-sm text-charcoal-400">Add items to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider">
          <span>Explore Shop</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="p-2 bg-charcoal-850 border border-white/5 text-charcoal-300 hover:text-white rounded-lg transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">CHECKOUT</h1>
          <p className="text-xs text-charcoal-400 mt-1 font-medium">Verify products and fill delivery information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Billing Shipping form */}
        <div className="lg:col-span-3 glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-gold-500" />
            Shipping Details
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Delivery / Pickup Tabs */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
              <button
                type="button"
                onClick={() => setValue('deliveryType', 'Delivery')}
                className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedDeliveryType === 'Delivery'
                    ? 'bg-gold-500/10 text-gold-500 border-gold-500 glow-gold'
                    : 'bg-charcoal-900 text-charcoal-400 border-white/10 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('deliveryType', 'Pickup')}
                className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedDeliveryType === 'Pickup'
                    ? 'bg-gold-500/10 text-gold-500 border-gold-500 glow-gold'
                    : 'bg-charcoal-900 text-charcoal-400 border-white/10 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store Pickup</span>
              </button>
            </div>

            {/* General Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('mobile')}
                  className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                    errors.mobile ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.mobile && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.mobile.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Email Address *</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                {selectedDeliveryType === 'Delivery' ? 'Delivery Address *' : 'Pickup Verification Address *'}
              </label>
              <input
                type="text"
                placeholder="House No, Street name, Area"
                {...register('address')}
                className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                  errors.address ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                }`}
              />
              {errors.address && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">City / Town *</label>
                <input
                  type="text"
                  placeholder="Sivakasi"
                  {...register('city')}
                  className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                    errors.city ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.city && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.city.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Pincode *</label>
                <input
                  type="text"
                  placeholder="626123"
                  {...register('pincode')}
                  className={`w-full bg-charcoal-900 border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 ${
                    errors.pincode ? 'border-red-500 focus:border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.pincode && <p className="text-red-400 text-xs mt-1 font-semibold">{errors.pincode.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Additional Notes / Specifications</label>
              <textarea
                rows={3}
                placeholder="Gift packing requests, delivery times, landmark specifications..."
                {...register('notes')}
                className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold py-4 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Processing Order...' : 'Confirm Order'}</span>
            </button>
          </form>
        </div>

        {/* Order Items sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-white/5 pb-4">
              <ClipboardList className="w-4.5 h-4.5 text-gold-500" />
              Order Items ({items.length})
            </h3>

            {/* Items list */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between items-center text-sm gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-white block truncate">{item.product.name}</span>
                    <span className="text-xs text-charcoal-400 font-medium">Qty: {item.quantity} x ₹{item.product.sellingPrice}</span>
                  </div>
                  <span className="font-bold text-white shrink-0">₹{item.product.sellingPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/5 pt-4 space-y-3.5 text-sm">
              <div className="flex justify-between text-charcoal-350 font-semibold">
                <span>Subtotal (MRP)</span>
                <span>₹{originalTotal}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Festive Discount Savings</span>
                  <span>-₹{discountTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-350 font-semibold">
                <span>Shipping Fee</span>
                <span className="text-green-400 font-bold uppercase text-[10px]">Free Delivery</span>
              </div>
              <div className="border-t border-white/5 pt-3.5 flex justify-between items-baseline font-bold">
                <span className="text-white text-base">Grand Total</span>
                <span className="text-xl text-gradient-gold">₹{cartTotal}</span>
              </div>
            </div>

            {/* Safety guidelines notice */}
            <div className="bg-charcoal-900/60 p-4 rounded-xl border border-white/5 space-y-2 text-xs text-charcoal-400 leading-relaxed font-semibold">
              <span className="text-gold-500 font-bold uppercase tracking-wider block">⚠️ Shipping Disclaimer:</span>
              <p>Firecracker consignments require specialized road-cargo transit. Direct shipping dates will be coordinated by our support team after processing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
