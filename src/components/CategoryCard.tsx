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
      className="group block relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-gold-500/30 transition-colors"
      aria-label={`Browse ${name} crackers`}
    >
      <div className="absolute inset-0 bg-charcoal-950">
        <Image
          src={imageSrc}
          alt={loadFailed ? `${name} crackers - category image coming soon` : `${name} crackers collection`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setLoadFailed(true)}
          className={`object-cover transition-transform duration-700 ${
            loadFailed ? '' : 'group-hover:scale-110'
          }`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-white uppercase tracking-wider">
            {name}
          </h3>
          <span className="text-xs text-gold-500 font-semibold tracking-widest uppercase">
            {count} Products
          </span>
        </div>
        <ArrowRight className="w-5 h-5 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </Link>
  );
}
