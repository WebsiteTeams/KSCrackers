import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/dataAccess';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 30; // Revalidate every 30 seconds

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found — KS Crackers',
    };
  }

  return {
    title: `${product.name} — Premium Firecrackers | KS Crackers`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  
  // Find related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
