'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/lib/mockData';
import { resolveDisplayImages } from '@/lib/images';
import ImageComingSoon from './ImageComingSoon';

interface ProductImageViewProps {
  product: Pick<IProduct, 'slug' | 'name' | 'category' | 'images'>;
  index?: number;
  sizes?: string;
  fit?: 'contain' | 'cover';
  className?: string;
  compact?: boolean;
}

export default function ProductImageView({
  product,
  index = 0,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  fit = 'contain',
  className = '',
  compact = false,
}: ProductImageViewProps) {
  const images = resolveDisplayImages(product);
  const [failedKey, setFailedKey] = useState<string | null>(null);

  const safeIndex = Math.min(Math.max(index, 0), images.length - 1);
  const currentKey = `${product.slug}:${safeIndex}`;
  const loadFailed = failedKey === currentKey;

  if (images.length === 0) {
    return <ImageComingSoon title="Product Image" subtitle="Coming Soon" compact={compact} />;
  }

  const image = images[safeIndex];

  if (loadFailed) {
    return (
      <ImageComingSoon
        title="Unable to Load"
        subtitle="Product Image Unavailable"
        compact={compact}
      />
    );
  }

  const isRemote = /^https?:\/\//i.test(image.url);

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      unoptimized={isRemote}
      onError={() => setFailedKey(currentKey)}
      className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
    />
  );
}
