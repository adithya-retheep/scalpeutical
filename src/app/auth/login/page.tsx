'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';

function LoginForm() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [registeredNotice, setRegisteredNotice] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isReg = searchParams.get('registered');
    const paramLoginId = searchParams.get('loginId');

    if (isReg === 'true') {
      setRegisteredNotice(true);
      if (paramLoginId) {
        setLoginId(paramLoginId);
      }
    }
  }, [searchParams]);

  // Password Sign In
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setError('Please enter your Login ID.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(loginId.trim(), password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
      
      {/* Header Logo & Title */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full border-2 border-[#D4AF6A]/40 overflow-hidden mx-auto bg-white shadow-2xs p-1">
          <Image
            src="/logo.jpeg"
            alt="Scalpeutical Logo"
            width={64}
            height={64}
            className="object-cover w-full h-full rounded-full"
            priority
          />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Sign In</h2>
        <p className="text-xs text-[#8A8A82]">
          Sign in to access your digital scalp monitoring portal
        </p>
      </div>

      {registeredNotice && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#1F3D2B] p-3.5 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-[#3B6D11] flex items-center gap-1.5">
            <CheckCircle size={16} /> Account Registered Successfully!
          </span>
          <p className="text-[11px] text-[#5F5E5A]">
            Please enter your password below to sign in.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CLEAN SIGN IN FORM (LOGIN ID & PASSWORD) */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
            Login ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
              <User size={18} />
            </div>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="type here"
              className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
              required
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
              className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !loginId.trim()}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
            loginId.trim()
              ? 'bg-[#1F3D2B] hover:bg-[#152a1d] text-white cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="pt-4 border-t border-[#E5E2D8] text-center space-y-2">
        <p className="text-xs text-[#5F5E5A]">
          New to Scalpeutical?{' '}
          <Link href="/auth/signup" className="text-[#1F3D2B] font-bold underline hover:text-[#3B6D11]">
            Register
          </Link>
        </p>
      </div>

      <div className="bg-[#EAF0E7] p-3 rounded-xl text-[11px] text-[#1F3D2B] text-center flex items-center justify-center gap-1.5 font-medium">
        <ShieldCheck size={14} className="text-[#3B6D11]" />
        <span>Protected Clinical Encryption · Firebase Auth Verified</span>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full flex items-center justify-center py-6 px-4">
      <Suspense fallback={<div className="text-xs text-[#8A8A82]">Loading login portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
