'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Warehouse,
  Tags,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Categories', href: '/admin/categories', icon: Tags },
      { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
    ],
  },
  {
    label: 'Insights',
    items: [
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  if (status === 'loading' && !isLoginPage) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center flex-col gap-4">
        <div className="w-10 h-10 border-4 border-burgundy-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">Loading...</span>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!session && !isLoginPage) return null;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };

  const initials = session?.user?.name
    ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-stone-200 shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        {/* Logo */}
        <div className={`border-b border-stone-100 shrink-0 ${collapsed ? 'p-4' : 'p-5'}`}>
          {collapsed ? (
            <Link href="/admin/dashboard" className="block w-10 h-10 bg-burgundy-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              KS
            </Link>
          ) : (
            <Link href="/admin/dashboard" className="block">
              <span className="text-lg font-bold text-burgundy-700 tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>KS CRACKERS</span>
              <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-medium mt-0.5">Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 px-3 mb-2 block">{section.label}</span>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center gap-3 text-sm py-2.5 rounded-lg transition-colors font-medium ${
                        collapsed ? 'justify-center px-2' : 'px-3'
                      } ${
                        isActive
                          ? 'bg-burgundy-50 text-burgundy-700'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-stone-100 px-3 py-3">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 text-xs text-stone-400 hover:text-stone-600 py-2 rounded-lg hover:bg-stone-50 transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? '-rotate-90' : 'rotate-90'}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* User Block */}
        <div className={`border-t border-stone-100 shrink-0 ${collapsed ? 'p-3' : 'p-4'}`}>
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">{initials}</div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs shrink-0">{initials}</div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-stone-900 truncate">{session?.user?.name || 'Administrator'}</span>
                <span className="block text-[10px] text-stone-400 truncate">{session?.user?.email || 'admin@kscrackers.com'}</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <Link href="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
                <span className="text-lg font-bold text-burgundy-700" style={{ fontFamily: 'var(--font-heading)' }}>KS CRACKERS</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-700"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 px-3 mb-2 block">{section.label}</span>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      const Icon = item.icon;
                      return (
                        <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg transition-colors font-medium ${isActive ? 'bg-burgundy-50 text-burgundy-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
                          <Icon className="w-4.5 h-4.5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-stone-100 p-4">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 text-sm py-2.5 px-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-4 lg:px-8 py-3 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="hidden lg:flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
            <Home className="w-3.5 h-3.5" /> View Store
          </Link>
          <div className="flex-1" />
          <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
