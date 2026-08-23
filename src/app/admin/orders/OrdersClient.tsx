'use client';

import React, { useState, useMemo } from 'react';
import { IOrder } from '@/lib/mockData';
import { Search, Eye, Mail, ChevronDown, X, Filter, ArrowUpDown, CheckCircle2, Package, Truck, Clock, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const PAGE_SIZE = 10;

interface OrdersClientProps {
  initialOrders: IOrder[];
}

type ViewMode = 'table' | 'kanban';

const STATUS_FLOW = ['New', 'Confirmed', 'Processing', 'Ready', 'Shipped', 'Completed'];
const KANBAN_COLUMNS = [
  { status: 'New', label: 'New Orders', color: 'bg-blue-500', lightColor: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  { status: 'Confirmed', label: 'To Pack', color: 'bg-purple-500', lightColor: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700' },
  { status: 'Processing', label: 'Packing', color: 'bg-amber-500', lightColor: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
  { status: 'Ready', label: 'Ready to Ship', color: 'bg-orange-500', lightColor: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700' },
];

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((o) => o.status === statusFilter);
    if (paymentFilter !== 'all') result = result.filter((o) => o.paymentStatus === paymentFilter);
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }, [orders, search, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, statusFilter, paymentFilter]);

  const kanbanData = useMemo(() => {
    return KANBAN_COLUMNS.map((col) => ({
      ...col,
      orders: filteredOrders.filter((o) => o.status === col.status),
    }));
  }, [filteredOrders]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      if (selectedOrder?._id === id) setSelectedOrder(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentUpdate = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      if (selectedOrder?._id === id) setSelectedOrder(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const advanceStatus = (currentStatus: string) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

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
    return colors[status] || '';
  };

  const openDetail = (order: IOrder) => { setSelectedOrder(order); setDetailOpen(true); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Orders</h1>
          <p className="text-sm text-stone-500 mt-0.5">{filteredOrders.length} orders found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('table')} className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${viewMode === 'table' ? 'bg-burgundy-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
            Table
          </button>
          <button onClick={() => setViewMode('kanban')} className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-burgundy-700 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
            Kanban
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="all">All Status</option>
          {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-white border border-stone-200 rounded-lg py-2.5 px-3 text-sm text-stone-700 focus:outline-none focus:border-burgundy-500 cursor-pointer">
          <option value="all">All Payment</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanData.map((col) => (
            <div key={col.status} className="space-y-3">
              <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${col.lightColor} border`}>
                <span className={`text-xs font-semibold ${col.textColor}`}>{col.label}</span>
                <span className={`text-[10px] font-bold ${col.textColor} bg-white/60 px-1.5 py-0.5 rounded`}>{col.orders.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {col.orders.map((order) => {
                  const next = advanceStatus(order.status);
                  return (
                    <div key={order._id} className="bg-white border border-stone-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDetail(order)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-stone-900">{order.orderNumber}</span>
                        <span className="text-[10px] text-stone-400">{format(new Date(order.createdAt!), 'MMM dd')}</span>
                      </div>
                      <p className="text-xs text-stone-600 mb-2">{order.customer.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900">₹{order.total.toLocaleString('en-IN')}</span>
                        {next && (
                          <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order._id!, next); }}
                            className="text-[10px] font-medium text-burgundy-600 hover:text-burgundy-800 bg-burgundy-50 px-2 py-1 rounded transition-colors">
                            Move to {next}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {col.orders.length === 0 && <p className="text-xs text-stone-400 text-center py-6">No orders</p>}
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
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Delivery</th>
                  <th className="text-right px-6 py-3">Amount</th>
                  <th className="text-center px-6 py-3">Status</th>
                  <th className="text-center px-6 py-3">Payment</th>
                  <th className="text-center px-6 py-3">Date</th>
                  <th className="text-center px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-stone-900">{o.orderNumber}</td>
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-stone-900 block">{o.customer.name}</span>
                      <span className="text-[10px] text-stone-400">{o.customer.mobile}</span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-stone-600">{o.customer.deliveryType}</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-stone-900">₹{o.total.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3.5 text-center">
                      <select value={o.status} onChange={(e) => handleStatusUpdate(o._id!, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:border-burgundy-500 ${getStatusColor(o.status)}`}>
                        {[...STATUS_FLOW, 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <select value={o.paymentStatus} onChange={(e) => handlePaymentUpdate(o._id!, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none focus:border-burgundy-500 ${o.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-center text-xs text-stone-500">{format(new Date(o.createdAt!), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-3.5 text-center">
                      <button onClick={() => openDetail(o)} className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-12 text-center text-stone-400 text-sm">No orders match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (table view only) */}
      {viewMode === 'table' && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}
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

      {/* Order Detail Modal */}
      {detailOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setDetailOpen(false)} />
          <div className="relative bg-white border border-stone-200 max-w-2xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Order {selectedOrder.orderNumber}</h3>
                <span className="text-xs text-stone-500">{format(new Date(selectedOrder.createdAt!), 'MMM dd, yyyy h:mm a')}</span>
              </div>
              <button onClick={() => setDetailOpen(false)} className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {STATUS_FLOW.map((step, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                  const isComplete = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <React.Fragment key={step}>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${isCurrent ? 'bg-burgundy-100 text-burgundy-700 ring-2 ring-burgundy-300' : isComplete ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-stone-100 text-stone-400'}`}>
                        {isComplete && !isCurrent ? <CheckCircle2 className="w-3 h-3" /> : null}
                        {step}
                      </div>
                      {i < STATUS_FLOW.length - 1 && <div className={`w-6 h-0.5 shrink-0 ${i < currentIdx ? 'bg-green-300' : 'bg-stone-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Customer</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-stone-500 text-xs block">Name</span><span className="font-semibold text-stone-900">{selectedOrder.customer.name}</span></div>
                    <div><span className="text-stone-500 text-xs block">Mobile</span><span className="font-semibold text-stone-900">{selectedOrder.customer.mobile}</span></div>
                    <div><span className="text-stone-500 text-xs block">Email</span><span className="text-stone-700">{selectedOrder.customer.email}</span></div>
                    <div><span className="text-stone-500 text-xs block">Delivery</span><span className="text-stone-700">{selectedOrder.customer.deliveryType}</span></div>
                    <div><span className="text-stone-500 text-xs block">Address</span><span className="text-stone-700">{selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.pincode}</span></div>
                    {selectedOrder.customer.notes && <div><span className="text-stone-500 text-xs block">Notes</span><span className="text-stone-700">{selectedOrder.customer.notes}</span></div>}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-2 border-b border-stone-100 last:border-0">
                        <div>
                          <span className="font-medium text-stone-900 block">{item.name}</span>
                          <span className="text-xs text-stone-500">Qty: {item.quantity} x ₹{item.price}</span>
                        </div>
                        <span className="font-semibold text-stone-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span></div>
                    {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span></div>}
                    <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100">
                      <span>Total</span><span className="text-burgundy-700">₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-stone-100">
                {advanceStatus(selectedOrder.status) && (
                  <button onClick={() => handleStatusUpdate(selectedOrder._id!, advanceStatus(selectedOrder.status)!)}
                    className="flex items-center gap-2 bg-burgundy-700 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-burgundy-800 transition-colors">
                    <Truck className="w-3.5 h-3.5" /> Mark as {advanceStatus(selectedOrder.status)}
                  </button>
                )}
                <a href={`mailto:${selectedOrder.customer.email}`} className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
