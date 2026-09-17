'use client';

import React, { useState, useMemo } from 'react';
import { IProduct, IOrder } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Package,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';

interface DashboardClientProps {
  initialProducts: IProduct[];
  initialOrders: IOrder[];
}

export default function DashboardClient({ initialProducts, initialOrders }: DashboardClientProps) {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');

  const products = initialProducts;
  const orders = initialOrders;

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekAgo = subDays(now, 7);
    const monthAgo = subDays(now, 30);

    const getDateRangeStart = () => {
      if (dateRange === 'today') return todayStart;
      if (dateRange === 'week') return weekAgo;
      return monthAgo;
    };

    const rangeStart = getDateRangeStart();
    const prevRangeStart = subDays(rangeStart, dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : 30);

    // Current period orders
    const currentOrders = orders.filter((o) => {
      const d = new Date(o.createdAt!);
      return isWithinInterval(d, { start: rangeStart, end: now }) && o.status !== 'Cancelled';
    });

    // Previous period orders
    const prevOrders = orders.filter((o) => {
      const d = new Date(o.createdAt!);
      return isWithinInterval(d, { start: prevRangeStart, end: rangeStart }) && o.status !== 'Cancelled';
    });

    const currentRevenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
    const prevRevenue = prevOrders.reduce((sum, o) => sum + o.total, 0);
    const revenueChange = prevRevenue > 0 ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100) : 0;

    const activeOrders = orders.filter((o) => ['New', 'Confirmed', 'Processing', 'Ready'].includes(o.status)).length;
    const lowStock = products.filter((p) => p.stock <= 5).length;
    const avgOrderValue = currentOrders.length > 0 ? Math.round(currentRevenue / currentOrders.length) : 0;

    // Chart data — last 7 days
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const dayRevenue = orders
        .filter((o) => {
          const d = new Date(o.createdAt!);
          return isWithinInterval(d, { start: dayStart, end: dayEnd }) && o.status !== 'Cancelled';
        })
        .reduce((sum, o) => sum + o.total, 0);
      return { date: format(date, 'MMM dd'), revenue: dayRevenue };
    });

    return { currentRevenue, revenueChange, activeOrders, lowStock, avgOrderValue, chartData, currentOrderCount: currentOrders.length };
  }, [products, orders, dateRange]);

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()).slice(0, 8);
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 5);
  }, [products]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: 'bg-blue-50 text-blue-700 border-blue-200',
      Confirmed: 'bg-purple-50 text-purple-700 border-purple-200',
      Processing: 'bg-amber-50 text-amber-700 border-amber-200',
      Ready: 'bg-orange-50 text-orange-700 border-orange-200',
      Shipped: 'bg-teal-50 text-teal-700 border-teal-200',
      Completed: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-stone-100 text-stone-500 border-stone-200',
    };
    return colors[status] || colors.New;
  };

  const kpis = [
    {
      title: 'Revenue',
      value: `₹${stats.currentRevenue.toLocaleString('en-IN')}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders.toString(),
      change: null,
      icon: ShoppingCart,
      color: 'bg-burgundy-50 text-burgundy-600',
      iconBg: 'bg-burgundy-100',
      subtitle: `${stats.currentOrderCount} this ${dateRange}`,
    },
    {
      title: 'Low Stock',
      value: stats.lowStock.toString(),
      change: null,
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      iconBg: 'bg-amber-100',
      alert: stats.lowStock > 0,
    },
    {
      title: 'Avg Order Value',
      value: `₹${stats.avgOrderValue.toLocaleString('en-IN')}`,
      change: null,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</h1>
          <p className="text-sm text-stone-500 mt-0.5">Welcome back. Here&apos;s your store overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-stone-200 rounded-lg p-0.5">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button key={range} onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${dateRange === range ? 'bg-burgundy-700 text-white' : 'text-stone-500 hover:text-stone-900'}`}>
                {range === 'today' ? 'Today' : range === 'week' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`bg-white rounded-xl border border-stone-200 p-5 shadow-sm ${kpi.alert ? 'ring-2 ring-amber-300 border-amber-300' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">{kpi.title}</span>
                  <div className="text-2xl font-bold text-stone-900">{kpi.value}</div>
                  {kpi.change !== null && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {kpi.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{Math.abs(kpi.change)}% vs prev</span>
                    </div>
                  )}
                  {kpi.subtitle && <span className="text-xs text-stone-400 block">{kpi.subtitle}</span>}
                </div>
                <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color.split(' ')[1]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products" className="flex items-center gap-2 bg-burgundy-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
          <ShoppingCart className="w-4 h-4" /> Fulfillment Queue
        </Link>
        <Link href="/admin/analytics" className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors">
          <TrendingUp className="w-4 h-4" /> View Analytics
        </Link>
      </div>

      {/* Charts + Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Revenue Trend</h3>
              <span className="text-xs text-stone-400">Last 7 days</span>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Total: ₹{stats.chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6B2C2C" strokeWidth={2} dot={{ fill: '#6B2C2C', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Alerts & Actions</h3>

          {/* Low Stock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Low Stock</span>
              <Link href="/admin/inventory" className="text-xs text-burgundy-600 hover:text-burgundy-800 font-medium">View all</Link>
            </div>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-stone-700 truncate max-w-[140px]">{p.name}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${p.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-green-600">All products well stocked.</p>
            )}
          </div>

          <div className="border-t border-stone-100" />

          {/* Pending Actions */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Pending Actions</span>
            <div className="space-y-2">
              <Link href="/admin/orders" className="flex items-center justify-between text-xs py-1.5 hover:text-burgundy-600 transition-colors">
                <span className="text-stone-700">Unshipped orders</span>
                <span className="font-semibold text-stone-900">{orders.filter((o) => ['Confirmed', 'Processing', 'Ready'].includes(o.status)).length}</span>
              </Link>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-stone-700">Pending payments</span>
                <span className="font-semibold text-stone-900">{orders.filter((o) => o.paymentStatus === 'Pending').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs text-burgundy-600 hover:text-burgundy-800 font-medium flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] uppercase tracking-wider font-medium">
                <th className="text-left px-6 py-3">Order</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-right px-6 py-3">Amount</th>
                <th className="text-center px-6 py-3">Status</th>
                <th className="text-center px-6 py-3">Payment</th>
                <th className="text-center px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-stone-900">{o.orderNumber}</td>
                  <td className="px-6 py-3.5">
                    <span className="font-medium text-stone-900 block">{o.customer.name}</span>
                    <span className="text-[10px] text-stone-400">{o.customer.city}</span>
                  </td>
                  <td className="px-6 py-3.5 text-stone-600">{o.items.length}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-stone-900">₹{o.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${getStatusColor(o.status)}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${o.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Link href={`/admin/orders?view=${o._id}`} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg inline-flex transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-stone-400 text-sm">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
