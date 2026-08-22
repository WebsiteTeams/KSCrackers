import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Fireworks from '@/components/Fireworks';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Fireworks />
      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
