'use client';

import React, { useState } from 'react';
import { IProduct } from '@/lib/mockData';
import { resolveDisplayImages } from '@/lib/images';
import ProductCard from '@/components/ProductCard';
import ProductImageView from '@/components/ProductImageView';
import { useCartStore } from '@/lib/store';
import { ShoppingCart, Check, Star, ChevronUp, ChevronDown, ShieldAlert, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<'desc' | 'info' | 'safety' | null>('desc');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  const galleryImages = resolveDisplayImages(product);
  const discountPercent = product.mrp > product.sellingPrice ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const incrementQty = () => { if (quantity < product.stock) setQuantity((q) => q + 1); };
  const decrementQty = () => { if (quantity > 1) setQuantity((q) => q - 1); };

  const AccordionSection = ({ id, title, children }: { id: 'desc' | 'info' | 'safety'; title: string; children: React.ReactNode }) => (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
      <button onClick={() => setOpenSection(openSection === id ? null : id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors">
        <span className="text-sm font-semibold text-stone-900">{title}</span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openSection === id ? 'rotate-180' : ''}`} />
      </button>
      {openSection === id && (
        <div className="px-4 pb-4 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden relative aspect-square shadow-sm">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-20 bg-red-600 text-white font-bold px-3 py-1 rounded-md text-xs shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            <div className="absolute inset-0 p-6">
              <ProductImageView product={product} index={activeImageIndex} sizes="(max-width: 1024px) 100vw, 50vw" fit="contain" />
            </div>
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((image, idx) => (
                <button key={`${image.url}-${idx}`} onClick={() => setActiveImageIndex(idx)} aria-label={`View image ${idx + 1}`}
                  className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border transition-all ${activeImageIndex === idx ? 'border-burgundy-500 ring-2 ring-burgundy-500/20' : 'border-stone-200 hover:border-stone-300'}`}>
                  <ProductImageView product={product} index={idx} sizes="80px" fit="cover" compact />
                </button>
              ))}
            </div>
          )}
          {galleryImages.length === 0 && <p className="text-xs text-stone-400 text-center">Product photography coming soon</p>}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold block mb-1">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-copper-500 fill-current" />)}
              </div>
              <span className="text-xs text-stone-500">5.0 Verified</span>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock <= 0 ? (
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">Low Stock ({product.stock} left)</span>
            ) : (
              <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">In Stock</span>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-900">₹{product.sellingPrice}</span>
              {product.mrp > product.sellingPrice && <span className="text-base text-stone-400 line-through">₹{product.mrp}</span>}
            </div>
            {product.mrp > product.sellingPrice && (
              <div className="mt-2 text-xs text-green-700 font-semibold bg-green-50 w-fit px-2 py-1 rounded border border-green-200">
                You save ₹{product.mrp - product.sellingPrice} ({discountPercent}% off)
              </div>
            )}
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>

          {/* Actions */}
          {product.stock > 0 ? (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-stone-100 rounded-lg overflow-hidden shrink-0">
                  <button onClick={decrementQty} disabled={quantity <= 1} className="p-3 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors disabled:opacity-30" aria-label="Decrease quantity">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-stone-900 px-4 min-w-10 text-center">{quantity}</span>
                  <button onClick={incrementQty} disabled={quantity >= product.stock} className="p-3 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors disabled:opacity-30" aria-label="Increase quantity">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart}
                  className={`grow flex items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-semibold transition-colors ${added ? 'bg-green-600 text-white' : 'bg-burgundy-700 text-white hover:bg-burgundy-800'}`}>
                  {added ? <><Check className="w-4 h-4" /><span>Added!</span></> : <><ShoppingCart className="w-4 h-4" /><span>Add to Cart</span></>}
                </button>
              </div>
              <a href="mailto:support@kscrackers.com" className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-600 font-medium py-3 rounded-lg text-sm hover:bg-stone-200 transition-colors">
                <MessageSquare className="w-4 h-4" /> Contact support
              </a>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <button disabled className="w-full bg-stone-200 text-stone-400 py-3 rounded-lg text-sm font-semibold cursor-not-allowed">Out of Stock</button>
              <a href="mailto:support@kscrackers.com" className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-600 font-medium py-3 rounded-lg text-sm hover:bg-stone-200 transition-colors">
                <MessageSquare className="w-4 h-4" /> Enquire Availability
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        <AccordionSection id="desc" title="Product Description">
          <p>{product.description}</p>
          <p className="mt-3">Handcrafted under strict standards, our firecrackers provide premium color depth, high-rise sound outputs, and reliable ignition timers. We perform periodic testing at Sivakasi to deliver optimal celebration experiences.</p>
        </AccordionSection>
        <AccordionSection id="info" title="Product Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Origin', 'Sivakasi, India'],
              ['Grade', 'Premium Export Quality'],
              ['Category', product.category.replace('-', ' ')],
              ['Compliance', 'PESO Standard Certified'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">{label}</span>
                <span className="text-stone-900 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </AccordionSection>
        <AccordionSection id="safety" title="Safety Guidelines">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 mb-2">Safe handling rules:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Store fireworks in a dry, cool area away from matches or electrical sources.</li>
                <li>Light crackers outdoors in open areas, away from flammable substances.</li>
                <li>Maintain a safe distance of at least 5 meters when lighting sparklers and fountains.</li>
                <li>Children must operate fireworks under direct adult supervision.</li>
                <li>Keep a bucket of water or sand nearby for instant disposal of burnt sparklers.</li>
              </ul>
            </div>
          </div>
        </AccordionSection>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-stone-100">
          <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bar */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 p-3.5 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-xs text-stone-500 block">Total</span>
            <span className="text-lg font-bold text-stone-900">₹{product.sellingPrice * quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-stone-100 rounded border border-stone-200 text-xs">
              <button onClick={decrementQty} disabled={quantity <= 1} className="p-1 px-2.5 text-stone-500">-</button>
              <span className="font-semibold text-stone-900 w-4 text-center">{quantity}</span>
              <button onClick={incrementQty} disabled={quantity >= product.stock} className="p-1 px-2.5 text-stone-500">+</button>
            </div>
            <button onClick={handleAddToCart} className="bg-burgundy-700 text-white font-semibold px-4 py-2 rounded text-xs flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
