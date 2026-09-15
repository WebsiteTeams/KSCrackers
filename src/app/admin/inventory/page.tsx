import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import InventoryClient from './InventoryClient';

export const revalidate = 0;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function InventoryPage() {
  const products = serialize(await getProducts());
  return <InventoryClient initialProducts={products} />;
}
