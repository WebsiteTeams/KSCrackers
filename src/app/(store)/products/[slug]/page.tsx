import React from 'react';
import { notFound } from 'next/navigation';
import { getStorefrontProductBySlug, getStorefrontProducts } from '@/lib/dataAccess';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 30;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getStorefrontProductBySlug(resolvedParams.slug);
  if (!product) return { title: 'Product Not Found — KS Crackers' };
  return {
    title: `${product.name} — Premium Firecrackers | KS Crackers`,
    description: product.description,
    openGraph: { images: product.images.length > 0 ? [product.images[0].url] : [] },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getStorefrontProductBySlug(resolvedParams.slug);
  if (!product) notFound();

  const allProducts = await getStorefrontProducts();
  const sameCategory = allProducts.filter((p) => p.category === product.category && p._id !== product._id);
  const relatedFromCategory = sameCategory.slice(0, 4);
  const remainingSlots = 4 - relatedFromCategory.length;
  const categoryIds = new Set(sameCategory.map((p) => p._id));
  const popularFiller = remainingSlots > 0
    ? allProducts.filter((p) => p._id !== product._id && !categoryIds.has(p._id) && (p.bestSeller || p.featured))
        .sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller)).slice(0, remainingSlots)
    : [];
  const relatedProducts = [...relatedFromCategory, ...popularFiller];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
