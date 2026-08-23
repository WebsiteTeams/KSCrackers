import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'KS Crackers — Premium Heritage Fireworks',
  description: 'Premium Sivakasi firecrackers with authentic heritage. Buy traditional sparklers, flower pots, rockets, and gift combos from India\'s fireworks capital.',
  metadataBase: new URL('https://kscrackers.com'),
  openGraph: {
    title: 'KS Crackers — Premium Heritage Fireworks',
    description: 'Authentic Sivakasi firecrackers with heritage craftsmanship. Premium sparklers, combos, and festive packages.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
