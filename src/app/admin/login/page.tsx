'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/router'; // wait, in Next.js App Router we use next/link
import LinkNext from 'next/link';
import { Lock, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating admin...');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      toast.dismiss(toastId);

      if (res?.error) {
        toast.error('Invalid administrative credentials.');
      } else {
        toast.success('Access granted. Redirecting to dashboard...', {
          icon: <Sparkles className="w-4 h-4 text-gold-500" />,
        });
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.dismiss(toastId);
      toast.error('Authentication process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 space-y-2">
          <LinkNext href="/" className="inline-block text-2xl font-bold tracking-wider text-gradient-gold">
            KS CRACKERS
          </LinkNext>
          <span className="block text-xs uppercase tracking-widest text-charcoal-400 font-semibold">
            Administrative Portal
          </span>
        </div>

        <div className="glass-card border border-white/5 rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Sign In</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-450">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-charcoal-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="admin@kscrackers.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-450">Secret Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-charcoal-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-charcoal-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-500 placeholder-charcoal-650"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-500 text-charcoal-900 font-bold py-3 rounded-lg text-sm uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Authorizing...' : 'Log In to System'}
            </button>
          </form>

          {/* Test credentials banner */}
          <div className="bg-charcoal-900/60 p-4 rounded-xl border border-white/5 space-y-1.5 text-xs text-charcoal-400 font-medium">
            <span className="text-gold-500 font-bold uppercase tracking-wider block flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4" /> Demo login credentials:
            </span>
            <p className="flex justify-between">
              <span>Email:</span>
              <span className="text-white font-bold">admin@kscrackers.com</span>
            </p>
            <p className="flex justify-between">
              <span>Password:</span>
              <span className="text-white font-bold">admin123</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <LinkNext href="/" className="text-xs text-charcoal-400 hover:text-gold-500 transition-colors">
            Return to e-commerce store
          </LinkNext>
        </div>
      </div>
    </div>
  );
}
