import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products} />;
}
