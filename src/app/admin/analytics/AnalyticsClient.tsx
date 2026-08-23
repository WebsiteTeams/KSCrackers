'use client';

import React, { useState, useMemo } from 'react';
import { IProduct, IOrder } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingCart, Package, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay } from 'date-fns';

interface AnalyticsClientProps {
  initialProducts: IProduct[];
  initialOrders: IOrder[];
}

const PIE_COLORS = ['#6B2C2C', '#D97757', '#1B4D3E', '#C97C4E', '#94a3b8', '#6366f1'];

export default function AnalyticsClient({ initialProducts, initialOrders }: AnalyticsClientProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const products = initialProducts;
  const orders = initialOrders;

  const rangeStart = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return subDays(new Date(), days);
  }, [dateRange]);

  const activeOrders = useMemo(() => {
    return orders.filter((o) => isWithinInterval(new Date(o.createdAt!), { start: rangeStart, end: new Date() }) && o.status !== 'Cancelled');
  }, [orders, rangeStart]);

  const prevOrders = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const prevStart = subDays(rangeStart, days);
    return orders.filter((o) => isWithinInterval(new Date(o.createdAt!), { start: prevStart, end: rangeStart }) && o.status !== 'Cancelled');
  }, [orders, rangeStart, dateRange]);

  const stats = useMemo(() => {
    const revenue = activeOrders.reduce((s, o) => s + o.total, 0);
    const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0);
    const avgOrder = activeOrders.length > 0 ? Math.round(revenue / activeOrders.length) : 0;
    const prevAvg = prevOrders.length > 0 ? Math.round(prevRevenue / prevOrders.length) : 0;
    const revenueChange = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0;
    const orderChange = prevOrders.length > 0 ? Math.round(((activeOrders.length - prevOrders.length) / prevOrders.length) * 100) : 0;
    return { revenue, avgOrder, revenueChange, orderChange, totalOrders: activeOrders.length };
  }, [activeOrders, prevOrders]);

  // Revenue by day
  const revenueByDay = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const dayRevenue = orders
        .filter((o) => isWithinInterval(new Date(o.createdAt!), { start: dayStart, end: dayEnd }) && o.status !== 'Cancelled')
        .reduce((s, o) => s + o.total, 0);
      return { date: format(date, 'MMM dd'), revenue: dayRevenue };
    });
  }, [orders, dateRange]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    const productRevenue = new Map<string, { name: string; revenue: number; units: number }>();
    activeOrders.forEach((o) => {
      o.items.forEach((item) => {
        const existing = productRevenue.get(item.productId) || { name: item.name, revenue: 0, units: 0 };
        existing.revenue += item.price * item.quantity;
        existing.units += item.quantity;
        productRevenue.set(item.productId, existing);
      });
    });
    return Array.from(productRevenue.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [activeOrders]);

  // Orders by status
  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // Orders by category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace('-', ' '), value }));
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Analytics</h1>
          <p className="text-sm text-stone-500 mt-0.5">Business insights and performance metrics</p>
        </div>
        <div className="flex bg-white border border-stone-200 rounded-lg p-0.5">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button key={range} onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${dateRange === range ? 'bg-burgundy-700 text-white' : 'text-stone-500 hover:text-stone-900'}`}>
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, change: stats.revenueChange, icon: TrendingUp, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { label: 'Total Orders', value: stats.totalOrders, change: stats.orderChange, icon: ShoppingCart, iconBg: 'bg-burgundy-100', iconColor: 'text-burgundy-600' },
          { label: 'Avg Order Value', value: `₹${stats.avgOrder.toLocaleString('en-IN')}`, change: null, icon: Package, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Active Products', value: products.filter((p) => p.isActive !== false).length, change: null, icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">{kpi.label}</span>
                  <div className="text-xl font-bold text-stone-900">{kpi.value}</div>
                  {kpi.change !== null && (
                    <div className={`flex items-center gap-1 text-[10px] font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {kpi.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{Math.abs(kpi.change)}% vs prev</span>
                    </div>
                  )}
                </div>
                <div className={`${kpi.iconBg} p-2 rounded-lg`}><Icon className={`w-4 h-4 ${kpi.iconColor}`} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={dateRange === '90d' ? 9 : dateRange === '30d' ? 4 : 0} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#6B2C2C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {statusBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {statusBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-stone-600">{item.name}</span>
                </div>
                <span className="font-semibold text-stone-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-400 w-5">#{i + 1}</span>
                  <div>
                    <span className="text-sm font-semibold text-stone-900 block">{p.name}</span>
                    <span className="text-[10px] text-stone-500">{p.units} units sold</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-stone-900">₹{p.revenue.toLocaleString('en-IN')}</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-stone-400 text-center py-6">No sales data yet.</p>}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Products by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#6B2C2C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
