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
      mrp: prodForm.mrp || prodForm.sellingPrice, // mrp equals selling price if empty
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

      if (!res.ok) throw new Error('Action failed');

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
      toast.error('Error saving product records.');
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

      if (!res.ok) throw new Error('Update failed');

      const updatedOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
      
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updatedOrder);
      }
      
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order status');
    }
  };

  const handleOrderPaymentStatusUpdate = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));
      
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(updatedOrder);
      }
      
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update payment status');
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
      <div className="flex border-b border-white/5 space-x-6">
        {[
          { id: 'overview' as const, label: 'Management Overview', count: null },
          { id: 'products' as const, label: 'Product Catalog', count: products.length },
          { id: 'orders' as const, label: 'Orders Queue', count: orders.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm font-bold uppercase tracking-wider py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-gold-500 text-gold-500 font-bold'
                : 'border-transparent text-charcoal-400 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 text-[10px] bg-charcoal-800 text-charcoal-350 px-1.5 py-0.5 rounded font-bold border border-white/5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Dashboard Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Revenue',
                val: `₹${stats.totalRevenue}`,
                icon: <DollarSign className="w-5 h-5 text-green-400" />,
                bg: 'bg-green-500/10 border-green-500/25',
              },
              {
                title: 'Active Orders',
                val: stats.pendingOrd,
                icon: <ClipboardList className="w-5 h-5 text-gold-500" />,
                bg: 'bg-gold-500/10 border-gold-500/25',
              },
              {
                title: 'Low Stock Items',
                val: stats.lowStock,
                icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
                bg: 'bg-orange-500/10 border-orange-500/25',
              },
              {
                title: "Today's Orders",
                val: stats.todayOrd,
                icon: <Calendar className="w-5 h-5 text-blue-500" />,
                bg: 'bg-blue-500/10 border-blue-500/25',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`glass-card p-6 rounded-xl border flex items-center justify-between shadow-md ${card.bg}`}
              >
                <div className="space-y-1">
                  <span className="text-xs text-charcoal-400 uppercase tracking-wider font-bold">
                    {card.title}
                  </span>
                  <span className="text-2xl font-extrabold text-white block">
                    {card.val}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-charcoal-900 border border-white/5">
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders Summary Panel */}
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-4 shadow">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Recent Activity Orders
              </h3>
              <div className="divide-y divide-white/5">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-white">{order.orderNumber}</span>
                      <span className="text-charcoal-400 block text-[10px] mt-0.5">
                        {order.customer.name} ({order.customer.city})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">₹{order.total}</span>
                      <span className="text-[10px] uppercase font-bold text-gold-400 mt-0.5 block">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-xs text-charcoal-450 py-4 text-center">No orders registered yet.</p>
                )}
              </div>
            </div>

            {/* Inventory Alerts Panel */}
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-4 shadow">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Low Inventory Alerts
              </h3>
              <div className="divide-y divide-white/5">
                {products
                  .filter((p) => p.stock <= 5)
                  .slice(0, 5)
                  .map((product) => (
                    <div key={product._id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-white truncate max-w-xs">{product.name}</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        product.stock === 0 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {product.stock} left in stock
                      </span>
                    </div>
                  ))}
                {products.filter((p) => p.stock <= 5).length === 0 && (
                  <p className="text-xs text-green-400 py-4 text-center">✅ All products have sufficient stock levels.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              Product Listing Database
            </h2>
            <button
              onClick={openAddProductModal}
              className="bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-charcoal-900 border-b border-white/5 text-charcoal-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Name / Slug</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">MRP</th>
                  <th className="p-4 text-right">Selling Price</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 text-center">Toggles</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-charcoal-200">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-charcoal-450 block">{p.slug}</span>
                    </td>
                    <td className="p-4 uppercase text-xs text-gold-500 tracking-wide font-semibold">
                      {p.category.replace('-', ' ')}
                    </td>
                    <td className="p-4 text-right font-semibold">₹{p.mrp}</td>
                    <td className="p-4 text-right font-bold text-white">₹{p.sellingPrice}</td>
                    <td className="p-4 text-right font-semibold">
                      <span className={p.stock <= 5 ? 'text-orange-400 font-bold' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {p.featured && (
                          <span className="bg-gold-500/10 border border-gold-500/25 text-gold-500 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                            Featured
                          </span>
                        )}
                        {p.bestSeller && (
                          <span className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                            Bestseller
                          </span>
                        )}
                        {p.isOffer && (
                          <span className="bg-red-500/10 border border-red-500/25 text-red-400 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                            Offer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 hover:border-gold-500/30 text-gold-500 rounded transition-colors cursor-pointer"
                          aria-label="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id!, p.name)}
                          className="p-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 hover:border-red-500/30 text-red-400 rounded transition-colors cursor-pointer"
                          aria-label="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">
            Client Orders Database
          </h2>

          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-charcoal-900 border-b border-white/5 text-charcoal-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Client Details</th>
                  <th className="p-4">Logistics</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Payment</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-charcoal-200">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{o.customer.name}</span>
                      <span className="text-[10px] text-charcoal-400 block">{o.customer.mobile} ({o.customer.city})</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-charcoal-300">
                      {o.customer.deliveryType}
                    </td>
                    <td className="p-4 text-right font-bold text-white">₹{o.total}</td>
                    <td className="p-4 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusUpdate(o._id!, e.target.value)}
                        className="bg-charcoal-900 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer font-semibold uppercase"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={o.paymentStatus}
                        onChange={(e) => handleOrderPaymentStatusUpdate(o._id!, e.target.value)}
                        className="bg-charcoal-900 border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer font-semibold uppercase"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openOrderDetails(o)}
                          className="p-1.5 bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 hover:border-gold-500/30 text-gold-500 rounded transition-colors cursor-pointer"
                          aria-label="View Order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-charcoal-450">
                      No active orders in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm" onClick={() => setProductModalOpen(false)} />
          
          <div className="relative glass-card border border-gold-500/20 max-w-xl w-full p-6 md:p-8 rounded-xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                {editingProduct ? 'Edit Product Records' : 'Insert New Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-charcoal-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. 1000 Wala"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about product..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
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
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Stock Count</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: Number(e.target.value) })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Offer Selling Price (₹)</label>
                  <input
                    type="number"
                    value={prodForm.sellingPrice}
                    onChange={(e) => setProdForm({ ...prodForm, sellingPrice: Number(e.target.value) })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-500" />
                  Product Images ({prodForm.images.length})
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Link2 className="w-4 h-4 text-charcoal-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="/images/products/sparklers/my-product.webp or https://..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-charcoal-800 hover:bg-charcoal-700 border border-white/10 hover:border-gold-500/30 text-gold-500 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>

                {prodForm.images.length === 0 ? (
                  <p className="text-[11px] text-charcoal-450 bg-charcoal-900 border border-dashed border-white/10 rounded-lg p-4 text-center leading-relaxed">
                    No images yet. Storefront will show a branded &quot;image coming soon&quot; panel until a real photo is added.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {prodForm.images.map((img, index) => (
                      <div
                        key={`${img.url}-${index}`}
                        className={`flex items-center gap-3 bg-charcoal-900 border rounded-lg p-2.5 ${
                          img.isPrimary ? 'border-gold-500/40' : 'border-white/5'
                        }`}
                      >
                        {/* Preview */}
                        <div className="w-14 h-14 relative bg-charcoal-950 rounded-md overflow-hidden shrink-0 border border-white/5">
                          {!brokenPreviewUrls[index] ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={img.url}
                              alt={img.alt || `Preview ${index + 1}`}
                              onError={() =>
                                setBrokenPreviewUrls((prev) => ({ ...prev, [index]: true }))
                              }
                              onLoad={() =>
                                setBrokenPreviewUrls((prev) => {
                                  if (!prev[index]) return prev;
                                  const next = { ...prev };
                                  delete next[index];
                                  return next;
                                })
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900">
                              <ImageIcon className="w-5 h-5 text-red-400/70" />
                            </div>
                          )}
                        </div>

                        {/* Alt + path */}
                        <div className="flex-grow min-w-0 space-y-1.5">
                          <input
                            type="text"
                            value={img.alt}
                            onChange={(e) => handleImageAltChange(index, e.target.value)}
                            placeholder="Alt text describing this product photo"
                            className="w-full bg-charcoal-850 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-600"
                          />
                          <span className="block text-[10px] text-charcoal-500 truncate">
                            {img.url}
                          </span>
                          {brokenPreviewUrls[index] && (
                            <span className="block text-[10px] text-red-400 font-semibold uppercase tracking-wide">
                              File not found - check the path
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          {img.isPrimary ? (
                            <span className="bg-gold-500/10 border border-gold-500/30 text-gold-500 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              title="Set as primary image"
                              className="p-1.5 text-charcoal-400 hover:text-gold-500 transition-colors cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, 'up')}
                            disabled={index === 0}
                            title="Move up"
                            className="p-1.5 text-charcoal-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, 'down')}
                            disabled={index === prodForm.images.length - 1}
                            title="Move down"
                            className="p-1.5 text-charcoal-400 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            title="Remove image"
                            className="p-1.5 text-charcoal-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <p className="text-[10px] text-charcoal-500 leading-relaxed">
                      First image is the primary product photo shown on cards and cart. Order below defines gallery sequence.
                    </p>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <label className="flex items-center gap-2 text-sm text-charcoal-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="rounded border-white/10 bg-charcoal-950 text-gold-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-charcoal-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.bestSeller}
                    onChange={(e) => setProdForm({ ...prodForm, bestSeller: e.target.checked })}
                    className="rounded border-white/10 bg-charcoal-950 text-gold-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Bestseller choice</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-charcoal-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isOffer}
                    onChange={(e) => setProdForm({ ...prodForm, isOffer: e.target.checked })}
                    className="rounded border-white/10 bg-charcoal-950 text-gold-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Campaign Offer</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-charcoal-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isActive}
                    onChange={(e) => setProdForm({ ...prodForm, isActive: e.target.checked })}
                    className="rounded border-white/10 bg-charcoal-950 text-gold-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Active Catalog Listing</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-4">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="w-1/2 bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-300 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold py-3 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW ORDER DETAILS */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm" onClick={() => setOrderModalOpen(false)} />
          
          <div className="relative glass-card border border-gold-500/20 max-w-2xl w-full p-6 md:p-8 rounded-xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-charcoal-450 block mt-0.5">
                  {selectedOrder.createdAt
                    ? `Logged on: ${new Date(selectedOrder.createdAt).toLocaleString()}`
                    : 'Log time unavailable'}
                </span>
              </div>
              <button onClick={() => setOrderModalOpen(false)} className="text-charcoal-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
              {/* Customer Column */}
              <div className="space-y-4">
                <h4 className="font-bold text-gold-500 uppercase tracking-widest text-xs">Customer Details</h4>
                <div className="space-y-2 text-charcoal-300">
                  <p><span className="text-charcoal-450 font-semibold block">Full Name:</span> <strong className="text-white font-bold">{selectedOrder.customer.name}</strong></p>
                  <p><span className="text-charcoal-450 font-semibold block">Mobile Number:</span> <strong className="text-white font-bold">{selectedOrder.customer.mobile}</strong></p>
                  <p><span className="text-charcoal-450 font-semibold block">Email Address:</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-charcoal-450 font-semibold block">Logistics Delivery:</span> {selectedOrder.customer.deliveryType}</p>
                  <p><span className="text-charcoal-450 font-semibold block">Address Details:</span> {selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.pincode}</p>
                  {selectedOrder.customer.notes && (
                    <p><span className="text-charcoal-450 font-semibold block">Customer Notes:</span> {selectedOrder.customer.notes}</p>
                  )}
                </div>
              </div>

              {/* Items Column */}
              <div className="space-y-4">
                <h4 className="font-bold text-gold-500 uppercase tracking-widest text-xs">Purchased Crackers</h4>
                <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto pr-2 space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs gap-4">
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-charcoal-450">Qty: {item.quantity} x ₹{item.price}</span>
                      </div>
                      <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/5 pt-4 space-y-2 text-xs border-b pb-4">
                  <div className="flex justify-between text-charcoal-400">
                    <span>Subtotal Price:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Diwali Savings:</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline font-bold text-sm text-white pt-1">
                    <span>Grand Total:</span>
                    <span className="text-gold-400 font-extrabold text-base">₹{selectedOrder.total}</span>
                  </div>
                </div>

                {/* Action updates inside modal */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`mailto:${selectedOrder.customer.email}`}
                    className="w-full flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider border border-white/5 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Customer</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
