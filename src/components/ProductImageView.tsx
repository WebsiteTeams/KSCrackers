'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { IProduct } from '@/lib/mockData';
import { resolveDisplayImages, getCategoryImage, PLACEHOLDER_PRODUCT_IMAGE } from '@/lib/images';
import ImageComingSoon from './ImageComingSoon';

interface ProductImageViewProps {
  product: Pick<IProduct, 'slug' | 'name' | 'category' | 'images'>;
  index?: number;
  sizes?: string;
  fit?: 'contain' | 'cover';
  className?: string;
  compact?: boolean;
}

function getFileType(url: string): 'svg' | 'gif' | 'webp' | 'png' | 'jpg' | 'avif' | 'unknown' {
  const lower = url.toLowerCase().split('?')[0];
  if (lower.endsWith('.svg')) return 'svg';
  if (lower.endsWith('.gif')) return 'gif';
  if (lower.endsWith('.webp')) return 'webp';
  if (lower.endsWith('.avif')) return 'avif';
  if (lower.endsWith('.png')) return 'png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpg';
  return 'unknown';
}

function NativeImage({ src, alt, fit, className, onError }: {
  src: string; alt: string; fit: 'contain' | 'cover'; className?: string; onError?: () => void;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={onError}
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
  const [failedIndex, setFailedIndex] = useState<number | null>(null);

  const safeIndex = Math.min(Math.max(index, 0), images.length - 1);

  const handleFail = useCallback((idx: number) => {
    setFailedIndex(idx);
  }, []);

  if (images.length === 0) {
    return <ImageComingSoon title="Product Image" subtitle="Coming Soon" compact={compact} />;
  }

  if (failedIndex !== null && failedIndex >= images.length) {
    const categoryFallback = getCategoryImage(product.category);
    if (categoryFallback) {
      const isRemote = /^https?:\/\//i.test(categoryFallback);
      const ft = getFileType(categoryFallback);
      const useNative = isRemote || ft === 'svg' || ft === 'gif';
      if (useNative) {
        return <NativeImage src={categoryFallback} alt={`${product.name} - KS Crackers`} fit={fit} className={className} />;
      }
      return (
        <Image
          src={categoryFallback}
          alt={`${product.name} - KS Crackers`}
          fill
          sizes={sizes}
          className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      );
    }
    return <ImageComingSoon title="Product Image" subtitle="Coming Soon" compact={compact} />;
  }

  let displayIndex = safeIndex;
  if (failedIndex !== null && failedIndex <= safeIndex) {
    displayIndex = failedIndex + 1;
    if (displayIndex >= images.length) {
      const categoryFallback = getCategoryImage(product.category);
      if (categoryFallback) {
        const isRemote = /^https?:\/\//i.test(categoryFallback);
        const ft = getFileType(categoryFallback);
        const useNative = isRemote || ft === 'svg' || ft === 'gif';
        if (useNative) {
          return <NativeImage src={categoryFallback} alt={`${product.name} - KS Crackers`} fit={fit} className={className} />;
        }
        return (
          <Image
            src={categoryFallback}
            alt={`${product.name} - KS Crackers`}
            fill
            sizes={sizes}
            className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
          />
        );
      }
      return <ImageComingSoon title="Product Image" subtitle="Coming Soon" compact={compact} />;
    }
  }

  const image = images[displayIndex];

  const isRemote = /^https?:\/\//i.test(image.url);
  const fileType = getFileType(image.url);
  const useNative = isRemote || fileType === 'svg' || fileType === 'gif';

  if (useNative) {
    return (
      <NativeImage
        src={image.url}
        alt={image.alt}
        fit={fit}
        className={className}
        onError={() => handleFail(displayIndex)}
      />
    );
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      onError={() => handleFail(displayIndex)}
      className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
    />
  );
}
