'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/images';
import CategoryCard from '@/components/CategoryCard';

interface CategoryCarouselProps {
  categoryCounts: Record<string, number>;
  className?: string;
}

const AUTOSCROLL_STEP = 288;
const AUTOSCROLL_INTERVAL = 4000;

export default function CategoryCarousel({ categoryCounts, className }: CategoryCarouselProps) {
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
    <div className={className || 'relative group/carousel'}>
      <div
        ref={containerRef}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
        className="overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="region"
        aria-label="Shop by category"
      >
        <div className="flex gap-5 w-max">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="w-56 sm:w-64 lg:w-72 shrink-0">
              <CategoryCard slug={cat.id} name={cat.name} count={categoryCounts[cat.id] || 0} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollByAmount(-1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-3 z-20 w-9 h-9 bg-white border border-stone-200 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md hover:shadow-lg cursor-pointer"
        aria-label="Previous categories"
      >
        <ArrowLeft className="w-4 h-4 text-stone-600" />
      </button>
      <button
        onClick={() => scrollByAmount(1)}
        className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3 z-20 w-9 h-9 bg-white border border-stone-200 rounded-full items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity shadow-md hover:shadow-lg cursor-pointer"
        aria-label="Next categories"
      >
        <ArrowRight className="w-4 h-4 text-stone-600" />
      </button>
    </div>
  );
}
