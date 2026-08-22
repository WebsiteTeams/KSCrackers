import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'KS Crackers — Premium Festive Firecrackers',
  description: 'Design and develop a premium, highly interactive and conversion-focused firecracker e-commerce experience. Buy traditional sparklers, flower pots, rockets, and gift combos online.',
  metadataBase: new URL('https://kscrackers.com'),
  openGraph: {
    title: 'KS Crackers — Premium Festive Firecrackers',
    description: 'Experience Diwali like never before with premium quality sparklers, combos, and ground wheels.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} dark`}>
      <body className="bg-[#0B0B0D] text-[#F7F5F0] min-h-screen antialiased flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
