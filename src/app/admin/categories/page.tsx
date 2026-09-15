import React from 'react';
import { getProducts } from '@/lib/dataAccess';
import { readCategoriesFile } from '@/lib/categoryConfig';
import CategoriesClient from './CategoriesClient';

export const revalidate = 0;

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function CategoriesPage() {
  const products = serialize(await getProducts());
  const categoriesFile = readCategoriesFile();

  const categoryCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const categories = categoriesFile.map((cat) => ({
    id: cat.id,
    name: cat.name,
    image: cat.image,
    count: categoryCounts[cat.id] || 0,
  }));

  return <CategoriesClient categories={categories} />;
}
