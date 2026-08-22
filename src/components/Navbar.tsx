'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when routing changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/#categories' },
    { name: 'Offers', href: '/#offers' },
    { name: 'Combos', href: '/#combos' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'clean-navbar py-4 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex flex-col items-start group cursor-pointer">
                <span className="text-2xl font-extrabold tracking-widest text-gold-500 group-hover:text-white transition-colors duration-300">
                  KS
                </span>
                <span className="text-sm font-semibold tracking-[0.2em] text-white -mt-1 group-hover:text-gold-500 transition-colors duration-300">
                  CRACKERS
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold-500 ${
                      isActive ? 'text-gold-500 border-b border-gold-500 pb-0.5' : 'text-charcoal-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-charcoal-300 hover:text-gold-500 transition-colors cursor-pointer"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button onClick={() => setCartDrawerOpen(true)} className="relative group cursor-pointer border-none bg-transparent outline-none">
                <ShoppingBag className="w-5 h-5 text-charcoal-300 group-hover:text-gold-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-charcoal-900 text-gold-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-gold-500/30 shadow-md transform group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Contact CTA */}
              <a
                href="/#contact"
                className="flex items-center space-x-2 bg-transparent hover:bg-gold-500/10 text-white hover:text-gold-500 border border-white/20 hover:border-gold-500/30 px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all duration-300"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Mobile Actions & Menu Trigger */}
            <div className="flex md:hidden items-center space-x-4">
              {/* Cart */}
              <button onClick={() => setCartDrawerOpen(true)} className="relative group border-none bg-transparent outline-none">
                <ShoppingBag className="w-5 h-5 text-charcoal-300 group-hover:text-gold-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-charcoal-900 text-gold-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-gold-500/30 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Menu Trigger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-charcoal-300 hover:text-gold-500 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden clean-navbar absolute top-full left-0 right-0 py-4 px-6 border-b border-white/5 shadow-2xl flex flex-col space-y-4 animate-in fade-in slide-in-from-top-5 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium tracking-wide text-charcoal-200 hover:text-gold-500 py-2 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
            {/* Search Input in Mobile menu */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Search crackers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-charcoal-800 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-gold-500 text-white"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 text-charcoal-400 hover:text-gold-500"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            {/* Contact CTA */}
            <a
              href="/#contact"
              className="flex items-center justify-center space-x-2 bg-charcoal-800 text-white border border-white/10 hover:border-gold-500/30 px-4 py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Us</span>
            </a>
          </div>
        )}
      </nav>

      {/* Desktop Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-[#0B0B0C]/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative glass-card border border-gold-500/20 max-w-xl w-full p-6 rounded-xl shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-wide text-gold-500">Search Catalog</h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-charcoal-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                  setSearchOpen(false);
                }
              }}
              className="relative"
            >
              <input
                type="text"
                placeholder="What are you looking for today? (e.g. Sparklers, Combos)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-charcoal-900 border border-gold-500/30 focus:border-gold-500 focus:glow-gold rounded-lg py-3.5 pl-4 pr-12 text-sm focus:outline-none text-white placeholder-charcoal-400"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-3.5 bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 p-1.5 rounded-md hover:opacity-90 transition-opacity"
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
