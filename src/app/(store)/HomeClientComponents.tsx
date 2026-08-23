'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, MapPin, Phone, Mail, Clock, Send, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const TESTIMONIALS = [
  {
    name: 'Muthu Kumar',
    rating: 5,
    review: 'Excellent collection and very good festival offers. The sparklers were top-notch — low smoke, long-lasting, and safe for the family.',
    location: 'Sivakasi, TN',
  },
  {
    name: 'Anjali Sharma',
    rating: 5,
    review: 'The gift boxes are beautifully packaged with a perfect assortment. Safe for kids and worth every rupee. Buying again next Diwali.',
    location: 'Bangalore, KA',
  },
  {
    name: 'Rajesh Patel',
    rating: 5,
    review: 'Great customer service. Quick response on custom combos, prompt pickup setup, and excellent packing quality.',
    location: 'Chennai, TN',
  },
];

const FAQS = [
  { question: 'How do I place an order?', answer: 'Browse our collection, add items to your cart, and proceed to checkout. Fill in your contact details and our team will reach out to confirm payment and dispatch.' },
  { question: 'Do you provide delivery?', answer: 'Yes, we deliver across selected states via specialized cargo. Shipping charges depend on your pincode. We ensure secure, compliant packaging for safe transport.' },
  { question: 'Is pickup available?', answer: 'If you\'re near Sivakasi, select "Store Pickup" during checkout. We\'ll notify you when your order is ready with pickup location and timings.' },
  { question: 'How can I check stock availability?', answer: 'Stock levels are updated in real-time. Items showing "Out of Stock" can be enquired about via our contact form — we restock regularly during festive season.' },
  { question: 'What payment methods are accepted?', answer: 'We support UPI (GPay, PhonePe, Paytm), bank transfer, and cash/card at our pickup store.' },
  { question: 'Are bulk orders available?', answer: 'Yes! We offer special pricing for corporate gifts, societies, and large events. Contact us for a custom quote.' },
];

export default function HomeClientComponents() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    toast.success('Message sent! We\'ll get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* Testimonials */}
      <section className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Reviews</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Words from Celebrators
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-stone-200 p-8 md:p-10 min-h-[200px] flex flex-col justify-between shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex gap-0.5">
                    {[...Array(TESTIMONIALS[activeSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-copper-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-stone-700 leading-relaxed italic" style={{ fontFamily: 'var(--font-heading)' }}>
                    &ldquo;{TESTIMONIALS[activeSlide].review}&rdquo;
                  </blockquote>
                  <div>
                    <cite className="not-italic font-semibold text-stone-900 text-sm block">
                      {TESTIMONIALS[activeSlide].name}
                    </cite>
                    <span className="text-xs text-stone-500">{TESTIMONIALS[activeSlide].location}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setActiveSlide((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-burgundy-700 hover:border-burgundy-200 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${activeSlide === i ? 'w-6 bg-burgundy-600' : 'w-1.5 bg-stone-300'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveSlide((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))}
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-burgundy-700 hover:border-burgundy-200 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-gap bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Support</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-stone-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaqIdx === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-gap">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Connect</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
              Get in Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Info */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-8 shadow-sm space-y-6">
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Office</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Visit our showroom in Sivakasi or contact us online. We operate year-round for celebrations, weddings, and festivals.
                </p>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 text-sm text-stone-600">
                    <MapPin className="w-4 h-4 text-burgundy-600 shrink-0 mt-0.5" />
                    <span>12/A, Bypass Main Road, Sivakasi, Tamil Nadu 626123</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <Phone className="w-4 h-4 text-burgundy-600 shrink-0" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <Mail className="w-4 h-4 text-burgundy-600 shrink-0" />
                    <span>support@kscrackers.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-600">
                    <Clock className="w-4 h-4 text-burgundy-600 shrink-0" />
                    <span>Mon — Sat: 9 AM — 8 PM</span>
                  </div>
                </div>
              </div>
              <a
                href="mailto:support@kscrackers.com"
                className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-stone-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Send a Message</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 resize-none placeholder-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-sm hover:bg-burgundy-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
