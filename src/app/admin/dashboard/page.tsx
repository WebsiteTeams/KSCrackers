import React from 'react';
import { getProducts, getOrders } from '@/lib/dataAccess';
import DashboardClient from './DashboardClient';

export const revalidate = 0; // Disable server caching for administrative pages

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
          STORE MANAGEMENT
        </h1>
        <p className="text-xs text-charcoal-400 mt-1 font-medium">
          Monitor orders queue, inventory metrics, and product listings
        </p>
      </div>

      <DashboardClient initialProducts={products} initialOrders={orders} />
    </div>
  );
}
