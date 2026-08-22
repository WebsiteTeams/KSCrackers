'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/images';
import CategoryCard from '@/components/CategoryCard';

interface CategoryCarouselProps {
  categoryCounts: Record<string, number>;
  className?: string;
}

const AUTOSCROLL_STEP = 288; // card width + gap
const AUTOSCROLL_INTERVAL = 3000;

export default function CategoryCarousel({
  categoryCounts,
  className,
}: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      const container = containerRef.current;
      if (!container || hoverRef.current) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;

      let next = container.scrollLeft + AUTOSCROLL_STEP;
      if (next >= maxScroll) next = 0;

      container.scrollTo({ left: next, behavior: 'smooth' });
    }, AUTOSCROLL_INTERVAL);

    return () => window.clearInterval(id);
  }, []);

  const scrollByAmount = (dir: number) => {
    containerRef.current?.scrollBy({ left: dir * AUTOSCROLL_STEP, behavior: 'smooth' });
  };

  return (
    <div className={className || 'relative group/carousel'} data-testid="category-carousel">
      <div
        ref={containerRef}
        onMouseEnter={() => {
          hoverRef.current = true;
        }}
        onMouseLeave={() => {
          hoverRef.current = false;
        }}
        className="overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="region"
        aria-label="Shop by category carousel"
      >
        <div className="flex gap-6 w-max">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="w-56 sm:w-64 lg:w-72 shrink-0">
              <CategoryCard
                slug={cat.id}
                name={cat.name}
                count={categoryCounts[cat.id] || 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => scrollByAmount(-1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-4 z-20 w-10 h-10 bg-charcoal-900/90 border border-gold-500/30 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-gold-500/20 cursor-pointer shadow-lg"
        aria-label="Previous categories"
      >
        <ArrowLeft className="w-5 h-5 text-gold-400" />
      </button>

      <button
        onClick={() => scrollByAmount(1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-4 z-20 w-10 h-10 bg-charcoal-900/90 border border-gold-500/30 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-gold-500/20 cursor-pointer shadow-lg"
        aria-label="Next categories"
      >
        <ArrowRight className="w-5 h-5 text-gold-400" />
      </button>
    </div>
  );
}
