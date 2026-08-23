'use client';

import React, { useState, useMemo } from 'react';
import { IProduct } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/images';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, Search, X, RotateCcw } from 'lucide-react';

interface ShopClientProps {
  products: IProduct[];
  initialCategory: string;
  initialSearch: string;
  initialFilter: string;
}

export default function ShopClient({
  products,
  initialCategory,
  initialSearch,
  initialFilter,
}: ShopClientProps) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('bestseller');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(initialFilter === 'offers');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [lastInitial, setLastInitial] = useState({ category: initialCategory, search: initialSearch, filter: initialFilter });
  if (lastInitial.category !== initialCategory || lastInitial.search !== initialSearch || lastInitial.filter !== initialFilter) {
    setLastInitial({ category: initialCategory, search: initialSearch, filter: initialFilter });
    setCategory(initialCategory);
    setSearch(initialSearch);
    setOnlyOffers(initialFilter === 'offers');
    setSelectedMaxPrice(null);
  }

  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map(p => p.sellingPrice), 10000);
  }, [products]);

  const maxPrice = selectedMaxPrice ?? absoluteMaxPrice;

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (category !== 'all') result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.sellingPrice <= maxPrice);
    if (inStockOnly) result = result.filter((p) => p.stock > 0);
    if (onlyOffers) result = result.filter((p) => p.isOffer || (p.mrp > p.sellingPrice));

    if (sortBy === 'price-asc') result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    else result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    return result;
  }, [products, search, category, maxPrice, inStockOnly, onlyOffers, sortBy]);

  const handleResetFilters = () => {
    setCategory('all');
    setSearch('');
    setSelectedMaxPrice(null);
    setSortBy('bestseller');
    setInStockOnly(false);
    setOnlyOffers(false);
  };

  const FilterContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-burgundy-600" />
          Filters
        </span>
        <button onClick={() => { handleResetFilters(); onClose?.(); }} className="text-xs text-stone-500 hover:text-burgundy-700 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Category</h3>
        <div className="flex flex-col">
          <button onClick={() => { setCategory('all'); onClose?.(); }} className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${category === 'all' ? 'bg-burgundy-50 text-burgundy-700 font-semibold' : 'text-stone-600 hover:bg-stone-50'}`}>
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => { setCategory(cat.id); onClose?.(); }} className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${category === cat.id ? 'bg-burgundy-50 text-burgundy-700 font-semibold' : 'text-stone-600 hover:bg-stone-50'}`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <div className="flex justify-between items-baseline">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Max Price</h3>
          <span className="text-xs font-bold text-stone-900">₹{maxPrice}</span>
        </div>
        <input type="range" min="0" max={absoluteMaxPrice} step="50" value={maxPrice} onChange={(e) => setSelectedMaxPrice(Number(e.target.value))} className="w-full accent-burgundy-600 bg-stone-200 rounded-lg appearance-none h-1.5 cursor-pointer" />
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-4 border-t border-stone-100">
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Preferences</h3>
        <label className="flex items-center gap-2.5 text-sm text-stone-600 cursor-pointer select-none">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2.5 text-sm text-stone-600 cursor-pointer select-none">
          <input type="checkbox" checked={onlyOffers} onChange={(e) => setOnlyOffers(e.target.checked)} className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
          <span>Active Offers</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Shop</h1>
            <p className="text-sm text-stone-500 mt-1">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-4 pr-10 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
            {search ? (
              <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"><X className="w-4 h-4" /></button>
            ) : (
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block bg-white rounded-xl border border-stone-200 p-6 sticky top-24 shadow-sm">
            <FilterContent />
          </aside>

          {/* Products */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center justify-between gap-4">
              <button onClick={() => setMobileFiltersOpen(true)} className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-stone-50">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-stone-200 rounded-lg p-2.5 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500">
                <option value="bestseller">Bestselling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>No products found</h3>
                <p className="text-sm text-stone-500 mb-4">Try adjusting your filters or search terms.</p>
                <button onClick={handleResetFilters} className="bg-burgundy-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-burgundy-800 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative w-80 bg-white h-full p-6 flex flex-col shadow-xl">
            <div className="flex-1 overflow-y-auto">
              <FilterContent onClose={() => setMobileFiltersOpen(false)} />
            </div>
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }} className="bg-stone-100 text-stone-600 py-2.5 rounded-lg text-sm font-medium">
                Clear All
              </button>
              <button onClick={() => setMobileFiltersOpen(false)} className="bg-burgundy-700 text-white py-2.5 rounded-lg text-sm font-semibold">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
