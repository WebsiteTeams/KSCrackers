import React from 'react';
import { getOrders } from '@/lib/dataAccess';
import OrdersClient from './OrdersClient';

export const revalidate = 0;

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersClient initialOrders={orders} />;
}
