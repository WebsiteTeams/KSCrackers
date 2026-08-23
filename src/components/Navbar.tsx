'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, PhoneCall } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  const router = useRouter();

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Offers', href: '/#offers' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-wide text-burgundy-700">
                KS
              </span>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-600">
                Crackers
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-burgundy-700'
                        : 'text-stone-600 hover:text-burgundy-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-stone-500 hover:text-burgundy-700 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-stone-500 hover:text-burgundy-700 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-burgundy-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <Link
                href="/#contact"
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-burgundy-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-stone-500"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-burgundy-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-stone-500"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 shadow-sm">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block py-2.5 text-sm font-medium text-stone-700 hover:text-burgundy-700 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-stone-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                      setIsOpen(false);
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search crackers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-3 pr-10 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500"
                  />
                  <button type="submit" className="absolute right-3 top-2.5 text-stone-400 hover:text-burgundy-600">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-stone-900/60 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                Search
              </h3>
              <button onClick={() => setSearchOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                  setSearchOpen(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 px-4 pr-12 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10"
              />
              <button
                type="submit"
                className="absolute right-3 top-[4.5rem] bg-burgundy-700 text-white p-2 rounded-lg hover:bg-burgundy-800 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
