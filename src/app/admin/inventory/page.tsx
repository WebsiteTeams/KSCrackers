import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import InventoryClient from './InventoryClient';

export const revalidate = 0;

export default async function InventoryPage() {
  const products = await getProducts();
  return <InventoryClient initialProducts={products} />;
}
