import React from 'react';
import { getProducts, getOrders } from '@/lib/dataAccess';
import AnalyticsClient from './AnalyticsClient';

export const revalidate = 0;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function AnalyticsPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  return <AnalyticsClient initialProducts={serialize(products)} initialOrders={serialize(orders)} />;
}
