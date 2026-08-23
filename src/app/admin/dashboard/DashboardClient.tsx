'use client';

import React, { useState, useMemo } from 'react';
import { IProduct, IOrder } from '@/lib/mockData';
import { ProductImage } from '@/lib/images';
import {
  ClipboardList,
  AlertTriangle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
  DollarSign,
  Mail,
  Star,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Link2
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardClientProps {
  initialProducts: IProduct[];
  initialOrders: IOrder[];
}

export default function DashboardClient({
  initialProducts,
  initialOrders,
}: DashboardClientProps) {
  // 1. Data States
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  // 2. Modals and Forms States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [brokenPreviewUrls, setBrokenPreviewUrls] = useState<Record<number, boolean>>({});

  // Product Form states
  const emptyProdForm = {
    name: '',
    description: '',
    category: 'sparklers',
    mrp: 0,
    sellingPrice: 0,
    stock: 0,
    images: [] as ProductImage[],
    featured: false,
    bestSeller: false,
    isOffer: false,
    isActive: true,
  };
  const [prodForm, setProdForm] = useState(emptyProdForm);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // 3. Overview Statistics
  const stats = useMemo(() => {
    const totalProd = products.length;
    const totalOrd = orders.length;
    
    // Pending: New, Confirmed, Processing, Ready
    const pendingOrd = orders.filter((o) =>
      ['New', 'Confirmed', 'Processing', 'Ready'].includes(o.status)
    ).length;

    const completedOrd = orders.filter((o) => o.status === 'Completed').length;
    const lowStock = products.filter((p) => p.stock <= 5).length;

    // Today's orders count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayOrd = orders.filter((o) => {
      if (!o.createdAt) return false;
      const createdDate = new Date(o.createdAt);
      return createdDate >= startOfToday;
    }).length;

    // Financial Metrics
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return { totalProd, totalOrd, pendingOrd, completedOrd, lowStock, todayOrd, totalRevenue };
  }, [products, orders]);

  // 4. Product actions
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdForm({ ...emptyProdForm, stock: 50 });
    setImageUrlInput('');
    setBrokenPreviewUrls({});
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: IProduct) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      description: product.description,
      category: product.category,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      stock: product.stock,
      images: (product.images || []).map((img) => ({ ...img })),
      featured: product.featured,
      bestSeller: product.bestSeller,
      isOffer: product.isOffer,
      isActive: product.isActive !== false,
    });
    setImageUrlInput('');
    setBrokenPreviewUrls({});
    setProductModalOpen(true);
  };

  // Image manager helpers
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (prodForm.images.some((img) => img.url === url)) {
      toast.error('This image is already added to the gallery.');
      return;
    }
    setProdForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url, alt: `${prev.name || 'Product'} cracker photo`.trim(), isPrimary: prev.images.length === 0 },
      ],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setProdForm((prev) => {
      const next = prev.images.filter((_, idx) => idx !== index).map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
      }));
      return { ...prev, images: next };
    });
    setBrokenPreviewUrls((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      });
      return next;
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setProdForm((prev) => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.images.length) return prev;
      const next = [...prev.images];
      [next[index], next[target]] = [next[target], next[index]];
      return {
        ...prev,
        images: next.map((img, idx) => ({ ...img, isPrimary: idx === 0 })),
      };
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setProdForm((prev) => ({
      ...prev,
      images: [...prev.images].map((img, idx) => ({ ...img, isPrimary: idx === index })).sort(
        (a, b) => Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false)
      ),
    }));
  };

  const handleImageAltChange = (index: number, alt: string) => {
    setProdForm((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => (idx === index ? { ...img, alt } : img)),
    }));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodForm.name || !prodForm.description || prodForm.sellingPrice <= 0) {
      toast.error('Please enter product name, details, and price.');
      return;
    }

    const payload = {
      ...prodForm,
      mrp: prodForm.mrp || prodForm.sellingPrice,
      images: prodForm.images,
    };

    const isEdit = editingProduct !== null;
    const url = isEdit ? `/api/products/${editingProduct?._id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Server error (${res.status})`);
      }

      const savedProduct = await res.json();

      if (isEdit) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct?._id ? savedProduct : p))
        );
        toast.success('Product updated successfully.');
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        toast.success('Product created successfully.');
      }

      setProductModalOpen(false);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error saving product records.';
      toast.error(msg);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product.');
    }
  };

  // 5. Order actions
  const handleOrderStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Update failed (${res.status})`);
      }

      const updatedOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
      
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updatedOrder);
      }
      
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to update order status';
      toast.error(msg);
    }
  };

  const handleOrderPaymentStatusUpdate = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Update failed (${res.status})`);
      }

      const updatedOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
      
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updatedOrder);
      }
      
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to update payment status';
      toast.error(msg);
    }
  };

  const openOrderDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  // Removed handleWhatsAppContact

  return (
    <div className="space-y-8">
      {/* Navigation tabs */}
      <div className="flex border-b border-stone-200 space-x-6">
        {[
          { id: 'overview' as const, label: 'Overview', count: null },
          { id: 'products' as const, label: 'Products', count: products.length },
          { id: 'orders' as const, label: 'Orders', count: orders.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-semibold py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-burgundy-600 text-burgundy-700'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Revenue', val: `₹${stats.totalRevenue}`, icon: <DollarSign className="w-5 h-5 text-green-600" />, bg: 'bg-green-50 border-green-200' },
              { title: 'Active Orders', val: stats.pendingOrd, icon: <ClipboardList className="w-5 h-5 text-burgundy-600" />, bg: 'bg-burgundy-50 border-burgundy-200' },
              { title: 'Low Stock', val: stats.lowStock, icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-200' },
              { title: "Today's Orders", val: stats.todayOrd, icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 border-blue-200' },
            ].map((card, idx) => (
              <div key={idx} className={`p-5 rounded-xl border flex items-center justify-between shadow-sm ${card.bg}`}>
                <div className="space-y-1">
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">{card.title}</span>
                  <span className="text-2xl font-bold text-stone-900 block">{card.val}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/60">{card.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Recent Orders</h3>
              <div className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-stone-900">{order.orderNumber}</span>
                      <span className="text-stone-500 block text-xs mt-0.5">{order.customer.name} ({order.customer.city})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-stone-900 block">₹{order.total}</span>
                      <span className="text-[10px] uppercase font-semibold text-burgundy-600 mt-0.5 block">{order.status}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-xs text-stone-400 py-4 text-center">No orders yet.</p>}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Low Stock Alerts</h3>
              <div className="divide-y divide-stone-100">
                {products.filter((p) => p.stock <= 5).slice(0, 5).map((product) => (
                  <div key={product._id} className="py-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-stone-900 truncate max-w-xs">{product.name}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-xs ${product.stock === 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
                {products.filter((p) => p.stock <= 5).length === 0 && <p className="text-xs text-green-600 py-4 text-center">All products have sufficient stock.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Product Catalog</h2>
            <button onClick={openAddProductModal} className="bg-burgundy-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 hover:bg-burgundy-800 transition-colors">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium uppercase tracking-wider text-[10px]">
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">MRP</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 text-center">Tags</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-stone-900 block">{p.name}</span>
                      <span className="text-[10px] text-stone-400 block">{p.slug}</span>
                    </td>
                    <td className="p-4 uppercase text-xs text-burgundy-600 font-medium">{p.category.replace('-', ' ')}</td>
                    <td className="p-4 text-right text-stone-600">₹{p.mrp}</td>
                    <td className="p-4 text-right font-semibold text-stone-900">₹{p.sellingPrice}</td>
                    <td className="p-4 text-right">
                      <span className={`font-semibold ${p.stock <= 5 ? 'text-amber-600' : 'text-stone-700'}`}>{p.stock}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {p.featured && <span className="bg-burgundy-50 text-burgundy-700 border border-burgundy-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">Featured</span>}
                        {p.bestSeller && <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">Best</span>}
                        {p.isOffer && <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-semibold px-1.5 py-0.5 rounded">Offer</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditProductModal(p)} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded transition-colors" aria-label="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(p._id!, p.name)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Orders</h2>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium uppercase tracking-wider text-[10px]">
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Delivery</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Payment</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-semibold text-stone-900">{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold text-stone-900 block">{o.customer.name}</span>
                      <span className="text-[10px] text-stone-500 block">{o.customer.mobile} ({o.customer.city})</span>
                    </td>
                    <td className="p-4 text-xs text-stone-600">{o.customer.deliveryType}</td>
                    <td className="p-4 text-right font-semibold text-stone-900">₹{o.total}</td>
                    <td className="p-4 text-center">
                      <select value={o.status} onChange={(e) => handleOrderStatusUpdate(o._id!, e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer font-medium uppercase">
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <select value={o.paymentStatus} onChange={(e) => handleOrderPaymentStatusUpdate(o._id!, e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-xs text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer font-medium uppercase">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => openOrderDetails(o)} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded transition-colors" aria-label="View"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-xs text-stone-400">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setProductModalOpen(false)} />
          <div className="relative bg-white border border-stone-200 max-w-xl w-full p-6 md:p-8 rounded-xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Product Name</label>
                <input type="text" placeholder="e.g. 1000 Wala" value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Description</label>
                <textarea rows={3} placeholder="Product details..." value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Category</label>
                  <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 cursor-pointer">
                    <option value="sparklers">Sparklers</option>
                    <option value="flower-pots">Flower Pots</option>
                    <option value="rockets">Rockets</option>
                    <option value="ground-chakkars">Ground Chakkars</option>
                    <option value="fountains">Fountains</option>
                    <option value="gift-boxes">Gift Boxes</option>
                    <option value="kids-special">Kids Special</option>
                    <option value="combos">Combo Packs</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Stock</label>
                  <input type="number" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">MRP (₹)</label>
                  <input type="number" value={prodForm.mrp} onChange={(e) => setProdForm({ ...prodForm, mrp: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Selling Price (₹)</label>
                  <input type="number" value={prodForm.sellingPrice} onChange={(e) => setProdForm({ ...prodForm, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-burgundy-600" /> Images ({prodForm.images.length})
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Link2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="/images/products/... or https://..." value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-9 pr-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400" />
                  </div>
                  <button type="button" onClick={handleAddImageUrl} className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 rounded-lg text-xs font-medium transition-colors shrink-0">Add</button>
                </div>

                {prodForm.images.length > 0 && (
                  <div className="space-y-2">
                    {prodForm.images.map((img, index) => (
                      <div key={`${img.url}-${index}`} className={`flex items-center gap-3 bg-stone-50 border rounded-lg p-2.5 ${img.isPrimary ? 'border-burgundy-300' : 'border-stone-200'}`}>
                        <div className="w-14 h-14 relative bg-stone-100 rounded-md overflow-hidden shrink-0">
                          {!brokenPreviewUrls[index] ? (
                            <img src={img.url} alt={img.alt || `Preview ${index + 1}`} onError={() => setBrokenPreviewUrls((prev) => ({ ...prev, [index]: true }))}
                              onLoad={() => setBrokenPreviewUrls((prev) => { if (!prev[index]) return prev; const next = { ...prev }; delete next[index]; return next; })}
                              className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-100"><ImageIcon className="w-5 h-5 text-stone-400" /></div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0 space-y-1.5">
                          <input type="text" value={img.alt} onChange={(e) => handleImageAltChange(index, e.target.value)} placeholder="Alt text"
                            className="w-full bg-white border border-stone-200 rounded px-2 py-1 text-xs text-stone-900 focus:outline-none focus:border-burgundy-500 placeholder-stone-400" />
                          <span className="block text-[10px] text-stone-400 truncate">{img.url}</span>
                          {brokenPreviewUrls[index] && <span className="block text-[10px] text-red-500 font-medium">File not found</span>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {img.isPrimary ? (
                            <span className="bg-burgundy-50 text-burgundy-700 text-[8px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> Primary</span>
                          ) : (
                            <button type="button" onClick={() => handleSetPrimaryImage(index)} className="p-1.5 text-stone-400 hover:text-burgundy-600"><Star className="w-3.5 h-3.5" /></button>
                          )}
                          <button type="button" onClick={() => handleMoveImage(index, 'up')} disabled={index === 0} className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleMoveImage(index, 'down')} disabled={index === prodForm.images.length - 1} className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => handleRemoveImage(index)} className="p-1.5 text-stone-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                {[
                  { key: 'featured', label: 'Featured' },
                  { key: 'bestSeller', label: 'Bestseller' },
                  { key: 'isOffer', label: 'Campaign Offer' },
                  { key: 'isActive', label: 'Active Listing' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                    <input type="checkbox" checked={prodForm[key as keyof typeof prodForm] as boolean}
                      onChange={(e) => setProdForm({ ...prodForm, [key]: e.target.checked })}
                      className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-100 flex gap-4">
                <button type="button" onClick={() => setProductModalOpen(false)} className="w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-600 py-3 rounded-lg text-xs font-medium">Cancel</button>
                <button type="submit" className="w-1/2 bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-burgundy-800 transition-colors">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW ORDER DETAILS */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setOrderModalOpen(false)} />
          <div className="relative bg-white border border-stone-200 max-w-2xl w-full p-6 md:p-8 rounded-xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Order {selectedOrder.orderNumber}</h3>
                <span className="text-xs text-stone-500 block mt-0.5">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <button onClick={() => setOrderModalOpen(false)} className="text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="font-semibold text-burgundy-700 uppercase tracking-wider text-xs">Customer</h4>
                <div className="space-y-2 text-stone-600">
                  <p><span className="text-stone-500 font-medium block text-xs">Name</span> <strong className="text-stone-900">{selectedOrder.customer.name}</strong></p>
                  <p><span className="text-stone-500 font-medium block text-xs">Mobile</span> <strong className="text-stone-900">{selectedOrder.customer.mobile}</strong></p>
                  <p><span className="text-stone-500 font-medium block text-xs">Email</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-stone-500 font-medium block text-xs">Delivery</span> {selectedOrder.customer.deliveryType}</p>
                  <p><span className="text-stone-500 font-medium block text-xs">Address</span> {selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.pincode}</p>
                  {selectedOrder.customer.notes && <p><span className="text-stone-500 font-medium block text-xs">Notes</span> {selectedOrder.customer.notes}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-burgundy-700 uppercase tracking-wider text-xs">Items</h4>
                <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-2 space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs gap-4">
                      <div>
                        <span className="font-semibold text-stone-900 block">{item.name}</span>
                        <span className="text-stone-500">Qty: {item.quantity} x ₹{item.price}</span>
                      </div>
                      <span className="font-semibold text-stone-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2 text-xs border-b border-stone-100 pb-4">
                  <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{selectedOrder.subtotal}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{selectedOrder.discount}</span></div>}
                  <div className="flex justify-between items-baseline font-bold text-sm text-stone-900 pt-1">
                    <span>Total</span><span className="text-burgundy-700 text-base">₹{selectedOrder.total}</span>
                  </div>
                </div>

                <a href={`mailto:${selectedOrder.customer.email}`} className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2.5 rounded-lg text-xs transition-colors">
                  <Mail className="w-4 h-4" /> Email Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
