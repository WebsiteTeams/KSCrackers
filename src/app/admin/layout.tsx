'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  LogOut,
  Home
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  // Protect Admin dashboard routes (excluding login page itself)
  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  // Handle loading states
  if (status === 'loading' && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center flex-col space-y-4">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-charcoal-400 font-bold uppercase tracking-widest">
          Validating session access...
        </span>
      </div>
    );
  }

  // If we are on the login page, just render the child login panel directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not login page, prevent flash of layout
  if (!session && !isLoginPage) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'E-commerce Shop', href: '/', icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col md:flex-row">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-charcoal-900 border-r border-white/5 p-6 shrink-0 justify-between">
        <div className="space-y-8">
          {/* Logo block */}
          <div className="border-b border-white/5 pb-4">
            <Link href="/" className="text-xl font-bold tracking-wider text-gradient-gold">
              KS CRACKERS
            </Link>
            <span className="block text-[9px] uppercase tracking-widest text-charcoal-400 font-bold mt-1">
              Store Manager Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 text-sm py-3 px-4 rounded-lg transition-all font-semibold ${
                    isActive
                      ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                      : 'text-charcoal-350 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block and Logout */}
        <div className="border-t border-white/5 pt-4 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gold-600/15 border border-gold-500/30 flex items-center justify-center font-bold text-gold-400 text-xs">
              AD
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white truncate">Administrator</span>
              <span className="block text-[9px] text-charcoal-450 truncate">admin@kscrackers.com</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-sm py-3 px-4 rounded-lg text-red-400 hover:bg-red-950/20 transition-all font-semibold cursor-pointer border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Header */}
      <header className="md:hidden bg-charcoal-900 border-b border-white/5 py-4 px-6 flex items-center justify-between shrink-0">
        <Link href="/" className="text-lg font-bold tracking-wider text-gradient-gold">
          KS CRACKERS
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-950/20 text-red-400 rounded-lg border border-red-500/10 hover:bg-red-950/30 transition-all cursor-pointer"
          aria-label="Logout"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* 3. Main Dashboard Content Wrapper */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
