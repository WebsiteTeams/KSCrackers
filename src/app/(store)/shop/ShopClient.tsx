'use client';

import React, { useState, useMemo } from 'react';
import { IProduct } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/images';
import ProductCard from '@/components/ProductCard';
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw
} from 'lucide-react';

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
  // 1. Filtering & Sorting States
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('bestseller');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(initialFilter === 'offers');

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync states if initial values change (render-time adjustment)
  const [lastInitial, setLastInitial] = useState({
    category: initialCategory,
    search: initialSearch,
    filter: initialFilter,
  });
  if (
    lastInitial.category !== initialCategory ||
    lastInitial.search !== initialSearch ||
    lastInitial.filter !== initialFilter
  ) {
    setLastInitial({
      category: initialCategory,
      search: initialSearch,
      filter: initialFilter,
    });
    setCategory(initialCategory);
    setSearch(initialSearch);
    setOnlyOffers(initialFilter === 'offers');
    setSelectedMaxPrice(null);
  }

  // Determine the highest price dynamically to set slider max
  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 10000;
    return Math.max(...products.map(p => p.sellingPrice), 10000);
  }, [products]);

  const maxPrice = selectedMaxPrice ?? absoluteMaxPrice;

  // 2. Perform Dynamic Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    // Filter by Price
    result = result.filter((p) => p.sellingPrice <= maxPrice);

    // Filter by Availability (Stock)
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Filter by Campaign Offers
    if (onlyOffers) {
      result = result.filter((p) => p.isOffer || (p.mrp > p.sellingPrice));
    }

    // Apply Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.mrp - a.sellingPrice;
        const discB = b.mrp - b.sellingPrice;
        return discB - discA;
      });
    } else {
      // 'bestseller' (Default)
      result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

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

  return (
    <div className="space-y-8">
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
            ALL CRACKERS
          </h1>
          <p className="text-xs text-charcoal-400 mt-1 font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search our fireworks collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-gold-500 text-white placeholder-charcoal-500"
          />
          {search ? (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-charcoal-400 hover:text-white"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          ) : (
            <Search className="w-4.5 h-4.5 text-charcoal-500 absolute right-3.5 top-3" />
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-6 glass-card p-6 rounded-xl border border-white/5 sticky top-24">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="font-bold text-white tracking-wide text-sm uppercase flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
              Filter Tools
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-charcoal-400 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
              Category
            </h3>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setCategory('all')}
                className={`text-left text-sm py-1.5 px-2.5 rounded transition-all cursor-pointer ${
                  category === 'all'
                    ? 'bg-gold-500/10 text-gold-400 font-bold border-l-2 border-gold-500'
                    : 'text-charcoal-300 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`text-left text-sm py-1.5 px-2.5 rounded transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-gold-500/10 text-gold-400 font-bold border-l-2 border-gold-500'
                      : 'text-charcoal-300 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Filter */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                Max Price
              </h3>
              <span className="text-xs font-bold text-white">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max={absoluteMaxPrice}
              step="50"
              value={maxPrice}
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="w-full accent-gold-500 bg-charcoal-800 rounded-lg appearance-none h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 font-medium">
              <span>₹0</span>
              <span>₹{absoluteMaxPrice}</span>
            </div>
          </div>

          {/* 3. Offer & Stock Filters */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
              Preferences
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-charcoal-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-white/10 bg-charcoal-900 text-gold-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm text-charcoal-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyOffers}
                  onChange={(e) => setOnlyOffers(e.target.checked)}
                  className="rounded border-white/10 bg-charcoal-900 text-gold-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span>Active Offers & Savings</span>
              </label>
            </div>
          </div>

          {/* 4. Sort selection */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-gold-500 cursor-pointer"
            >
              <option value="bestseller">Popular & Bestselling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discounts</option>
            </select>
          </div>
        </aside>

        {/* MOBILE CONTROLS & PRODUCT LISTING */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile Filter buttons bar */}
          <div className="flex lg:hidden items-center justify-between gap-4 bg-charcoal-800/50 p-4 rounded-xl border border-white/5">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-gold-600/10 hover:bg-gold-600/20 text-gold-400 border border-gold-500/20 py-2 px-4 rounded-lg text-sm font-bold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-charcoal-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
            >
              <option value="bestseller">Bestselling</option>
              <option value="price-asc">Price: Low-High</option>
              <option value="price-desc">Price: High-Low</option>
              <option value="discount">Discounts</option>
            </select>
          </div>

          {/* Product grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="glass-card border border-white/5 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="bg-charcoal-800/50 p-6 rounded-full border border-white/5 mb-4 inline-flex">
                <Search className="w-12 h-12 text-charcoal-500 stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-bold text-white">No Crackers Found</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed font-medium">
                We couldn&apos;t find matches matching your filters. Try resetting preferences or expanding search criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-wider cursor-pointer hover:opacity-90"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER SIDEBAR OVERLAY */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop blur clickaway */}
          <div
            className="absolute inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Content panel */}
          <div className="relative w-80 bg-charcoal-900 border-l border-white/10 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="font-bold text-white tracking-wide text-base uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5 text-gold-500" />
                  Filter Options
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-charcoal-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Categories */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                  Categories
                </h3>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => { setCategory('all'); setMobileFiltersOpen(false); }}
                    className={`text-left text-sm py-1.5 px-2.5 rounded transition-all cursor-pointer ${
                      category === 'all'
                        ? 'bg-gold-500/10 text-gold-400 font-bold'
                        : 'text-charcoal-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategory(cat.id); setMobileFiltersOpen(false); }}
                      className={`text-left text-sm py-1.5 px-2.5 rounded transition-all cursor-pointer ${
                        category === cat.id
                          ? 'bg-gold-500/10 text-gold-400 font-bold'
                          : 'text-charcoal-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Slider */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                    Max Price
                  </h3>
                  <span className="text-xs font-bold text-white">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice}
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold-500 bg-charcoal-800 rounded-lg appearance-none h-1 cursor-pointer"
                />
              </div>

              {/* 3. Toggles */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest">
                  Preferences
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-sm text-charcoal-300">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-white/10 bg-charcoal-900 text-gold-500 w-4 h-4 cursor-pointer"
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-charcoal-300">
                    <input
                      type="checkbox"
                      checked={onlyOffers}
                      onChange={(e) => setOnlyOffers(e.target.checked)}
                      className="rounded border-white/10 bg-charcoal-900 text-gold-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Active Offers</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sticky Actions in drawer footer */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 bg-charcoal-900">
              <button
                onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }}
                className="bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-300 border border-white/5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer text-center"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
