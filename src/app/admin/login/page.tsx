'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LinkNext from 'next/link';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password.'); return; }
    setLoading(true);
    const toastId = toast.loading('Authenticating...');
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      toast.dismiss(toastId);
      if (res?.error) {
        toast.error('Invalid credentials.');
      } else {
        toast.success('Access granted. Redirecting...');
        setTimeout(() => { router.push('/admin/dashboard'); router.refresh(); }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.dismiss(toastId);
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 space-y-2">
          <LinkNext href="/" className="inline-block text-2xl font-bold tracking-wider text-burgundy-700" style={{ fontFamily: 'var(--font-heading)' }}>
            KS CRACKERS
          </LinkNext>
          <span className="block text-xs uppercase tracking-wider text-stone-500 font-medium">Administrative Portal</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-stone-900 text-center" style={{ fontFamily: 'var(--font-heading)' }}>Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-stone-400"><Mail className="w-4 h-4" /></span>
                <input type="email" placeholder="admin@kscrackers.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-stone-400"><Lock className="w-4 h-4" /></span>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-sm hover:bg-burgundy-800 transition-colors disabled:opacity-50">
              {loading ? 'Authorizing...' : 'Log In'}
            </button>
          </form>

          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-1.5 text-xs text-stone-500">
            <span className="text-stone-700 font-semibold uppercase tracking-wider block flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4" /> Demo Credentials
            </span>
            <p className="flex justify-between"><span>Email:</span><span className="text-stone-900 font-semibold">admin@kscrackers.com</span></p>
            <p className="flex justify-between"><span>Password:</span><span className="text-stone-900 font-semibold">admin123</span></p>
          </div>
        </div>

        <div className="text-center mt-6">
          <LinkNext href="/" className="text-xs text-stone-500 hover:text-burgundy-700 transition-colors">Return to store</LinkNext>
        </div>
      </div>
    </div>
  );
}
