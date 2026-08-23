'use client';

import React, { useState, useMemo, useRef } from 'react';
import { IProduct } from '@/lib/mockData';
import { ProductImage } from '@/lib/images';
import {
  Plus, Search, Edit, Trash2, Grid3X3, List,
  ChevronRight, ChevronLeft, Save, X, ImageIcon, Upload, Loader2,
} from 'lucide-react';

const PAGE_SIZE = 10;
import { toast } from 'sonner';
import ProductImageView from '@/components/ProductImageView';

interface ProductsClientProps {
  initialProducts: IProduct[];
}

type ViewMode = 'grid' | 'table';
type WizardStep = 1 | 2 | 3 | 4 | 5;

const CATEGORIES = ['sparklers', 'flower-pots', 'rockets', 'ground-chakkars', 'fountains', 'gift-boxes', 'kids-special', 'combos'];

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyForm = { name: '', description: '', category: 'sparklers', mrp: 0, sellingPrice: 0, stock: 50, images: [] as ProductImage[], featured: false, bestSeller: false, isOffer: false, isActive: true };
  const [form, setForm] = useState(emptyForm);

  React.useEffect(() => { setPage(1); }, [search, categoryFilter, stockFilter]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') result = result.filter((p) => p.category === categoryFilter);
    if (stockFilter === 'low') result = result.filter((p) => p.stock > 0 && p.stock <= 5);
    else if (stockFilter === 'out') result = result.filter((p) => p.stock === 0);
    else if (stockFilter === 'in') result = result.filter((p) => p.stock > 5);
    return result;
  }, [products, search, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setWizardStep(1);
    setModalOpen(true);
  };

  const openEdit = (p: IProduct) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description, category: p.category, mrp: p.mrp, sellingPrice: p.sellingPrice,
      stock: p.stock, images: (p.images || []).map((img) => ({ ...img })),
      featured: p.featured, bestSeller: p.bestSeller, isOffer: p.isOffer, isActive: p.isActive !== false,
    });
    setWizardStep(1);
    setModalOpen(true);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', form.category);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) { const err = await res.json().catch(() => null); throw new Error(err?.error || 'Upload failed'); }
      const data = await res.json();
      return data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      return null;
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadFile(file);
      if (url) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, { url, alt: `${prev.name || 'Product'} photo`, isPrimary: prev.images.length === 0 }],
        }));
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, isPrimary: i === 0 })) }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || form.sellingPrice <= 0) { toast.error('Please fill required fields.'); return; }
    const payload = { ...form, mrp: form.mrp || form.sellingPrice };
    const isEdit = editingProduct !== null;
    const url = isEdit ? `/api/products/${editingProduct?._id}` : '/api/products';
    try {
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json().catch(() => null); throw new Error(err?.error || 'Failed'); }
      const saved = await res.json();
      setProducts((prev) => isEdit ? prev.map((p) => (p._id === editingProduct?._id ? saved : p)) : [saved, ...prev]);
      toast.success(isEdit ? 'Product updated.' : 'Product created.');
      setModalOpen(false);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'Error saving product.'); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted.');
    } catch { toast.error('Error deleting product.'); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const discount = form.mrp > form.sellingPrice ? Math.round(((form.mrp - form.sellingPrice) / form.mrp) * 100) : 0;
  const wizardSteps = ['Basic Info', 'Pricing', 'Images', 'Tags', 'Review'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Products</h1>
          <p className="text-sm text-stone-500 mt-0.5">{filtered.length} products in catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-burgundy-700 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'}`}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-burgundy-700 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'}`}><List className="w-4 h-4" /></button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-burgundy-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((p) => (
            <div key={p._id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative aspect-square bg-stone-50">
                <ProductImageView product={p} sizes="300px" fit="contain" compact />
                <div className="absolute top-2 left-2 flex gap-1">
                  {p.featured && <span className="bg-burgundy-100 text-burgundy-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">Featured</span>}
                  {p.isOffer && <span className="bg-red-100 text-red-600 text-[9px] font-semibold px-1.5 py-0.5 rounded">Offer</span>}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white text-stone-600"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p._id!, p.name)} className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-semibold text-stone-900 truncate">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 capitalize">{p.category.replace('-', ' ')}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-50 text-red-600' : p.stock <= 5 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                    {p.stock} units
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-stone-900">₹{p.sellingPrice}</span>
                  {p.mrp > p.sellingPrice && <span className="text-xs text-stone-400 line-through">₹{p.mrp}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase tracking-wider font-medium">
                  <th className="text-left px-6 py-3">Product</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-right px-6 py-3">MRP</th>
                  <th className="text-right px-6 py-3">Price</th>
                  <th className="text-right px-6 py-3">Stock</th>
                  <th className="text-center px-6 py-3">Tags</th>
                  <th className="text-center px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
          {paginated.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-50 rounded-lg overflow-hidden shrink-0 border border-stone-100"><ProductImageView product={p} sizes="40px" fit="cover" compact /></div>
                        <span className="font-semibold text-stone-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-stone-600 capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="px-6 py-3 text-right text-stone-600">₹{p.mrp}</td>
                    <td className="px-6 py-3 text-right font-semibold text-stone-900">₹{p.sellingPrice}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`font-semibold text-xs ${p.stock <= 5 ? 'text-amber-600' : 'text-stone-700'}`}>{p.stock}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {p.featured && <span className="bg-burgundy-50 text-burgundy-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">Feat</span>}
                        {p.bestSeller && <span className="bg-blue-50 text-blue-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">Best</span>}
                        {p.isOffer && <span className="bg-red-50 text-red-600 text-[9px] font-semibold px-1.5 py-0.5 rounded">Offer</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(p)} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(p._id!, p.name)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-burgundy-700 text-white' : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Multi-Step Wizard Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white border border-stone-200 max-w-xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2">
                {wizardSteps.map((step, i) => (
                  <React.Fragment key={step}>
                    <button onClick={() => setWizardStep((i + 1) as WizardStep)}
                      className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors ${wizardStep === i + 1 ? 'text-burgundy-700' : wizardStep > i + 1 ? 'text-green-600' : 'text-stone-400'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${wizardStep === i + 1 ? 'bg-burgundy-100 text-burgundy-700' : wizardStep > i + 1 ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
                        {wizardStep > i + 1 ? '✓' : i + 1}
                      </span>
                      <span className="hidden sm:inline">{step}</span>
                    </button>
                    {i < wizardSteps.length - 1 && <div className={`flex-1 h-0.5 ${wizardStep > i + 1 ? 'bg-green-200' : 'bg-stone-200'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6 space-y-4">
              {wizardStep === 1 && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Product Name *</label>
                    <input type="text" placeholder="e.g. 1000 Wala" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Description *</label>
                    <textarea rows={3} placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400 resize-none" />
                    <span className="text-[10px] text-stone-400">{form.description.length}/300 characters</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 cursor-pointer">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}
                    </select>
                  </div>
                </>
              )}

              {wizardStep === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">MRP (₹)</label>
                      <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Selling Price (₹) *</label>
                      <input type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                    </div>
                  </div>
                  {discount > 0 && <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-xs font-medium">Discount: {discount}% off (you save ₹{form.mrp - form.sellingPrice})</div>}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Stock Quantity</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                  </div>
                </>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-burgundy-600" /> Product Images ({form.images.length})
                  </label>

                  {/* Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-burgundy-500 bg-burgundy-50' : 'border-stone-200 hover:border-stone-300 bg-stone-50'}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-burgundy-600 animate-spin" />
                        <span className="text-sm text-stone-500">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-stone-400" />
                        <div>
                          <span className="text-sm font-medium text-stone-700">Click to upload or drag and drop</span>
                          <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP, GIF, SVG (max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Images */}
                  {form.images.length > 0 && (
                    <div className="space-y-2">
                      {form.images.map((img, i) => (
                        <div key={i} className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-lg p-2.5">
                          <div className="w-12 h-12 relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input type="text" value={img.alt} onChange={(e) => {
                              const imgs = [...form.images]; imgs[i] = { ...imgs[i], alt: e.target.value }; setForm({ ...form, images: imgs });
                            }} className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs text-stone-900 focus:outline-none focus:border-burgundy-500" placeholder="Alt text" />
                            <span className="text-[10px] text-stone-400 truncate block mt-1">{img.url.split('/').pop()}</span>
                          </div>
                          <button onClick={() => handleRemoveImage(i)} className="p-1 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 4 && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'featured', label: 'Featured Product' },
                    { key: 'bestSeller', label: 'Bestseller' },
                    { key: 'isOffer', label: 'Campaign Offer' },
                    { key: 'isActive', label: 'Active Listing' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 text-sm text-stone-600 cursor-pointer p-3 bg-stone-50 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors">
                      <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                        className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-stone-500">Name:</span><span className="font-semibold text-stone-900">{form.name || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Category:</span><span className="text-stone-900 capitalize">{form.category.replace('-', ' ')}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Price:</span><span className="font-semibold text-stone-900">₹{form.sellingPrice} {discount > 0 && <span className="text-green-600 text-xs">({discount}% off)</span>}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Stock:</span><span className="text-stone-900">{form.stock} units</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Images:</span><span className="text-stone-900">{form.images.length}</span></div>
                    <div className="flex gap-2">
                      {form.featured && <span className="bg-burgundy-50 text-burgundy-700 text-[10px] font-semibold px-2 py-0.5 rounded">Featured</span>}
                      {form.bestSeller && <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded">Bestseller</span>}
                      {form.isOffer && <span className="bg-red-50 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded">Offer</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-stone-100">
              <button onClick={() => setWizardStep((Math.max(1, wizardStep - 1)) as WizardStep)} disabled={wizardStep === 1}
                className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-3">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">Cancel</button>
                {wizardStep < 5 ? (
                  <button onClick={() => setWizardStep((wizardStep + 1) as WizardStep)}
                    className="flex items-center gap-1 bg-burgundy-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition-colors">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit}
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                    <Save className="w-4 h-4" /> {editingProduct ? 'Update' : 'Publish'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
