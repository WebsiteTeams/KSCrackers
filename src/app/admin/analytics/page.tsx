import React from 'react';
import { getProducts, getOrders } from '@/lib/dataAccess';
import AnalyticsClient from './AnalyticsClient';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  return <AnalyticsClient initialProducts={products} initialOrders={orders} />;
}
