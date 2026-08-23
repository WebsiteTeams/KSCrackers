'use client';

import React, { useState, useMemo } from 'react';
import { IProduct } from '@/lib/mockData';
import { Package, AlertTriangle, CheckCircle2, Search, Edit, TrendingDown, Save, X } from 'lucide-react';
import ProductImageView from '@/components/ProductImageView';
import { toast } from 'sonner';

interface InventoryClientProps {
  initialProducts: IProduct[];
}

type SortKey = 'name' | 'stock-asc' | 'stock-desc' | 'category';

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('stock-asc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  const CATEGORIES = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.stock > 5).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const totalUnits = products.reduce((s, p) => s + p.stock, 0);
    return { total, inStock, lowStock, outOfStock, totalUnits };
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.stock <= 5);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'stock-asc') result.sort((a, b) => a.stock - b.stock);
    else if (sortBy === 'stock-desc') result.sort((a, b) => b.stock - a.stock);
    else if (sortBy === 'category') result.sort((a, b) => a.category.localeCompare(b.category));

    return result;
  }, [products, search, categoryFilter, sortBy]);

  const handleUpdateStock = async (id: string, newStock: number) => {
    if (newStock < 0) { toast.error('Stock cannot be negative.'); return; }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
      setEditingId(null);
      toast.success('Stock updated.');
    } catch { toast.error('Error updating stock.'); }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">Out of Stock</span>;
    if (stock <= 5) return <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Low ({stock})</span>;
    if (stock <= 20) return <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{stock} units</span>;
    return <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">{stock} units</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Inventory</h1>
        <p className="text-sm text-stone-500 mt-0.5">Monitor stock levels and manage product inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total SKUs', value: stats.total, icon: Package, bg: 'bg-stone-50', iconBg: 'bg-stone-100', iconColor: 'text-stone-600', border: 'border-stone-200' },
          { label: 'Total Units', value: stats.totalUnits, icon: Package, bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', border: 'border-blue-200' },
          { label: 'In Stock', value: stats.inStock, icon: CheckCircle2, bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', border: 'border-green-200' },
          { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', border: 'border-amber-200' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: TrendingDown, bg: 'bg-red-50', iconBg: 'bg-red-100', iconColor: 'text-red-600', border: 'border-red-200' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`${card.bg} rounded-xl border ${card.border} p-4 flex items-center gap-3`}>
              <div className={`${card.iconBg} p-2.5 rounded-lg`}><Icon className={`w-5 h-5 ${card.iconColor}`} /></div>
              <div>
                <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block">{card.label}</span>
                <span className="text-xl font-bold text-stone-900">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input type="text" placeholder="Search by name or category..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="stock-asc">Stock: Low to High</option>
          <option value="stock-desc">Stock: High to Low</option>
          <option value="name">Name A-Z</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Low Stock Items ({filtered.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase tracking-wider font-medium">
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-right px-6 py-3">MRP</th>
                <th className="text-right px-6 py-3">Price</th>
                <th className="text-center px-6 py-3">Stock</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => (
                <tr key={p._id} className={`hover:bg-stone-50 transition-colors ${p.stock === 0 ? 'bg-red-50/30' : p.stock <= 5 ? 'bg-amber-50/20' : ''}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative bg-stone-50 rounded-lg overflow-hidden shrink-0 border border-stone-100">
                        <ProductImageView product={p} sizes="48px" fit="cover" compact />
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 text-sm block">{p.name}</span>
                        <span className="text-[10px] text-stone-400">{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-stone-600 capitalize">{p.category.replace('-', ' ')}</td>
                  <td className="px-6 py-3 text-right text-stone-500 text-xs">₹{p.mrp}</td>
                  <td className="px-6 py-3 text-right font-semibold text-stone-900 text-xs">₹{p.sellingPrice}</td>
                  <td className="px-6 py-3 text-center">
                    {editingId === p._id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input type="number" value={editStock} onChange={(e) => setEditStock(Number(e.target.value))} min={0}
                          className="w-20 bg-stone-50 border border-stone-200 rounded px-2 py-1 text-sm text-center text-stone-900 focus:outline-none focus:border-burgundy-500" autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateStock(p._id!, editStock); if (e.key === 'Escape') setEditingId(null); }} />
                      </div>
                    ) : (
                      <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : p.stock <= 5 ? 'text-amber-600' : 'text-stone-900'}`}>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">{getStockBadge(p.stock)}</td>
                  <td className="px-6 py-3 text-center">
                    {editingId === p._id ? (
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleUpdateStock(p._id!, editStock)} className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"><Save className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(p._id!); setEditStock(p.stock); }}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors" title="Edit stock">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400 text-sm">All products have sufficient stock (above 5 units).</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
