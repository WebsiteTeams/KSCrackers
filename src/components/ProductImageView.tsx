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

function getFileType(url: string): 'svg' | 'gif' | 'webp' | 'png' | 'jpg' | 'unknown' {
  const lower = url.toLowerCase().split('?')[0];
  if (lower.endsWith('.svg')) return 'svg';
  if (lower.endsWith('.gif')) return 'gif';
  if (lower.endsWith('.webp')) return 'webp';
  if (lower.endsWith('.png')) return 'png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpg';
  return 'unknown';
}

function NativeImage({ src, alt, fit, className }: { src: string; alt: string; fit: 'contain' | 'cover'; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${fit === 'cover' ? 'object-cover' : 'object-contain'} w-full h-full ${className || ''}`}
    />
  );
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
      <ImageComingSoon title="Unable to Load" subtitle="Product Image Unavailable" compact={compact} />
    );
  }

  const isRemote = /^https?:\/\//i.test(image.url);
  const fileType = getFileType(image.url);
  const useNative = isRemote || fileType === 'svg' || fileType === 'gif';

  if (useNative) {
    return (
      <NativeImage src={image.url} alt={image.alt} fit={fit} className={className} />
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      onError={() => setFailedKey(currentKey)}
      className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
    />
  );
}
