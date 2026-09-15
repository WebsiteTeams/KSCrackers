import React from 'react';
import { getOrders } from '@/lib/dataAccess';
import OrdersClient from './OrdersClient';

export const revalidate = 0;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function OrdersPage() {
  const orders = serialize(await getOrders());
  return <OrdersClient initialOrders={orders} />;
}
