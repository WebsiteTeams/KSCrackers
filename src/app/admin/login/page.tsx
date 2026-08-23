'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LinkNext from 'next/link';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles, Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        toast.error('Invalid credentials. Please try again.');
        setErrors({ email: 'Invalid email or password' });
      } else {
        toast.success('Welcome back!');
        setTimeout(() => { router.push('/admin/dashboard'); router.refresh(); }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Package, text: 'Manage Inventory' },
    { icon: TrendingUp, text: 'Track Revenue' },
    { icon: Sparkles, text: 'Fulfill Orders' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side — Brand Story (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] bg-burgundy-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/30 rounded-full" />
          <div className="absolute bottom-32 right-16 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-white/10 rounded-full" />
        </div>

        <div className="relative z-10">
          <LinkNext href="/" className="inline-block">
            <span className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>KS CRACKERS</span>
            <span className="block text-xs uppercase tracking-widest text-burgundy-200 font-medium mt-1">Premium Sivakasi Fireworks</span>
          </LinkNext>
        </div>

        <div className="relative z-10 space-y-10">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Manage Your<br />Store with Clarity
          </h1>

          <div className="space-y-4">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-burgundy-200 text-xs">&copy; {new Date().getFullYear()} KS Crackers. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-cream-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <LinkNext href="/" className="inline-block">
              <span className="text-2xl font-bold text-burgundy-700" style={{ fontFamily: 'var(--font-heading)' }}>KS CRACKERS</span>
              <span className="block text-[10px] uppercase tracking-wider text-stone-400 font-medium mt-1">Admin Portal</span>
            </LinkNext>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Admin Access</h2>
            <p className="text-sm text-stone-500">Sign in to manage your store operations.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-stone-400"><Mail className="w-4 h-4" /></span>
                <input
                  type="email"
                  placeholder="admin@kscrackers.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
                  className={`w-full bg-white border rounded-lg py-3 pl-11 pr-4 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 transition-colors ${errors.email ? 'border-red-400' : 'border-stone-200'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-stone-400"><Lock className="w-4 h-4" /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                  className={`w-full bg-white border rounded-lg py-3 pl-11 pr-11 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-500/10 placeholder-stone-400 transition-colors ${errors.password ? 'border-red-400' : 'border-stone-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-xs text-burgundy-600 hover:text-burgundy-800 font-medium">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-burgundy-700 text-white font-semibold py-3 rounded-lg text-sm hover:bg-burgundy-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-white border border-stone-200 rounded-lg p-4 space-y-2">
            <span className="text-stone-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-burgundy-600" /> Demo Credentials
            </span>
            <div className="flex justify-between text-xs text-stone-500">
              <span>Email:</span>
              <span className="text-stone-900 font-medium">admin@kscrackers.com</span>
            </div>
            <div className="flex justify-between text-xs text-stone-500">
              <span>Password:</span>
              <span className="text-stone-900 font-medium">admin123</span>
            </div>
          </div>

          <div className="text-center">
            <LinkNext href="/" className="text-xs text-stone-400 hover:text-burgundy-600 transition-colors">← Back to store</LinkNext>
          </div>
        </div>
      </div>
    </div>
  );
}
