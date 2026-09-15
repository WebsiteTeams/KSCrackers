import React from 'react';
import { getProducts, getOrders } from '@/lib/dataAccess';
import DashboardClient from './DashboardClient';

export const revalidate = 0; // Disable server caching for administrative pages

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function AdminDashboardPage() {
  const products = serialize(await getProducts());
  const orders = serialize(await getOrders());

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
