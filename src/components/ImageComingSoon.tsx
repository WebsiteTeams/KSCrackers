'use client';

import { ImageOff } from 'lucide-react';

interface ImageComingSoonProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function ImageComingSoon({
  title = 'Product Image',
  subtitle = 'Coming Soon',
  compact = false,
}: ImageComingSoonProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-stone-100 border border-dashed border-stone-300 select-none"
      role="img"
      aria-label={`${title} ${subtitle.toLowerCase()}`}
    >
      <ImageOff className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-stone-400`} />
      <span className={`${compact ? 'text-[7px]' : 'text-[10px]'} font-semibold uppercase tracking-wider text-stone-500`}>
        {title}
      </span>
      <span className={`${compact ? 'text-[7px]' : 'text-[9px]'} uppercase tracking-wider text-stone-400`}>
        {subtitle}
      </span>
    </div>
  );
}
