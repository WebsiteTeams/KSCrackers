import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import ShopClient from './ShopClient';

export const revalidate = 30; // Revalidate every 30 seconds

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    filter?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams as required in Next.js 15+
  const params = await searchParams;
  const initialCategory = params.category || 'all';
  const initialSearch = params.search || '';
  const initialFilter = params.filter || ''; // e.g. "offers"

  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ShopClient
        products={products}
        initialCategory={initialCategory}
        initialSearch={initialSearch}
        initialFilter={initialFilter}
      />
    </div>
  );
}
