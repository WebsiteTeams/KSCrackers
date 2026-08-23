'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span className="text-lg font-bold text-cream-50" style={{ fontFamily: 'var(--font-heading)' }}>
                KS Crackers
              </span>
              <p className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">
                Heritage Fireworks
              </p>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Premium firecrackers from Sivakasi — India's fireworks capital. Crafted with tradition, delivered with care.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:text-burgundy-400 hover:bg-stone-700 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:text-burgundy-400 hover:bg-stone-700 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-cream-50 uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop', href: '/shop' },
                { name: 'Special Offers', href: '/#offers' },
                { name: 'Gift Combos', href: '/#combos' },
                { name: 'FAQ', href: '/#faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-stone-400 hover:text-cream-100 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold text-cream-50 uppercase tracking-wider mb-5">
              Policies
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms & Conditions', href: '#' },
                { name: 'Safety Guidelines', href: '/#faq' },
                { name: 'Delivery Information', href: '/#faq' },
                { name: 'Admin Portal', href: '/admin/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-stone-400 hover:text-cream-100 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-cream-50 uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-stone-400">
                <MapPin className="w-4 h-4 text-burgundy-400 shrink-0 mt-0.5" />
                <span>12/A, Bypass Main Road, Sivakasi, Tamil Nadu 626123</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-burgundy-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-burgundy-400 shrink-0" />
                <span>support@kscrackers.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {currentYear} KS Crackers. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>Secure Checkout</span>
            <span className="text-stone-700">|</span>
            <span>Authentic Sivakasi Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
