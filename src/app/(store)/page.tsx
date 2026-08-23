import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStorefrontProducts } from '@/lib/dataAccess';
import { CATEGORIES, bannerImages } from '@/lib/images';
import ProductCard from '@/components/ProductCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import {
  ShieldCheck,
  Award,
  ArrowRight,
  Flame,
  Headphones,
  BadgeCheck,
  Leaf
} from 'lucide-react';
import HomeClientComponents from './HomeClientComponents';

export const revalidate = 60;

export default async function HomePage() {
  const allProducts = await getStorefrontProducts();

  const featuredProducts = allProducts.filter(p => p.featured && p.category !== 'combos').slice(0, 3);
  const comboPacks = allProducts.filter(p => p.category === 'combos').slice(0, 3);

  const categoryCounts = allProducts.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-cream-50">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-50 border border-burgundy-100 text-burgundy-700 text-xs font-semibold tracking-wider uppercase">
                  <Flame className="w-3 h-3" />
                  Heritage Since 1985
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1]" style={{ fontFamily: 'var(--font-heading)' }}>
                Celebrations Begin{' '}
                <span className="text-burgundy-700">with Trust</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-lg leading-relaxed">
                Premium firecrackers from Sivakasi — crafted with generations of expertise, tested for safety, delivered for joy.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/shop"
                  className="bg-burgundy-700 text-white font-semibold px-8 py-3.5 rounded-lg text-sm hover:bg-burgundy-800 transition-colors inline-flex items-center gap-2"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#about"
                  className="text-stone-600 font-medium px-6 py-3.5 rounded-lg text-sm hover:bg-stone-50 transition-colors border border-stone-200"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
              <Image
                src={bannerImages.hero}
                alt="KS Crackers celebration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-stone-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Award className="w-5 h-5 text-burgundy-600" />, label: 'Certified Quality', desc: 'PESO tested' },
              { icon: <Flame className="w-5 h-5 text-burgundy-600" />, label: 'Best Festival Prices', desc: 'Direct from source' },
              { icon: <ShieldCheck className="w-5 h-5 text-burgundy-600" />, label: 'Secure Ordering', desc: 'Safe checkout' },
              { icon: <Headphones className="w-5 h-5 text-burgundy-600" />, label: 'Expert Support', desc: 'Year-round service' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-burgundy-50">
                  {item.icon}
                </div>
                <div>
                  <span className="text-sm font-semibold text-stone-900 block">{item.label}</span>
                  <span className="text-xs text-stone-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Explore</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Shop by Category
            </h2>
          </div>
          <CategoryCarousel categoryCounts={categoryCounts} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-gap bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Popular</span>
              <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Customer Favourites
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-burgundy-700 hover:text-burgundy-800 inline-flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Festival Offers */}
      <section id="offers" className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl overflow-hidden bg-stone-900 min-h-[320px] flex items-center">
            <Image
              src={bannerImages.festivalOffer}
              alt="Festival offers"
              fill
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 to-stone-900/60" />
            <div className="relative z-10 max-w-xl p-8 md:p-12">
              <span className="text-xs uppercase tracking-wider text-terracotta-400 font-semibold">Limited Time</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Festive Offers
              </h2>
              <p className="text-stone-300 text-sm mb-6">
                Celebrate more, spend smarter. Exclusive discounts on premium combos and family packs.
              </p>
              <Link
                href="/shop?filter=offers"
                className="bg-white text-stone-900 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-stone-100 transition-colors inline-flex items-center gap-2"
              >
                Explore Offers
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Combo Packs */}
      <section id="combos" className="section-gap bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Gift Sets</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Exclusive Combo Packs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {comboPacks.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Our Heritage</span>
              <h2 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                A Tradition of <span className="text-burgundy-700">Light & Trust</span>
              </h2>
              <p className="text-stone-600 leading-relaxed">
                At KS Crackers, we source the finest raw materials from Sivakasi — India's fireworks capital — to craft sparklers, crackers, and rockets that illuminate your celebrations safely.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                  <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Quality Tested</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Every batch inspected for safety</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-200">
                  <Leaf className="w-5 h-5 text-forest-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-stone-900">Eco Considered</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Low-smoke formulations available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100">
              <Image
                src={bannerImages.about}
                alt="KS Crackers Sivakasi heritage"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-sm">
                <span className="font-semibold text-stone-900 block" style={{ fontFamily: 'var(--font-heading)' }}>
                  Authentic Sivakasi Crafted
                </span>
                <p className="text-xs text-stone-500 mt-1">100% compliant with safety standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-gap bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
              The KS Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Quality Products', desc: 'Carefully selected fireworks with premium compounds.', icon: <Award className="w-5 h-5 text-burgundy-600" /> },
              { title: 'Festival Offers', desc: 'Attractive pricing that fits all celebration budgets.', icon: <Flame className="w-5 h-5 text-burgundy-600" /> },
              { title: 'Easy Ordering', desc: 'Simple online shopping with instant checkout.', icon: <BadgeCheck className="w-5 h-5 text-burgundy-600" /> },
              { title: 'Expert Support', desc: 'Quick assistance via phone, email, and social.', icon: <Headphones className="w-5 h-5 text-burgundy-600" /> },
            ].map((card, idx) => (
              <div key={idx} className="p-6 bg-cream-50 rounded-lg border border-stone-200">
                <div className="mb-4 p-2 bg-white rounded-lg border border-stone-100 w-fit">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-sm text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {card.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials + FAQ + Contact */}
      <HomeClientComponents />
    </div>
  );
}
