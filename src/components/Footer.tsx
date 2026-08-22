'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 border-t border-white/5 pt-16 pb-8 relative z-10">
      {/* Decorative top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold tracking-wider text-gradient-gold">
              KS CRACKERS
            </span>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              Elevating Indian festive celebrations with state-of-the-art, premium firecrackers. Delivering brightness, safety, and joy straight to your home.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-400 hover:text-gold-500 transition-colors p-2 bg-charcoal-800 rounded-lg hover:glow-gold flex items-center justify-center"
                aria-label="Follow us on Instagram"
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
                className="text-charcoal-400 hover:text-gold-500 transition-colors p-2 bg-charcoal-800 rounded-lg hover:glow-gold flex items-center justify-center"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-500 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop Catalog', href: '/shop' },
                { name: 'Special Offers', href: '/#offers' },
                { name: 'Festive Combos', href: '/#combos' },
                { name: 'FAQ & Help', href: '/#faq' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Policy links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-500 mb-6">
              Policies
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms & Conditions', href: '#' },
                { name: 'Safety Instructions', href: '/#faq' },
                { name: 'Delivery & Shipping', href: '/#faq' },
                { name: 'Admin Dashboard', href: '/admin/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-500 mb-6">
              Contact Shop
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-charcoal-400">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <span>12/A, Bypass Main Road, Sivakasi, Tamil Nadu, 626123</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-charcoal-400">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-charcoal-400">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>support@kscrackers.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <p className="text-xs text-charcoal-500">
            &copy; {currentYear} KS Crackers. All Rights Reserved. Designed for premium festive experiences.
          </p>
          <div className="flex items-center space-x-3 text-xs text-charcoal-500">
            <span>Secure Online Checkout</span>
            <span>•</span>
            <span>Genuine Sivakasi products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
