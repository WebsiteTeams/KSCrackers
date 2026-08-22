import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStorefrontProducts } from '@/lib/dataAccess';
import { CATEGORIES, bannerImages } from '@/lib/images';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import {
  ShieldCheck,
  Gift,
  HeadphonesIcon,
  BadgeCheck,
  ArrowRight,
  Flame,
  Award,
  ShoppingBag
} from 'lucide-react';
import HomeClientComponents from './HomeClientComponents';

export const revalidate = 60;

export default async function HomePage() {
  const allProducts = await getStorefrontProducts();

  const featuredProducts = allProducts.filter(p => p.featured && p.category !== 'combos').slice(0, 4);
  const comboPacks = allProducts.filter(p => p.category === 'combos').slice(0, 4);

  const categoryCounts = allProducts.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-24 pb-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Typography */}
            <div className="space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold tracking-widest uppercase">
                Premium Sivakasi Fireworks
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                MAKE EVERY <br />
                <span className="text-gold-500">CELEBRATION BRIGHTER.</span>
              </h1>

              <p className="text-charcoal-300 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Premium crackers, curated celebration combos and exclusive festive offers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold px-8 py-4 rounded-lg shadow-xl hover:opacity-95 transition-all text-sm uppercase tracking-wider flex items-center justify-center cursor-pointer"
                >
                  SHOP COLLECTION
                </Link>
                <Link
                  href="#offers"
                  className="w-full sm:w-auto bg-transparent text-gold-500 border border-gold-500/50 hover:bg-gold-500/10 font-bold px-8 py-4 rounded-lg transition-all text-sm uppercase tracking-wider flex items-center justify-center cursor-pointer"
                >
                  VIEW OFFERS
                </Link>
              </div>
            </div>

            {/* Right: Celebration Composition */}
            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-charcoal-950">
              <Image
                src={bannerImages.hero}
                alt="Golden firework bursts celebrating over a night sky at a KS Crackers celebration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="absolute inset-0 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="glass-card border border-gold-500/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: <Award className="w-5 h-5 text-gold-500" />, label: 'Quality Products' },
              { icon: <Flame className="w-5 h-5 text-gold-500" />, label: 'Best Festival Offers' },
              { icon: <ShieldCheck className="w-5 h-5 text-gold-500" />, label: 'Secure Ordering' },
              { icon: <HeadphonesIcon className="w-5 h-5 text-gold-500" />, label: 'Customer Support' },
              { icon: <BadgeCheck className="w-5 h-5 text-gold-500" />, label: 'Trusted Service' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center space-y-2 p-2 ${
                  idx === 4 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="bg-gold-500/10 p-2.5 rounded-full border border-gold-500/25">
                  {item.icon}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-charcoal-200">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Category Explorer */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Explore the Celebration
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            SHOP BY CATEGORY
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        <CategoryCarousel categoryCounts={categoryCounts} className="my-8" />
      </section>

      {/* 4. Featured Products / Customer Favourites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
              Customer Favourites
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              POPULAR CHOICES
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1.5 uppercase tracking-wider cursor-pointer group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Festival Offer Section */}
      <section id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="relative rounded-2xl overflow-hidden bg-charcoal-900 min-h-[400px] flex items-center border border-white/5">
          <Image
            src={bannerImages.festivalOffer}
            alt="Festive golden fireworks display for KS Crackers festival offers"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="absolute inset-0 object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900 via-charcoal-900/80 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl p-8 md:p-16 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              FESTIVE OFFERS
            </h2>
            <p className="text-gold-400 text-lg font-medium">
              Celebrate more. Spend smarter.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?filter=offers"
                className="inline-flex items-center gap-2 bg-white text-charcoal-900 font-bold px-8 py-3.5 rounded transition-opacity text-sm uppercase tracking-wider hover:bg-gold-500 cursor-pointer"
              >
                <span>EXPLORE OFFERS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Combo Packs */}
      <section id="combos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Celebration Combos
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            EXCLUSIVE GIFT PACKS
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {comboPacks.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-500 font-bold block">
              Our Legacy & Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              CELEBRATIONS BEGIN <br />
              <span className="text-gradient-gold">WITH TRUST</span>
            </h2>
            <p className="text-sm text-charcoal-300 leading-relaxed font-medium">
              At KS Crackers, we source the highest grade raw materials from Sivakasi—the fireworks capital of India—to manufacture sparklers, crackers, and rockets that light up your sky safely. Our mission is to blend traditional celebrations with modern shopping convenience.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Quality Inspected</h4>
                  <p className="text-xs text-charcoal-400">Inspected for safety and longevity</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Gift className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Custom Combo Gifts</h4>
                  <p className="text-xs text-charcoal-400">Curated options for all age ranges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical Display */}
          <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-xl overflow-hidden border border-white/5 bg-charcoal-950">
            <Image
              src={bannerImages.about}
              alt="KS Crackers Sivakasi crafted heritage emblem with golden spark"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 object-cover opacity-95"
            />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-charcoal-900/90 backdrop-blur-md rounded border border-white/10">
              <span className="text-gold-500 font-bold text-lg block mb-1">Authentic Sivakasi Sourced</span>
              <p className="text-xs text-charcoal-300">100% compliant with standard explosive safety rules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Why Choose Us
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            THE KS DIFFERENCE
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'QUALITY PRODUCTS',
              desc: 'Carefully selected fireworks produced with precise, premium compounds.',
              icon: <Award className="w-6 h-6 text-gold-500" />,
            },
            {
              title: 'BEST FESTIVE OFFERS',
              desc: 'Attractive festive pricing and combo discounts that fit all celebration budgets.',
              icon: <Flame className="w-6 h-6 text-gold-500" />,
            },
            {
              title: 'EASY ORDERING',
              desc: 'Simple online shopping experience with an instant checkout flow.',
              icon: <ShoppingBag className="w-6 h-6 text-gold-500" />,
            },
            {
              title: 'CUSTOMER SUPPORT',
              desc: 'Quick assistance whenever required through phone, email, and social networks.',
              icon: <HeadphonesIcon className="w-6 h-6 text-gold-500" />,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-charcoal-900 p-8 border border-white/5 flex flex-col items-start hover:border-gold-500/30 transition-colors"
            >
              <div className="mb-6">{card.icon}</div>
              <h3 className="font-bold text-sm text-white tracking-widest uppercase mb-3">{card.title}</h3>
              <p className="text-sm text-charcoal-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 9 & 10. Client Interactions (Testimonials, FAQs, Contact Form) */}
      <HomeClientComponents />
    </div>
  );
}
