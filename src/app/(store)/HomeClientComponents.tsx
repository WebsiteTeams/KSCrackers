'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Testimonials Data
const TESTIMONIALS = [
  {
    name: 'Muthu Kumar',
    rating: 5,
    review: 'Excellent collection and very good festival offers. The quality of sparklers was top-notch, low smoke, and lasted long. The ordering experience was incredibly seamless!',
    location: 'Sivakasi, TN',
  },
  {
    name: 'Anjali Sharma',
    rating: 5,
    review: 'The gift boxes are beautifully packaged and contain a perfect assortment. Safe for kids and worth every rupee. Definitely buying from KS Crackers again next Diwali.',
    location: 'Bangalore, KA',
  },
  {
    name: 'Rajesh Patel',
    rating: 5,
    review: 'Excellent customer service. I had some queries regarding custom combos and the support team answered within minutes. Prompt pickup setup and great packing.',
    location: 'Chennai, TN',
  },
];

// FAQs Data
const FAQS = [
  {
    question: 'How can I place an order?',
    answer: 'Browse our collection, add items to your cart, and click "Proceed to Checkout". After filling in your contact details, you can confirm your order online. Our support team will then contact you to finalize payment and dispatch!',
  },
  {
    question: 'Do you provide delivery?',
    answer: 'Yes, we provide safe courier delivery services across selected states in India. Shipping charges and delivery times depend on your pincode. We ensure secure, double-layered packaging compliant with explosive cargo standards.',
  },
  {
    question: 'Is pickup available?',
    answer: 'Absolutely! If you reside in or near Sivakasi, you can select the "Pickup" option during checkout. Once your order is packaged and ready, we will notify you with the pickup location and timings.',
  },
  {
    question: 'How can I check product availability?',
    answer: 'All product stock levels are updated in real-time on our website. Items showing "Out of Stock" can still be enquired about via our contact form, as we regularly restock during the festive season.',
  },
  {
    question: 'How can I contact the shop?',
    answer: 'You can call us directly at +91 98765 43210, email us at support@kscrackers.com, or use the contact form below to send us a message.',
  },
  {
    question: 'What payment methods are available?',
    answer: 'We support UPI (GPay, PhonePe, Paytm), Direct Bank Transfer, and cash/card at the pickup store.',
  },
  {
    question: 'Are bulk orders available?',
    answer: 'Yes! We offer special bulk pricing discounts for corporate gifts, residential societies, and large family events. Reach out via our Contact form to request a custom bulk price quote.',
  },
];

export default function HomeClientComponents() {
  // Testimonial State
  const [activeSlide, setActiveSlide] = useState(0);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all contact fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    toast.success('Thank you for getting in touch!', {
      description: "We've received your message and will respond shortly.",
      icon: <Sparkles className="w-4 h-4 text-gold-500" />,
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      {/* 9. Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Customer Reviews
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            WORDS FROM CELEBRATORS
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Slider Area */}
          <div className="glass-card border border-white/5 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(TESTIMONIALS[activeSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-lg md:text-xl text-charcoal-200 leading-relaxed font-medium italic">
                  "{TESTIMONIALS[activeSlide].review}"
                </blockquote>

                {/* Profile */}
                <div className="pt-2">
                  <cite className="not-italic font-bold text-white text-base block">
                    {TESTIMONIALS[activeSlide].name}
                  </cite>
                  <span className="text-xs text-gold-500 font-semibold tracking-wide">
                    {TESTIMONIALS[activeSlide].location}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider controls */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-full bg-charcoal-800 hover:bg-charcoal-700 border border-white/5 hover:border-gold-500/20 text-charcoal-300 hover:text-gold-500 transition-all cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSlide === i ? 'bg-gold-500 w-5' : 'bg-charcoal-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-full bg-charcoal-800 hover:bg-charcoal-700 border border-white/5 hover:border-gold-500/20 text-charcoal-300 hover:text-gold-500 transition-all cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. FAQ Accordions */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Got Questions?
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card border border-white/5 rounded-xl overflow-hidden hover:border-gold-500/10 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white text-sm sm:text-base hover:text-gold-500 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-500 transition-transform duration-300 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-sm text-charcoal-300 leading-relaxed font-medium border-t border-white/5 bg-charcoal-900/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-gold-500 font-bold">
            Connect With Us
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            GET IN TOUCH
          </p>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-2xl border border-white/5 space-y-8 flex flex-col justify-between shadow-lg">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-wide">
                Office Information
              </h3>
              <p className="text-sm text-charcoal-300 leading-relaxed font-medium">
                Visit our showroom in Sivakasi or contact us online. We are operational throughout the year for major celebrations, marriages, and festive seasons.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-sm text-charcoal-300">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <span>12/A, Bypass Main Road, Sivakasi, Tamil Nadu, 626123</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-charcoal-300">
                  <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-charcoal-300">
                  <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>support@kscrackers.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-charcoal-300">
                  <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                  <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <a
              href="mailto:support@kscrackers.com"
              className="flex items-center justify-center space-x-2 bg-charcoal-800 hover:bg-charcoal-700 text-gold-500 border border-gold-500/20 py-3 rounded-lg text-sm font-semibold tracking-wide transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support Inquiry</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-lg">
            <h3 className="text-xl font-bold text-white tracking-wide mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  Message Details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="How can we help you celebrate today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-[#0B0B0C] font-bold py-3 rounded-lg uppercase tracking-wider text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
