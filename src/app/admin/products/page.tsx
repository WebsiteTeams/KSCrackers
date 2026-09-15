import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function ProductsPage() {
  const products = serialize(await getProducts());
  return <ProductsClient initialProducts={products} />;
}
