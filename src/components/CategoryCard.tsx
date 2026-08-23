'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getCategoryImage, PLACEHOLDER_CATEGORY_IMAGE } from '@/lib/images';

interface CategoryCardProps {
  slug: string;
  name: string;
  count: number;
}

export default function CategoryCard({ slug, name, count }: CategoryCardProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const configuredImage = getCategoryImage(slug);
  const imageSrc =
    !configuredImage || loadFailed ? PLACEHOLDER_CATEGORY_IMAGE : configuredImage;

  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group block relative aspect-[4/5] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 hover:border-burgundy-300 transition-all duration-300"
      aria-label={`Browse ${name} crackers`}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={loadFailed ? `${name} category` : `${name} crackers collection`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setLoadFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-semibold text-base text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {name}
        </h3>
        <span className="text-xs text-stone-300 font-medium">
          {count} {count === 1 ? 'product' : 'products'}
        </span>
      </div>

      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-burgundy-700" />
      </div>
    </Link>
  );
}
