'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1D1D20',
            color: '#F3F4F6',
            borderColor: '#E5A93B',
          },
        }}
      />
    </SessionProvider>
  );
}
