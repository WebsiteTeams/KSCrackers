'use client';

import React, { useState } from 'react';
import { IProduct } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/lib/store';
import { 
  ShoppingCart, 
  Flame, 
  Sparkles, 
  Check, 
  ShieldAlert, 
  Star, 
  ChevronUp, 
  ChevronDown,
  MessageSquare,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'info' | 'safety'>('desc');
  const addToCart = useCartStore((state) => state.addToCart);

  const discountPercent = product.mrp > product.sellingPrice
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} items ready for checkout.`,
      icon: <Sparkles className="w-4 h-4 text-gold-500" />,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  // Handled by Lucide Package icon now

  return (
    <div className="space-y-16">
      {/* Product Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Product Image Display */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5 relative aspect-square bg-charcoal-950 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-80 z-10" />

          {/* Fallback Premium Graphic */}
          <div className="absolute inset-0 bg-charcoal-800 flex items-center justify-center border border-white/5">
            <Package className="w-24 h-24 stroke-[1.5] text-charcoal-600" />
          </div>

          {/* Render image overlay */}
          {product.images && product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="absolute inset-0 w-full h-full object-cover z-10 opacity-95"
            />
          )}

          {/* Discount percentage tag */}
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-650 to-orange-650 text-white font-bold px-3 py-1 rounded-md text-xs shadow-md tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Right Side: Product Details info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2.5 pt-1">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-gold-500 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-charcoal-300">
                5.0 Rating (verified customer choice)
              </span>
            </div>
          </div>

          {/* Stock tags */}
          <div className="flex items-center gap-2">
            {product.stock <= 0 ? (
              <span className="bg-red-950/80 text-red-400 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="bg-orange-950/80 text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                Low Stock ({product.stock} units left)
              </span>
            ) : (
              <span className="bg-green-950/80 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">
                Available In Stock
              </span>
            )}
          </div>

          {/* Pricing Block */}
          <div className="glass-card p-5 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                ₹{product.sellingPrice}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-base text-charcoal-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            {product.mrp > product.sellingPrice && (
              <div className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-500/10 w-fit px-2 py-1 rounded border border-green-500/20">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>You save ₹{product.mrp - product.sellingPrice} ({discountPercent}% discount)</span>
              </div>
            )}
          </div>

          <p className="text-sm text-charcoal-350 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Cart actions and controls */}
          {product.stock > 0 ? (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                {/* Quantity adjustments */}
                <div className="flex items-center bg-charcoal-900 border border-white/10 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={decrementQty}
                    disabled={quantity <= 1}
                    className="p-3 text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-white px-4 min-w-[40px] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    disabled={quantity >= product.stock}
                    className="p-3 text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-grow flex items-center justify-center gap-2.5 rounded-lg py-3 px-6 text-sm font-bold tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                    added
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 hover:glow-gold hover:opacity-90'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>Added successfully</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4.5 h-4.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Contact Enquiry option */}
              <a
                href="mailto:support@kscrackers.com"
                className="w-full flex items-center justify-center gap-2 bg-charcoal-800 text-charcoal-300 font-bold py-3.5 rounded-lg text-sm uppercase tracking-wider hover:bg-charcoal-700 hover:text-white transition-colors border border-white/5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact support about product</span>
              </a>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <button
                disabled
                className="w-full bg-charcoal-800 text-charcoal-550 border border-white/5 py-3 rounded-lg text-sm font-bold uppercase cursor-not-allowed"
              >
                Out of Stock
              </button>
              <a
                href="mailto:support@kscrackers.com"
                className="w-full sm:w-auto px-8 flex items-center justify-center gap-2 bg-charcoal-800 text-charcoal-300 font-bold py-3.5 rounded-lg text-sm uppercase tracking-wider hover:bg-charcoal-700 hover:text-white transition-colors border border-white/5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire Availability</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-t border-white/5 pt-12 space-y-6">
        {/* Navigation buttons */}
        <div className="flex border-b border-white/5 overflow-x-auto">
          {[
            { id: 'desc', label: 'Product Description' },
            { id: 'info', label: 'Product Information' },
            { id: 'safety', label: 'Safety Guidelines' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-bold uppercase tracking-wider py-3.5 px-6 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-gold-500 text-gold-500 font-bold bg-gold-500/5'
                  : 'border-transparent text-charcoal-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content screens */}
        <div className="glass-card p-6 rounded-xl border border-white/5 min-h-[160px] text-sm text-charcoal-300 leading-relaxed font-medium">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p>Handcrafted under strict standards, our firecrackers provide premium color depth, high-rise sound outputs, and reliable ignition timers. We perform periodic testing at Sivakasi to deliver optimal celebration experiences.</p>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-charcoal-400 font-semibold">Origin</span>
                <span className="text-white font-bold">Sivakasi, India</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-charcoal-400 font-semibold">Grade</span>
                <span className="text-white font-bold">Premium Export Quality</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-charcoal-400 font-semibold">Category</span>
                <span className="text-white font-bold uppercase">{product.category.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-charcoal-400 font-semibold">Compliance</span>
                <span className="text-white font-bold">PESO Standard Certified</span>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-4 flex items-start gap-4">
              <ShieldAlert className="w-10 h-10 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base">Diwali Safe handling rules:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-charcoal-350">
                  <li>Store fireworks in a dry, cool area away from matches or electrical sources.</li>
                  <li>Light crackers outdoors in open areas, away from electrical cables or flammable substances.</li>
                  <li>Maintain a safe distance of at least 5 meters when lighting sparkles, flower pots, and ground wheels.</li>
                  <li>Children must operate fireworks under direct adult supervision at all times.</li>
                  <li>Keep a bucket of water or sand nearby for instant disposal of burnt sparklers.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-white/5">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            RELATED CRACKERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add To Cart Bar */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal-900 border-t border-white/10 p-3.5 flex items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xs text-charcoal-400">Total Price</span>
            <span className="text-lg font-extrabold text-white">₹{product.sellingPrice * quantity}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Simple mobile quantity view */}
            <div className="flex items-center bg-charcoal-800 rounded border border-white/10 shrink-0 text-xs">
              <button 
                onClick={decrementQty} 
                disabled={quantity <= 1} 
                className="p-1 px-2.5 text-charcoal-400 hover:text-white"
              >
                -
              </button>
              <span className="font-bold text-white w-4 text-center">{quantity}</span>
              <button 
                onClick={incrementQty} 
                disabled={quantity >= product.stock} 
                className="p-1 px-2.5 text-charcoal-400 hover:text-white"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
