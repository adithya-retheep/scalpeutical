'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, demoLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter both Login ID and password.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(loginId, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    await demoLogin();
    router.push('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF6A]/40 overflow-hidden mx-auto bg-white shadow-2xs p-1">
            <Image
              src="/logo.jpeg"
              alt="Scalpeutical Logo"
              width={64}
              height={64}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Welcome Back</h2>
          <p className="text-xs text-[#8A8A82]">
            Sign in to access your digital scalp monitoring portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Login ID / Mobile Identifier
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                <User size={18} />
              </div>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. adithya@scalpeutical.app"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] focus:ring-1 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A]">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#D4AF6A] font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] focus:ring-1 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Returning User Quick Access */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isSubmitting}
            className="w-full bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles size={14} className="text-[#D4AF6A]" />
            <span>Sign In as Returning User (Demo Account)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#E5E2D8] text-center space-y-2">
          <p className="text-xs text-[#5F5E5A]">
            New to Scalpeutical?{' '}
            <Link href="/auth/signup" className="text-[#1F3D2B] font-bold underline hover:text-[#3B6D11]">
              Register Mobile Number (New User Flow)
            </Link>
          </p>
        </div>

        <div className="bg-[#EAF0E7] p-3 rounded-xl text-[11px] text-[#1F3D2B] text-center flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck size={14} className="text-[#3B6D11]" />
          <span>Protected Clinical Encryption · Firebase Auth Verified</span>
        </div>

      </div>
    </div>
  );
}
