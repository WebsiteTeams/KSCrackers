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
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-charcoal-900 border border-dashed border-gold-500/25 select-none"
      role="img"
      aria-label={`${title} ${subtitle.toLowerCase()}`}
    >
      <div className="bg-charcoal-850 border border-gold-500/20 rounded-full p-2">
        <ImageOff className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-gold-500/70`} />
      </div>
      <span
        className={`font-bold uppercase tracking-widest text-gold-500/80 ${
          compact ? 'text-[7px]' : 'text-[10px]'
        }`}
      >
        {title}
      </span>
      <span
        className={`uppercase tracking-widest text-charcoal-400 ${
          compact ? 'text-[7px]' : 'text-[9px]'
        }`}
      >
        {subtitle}
      </span>
    </div>
  );
}
