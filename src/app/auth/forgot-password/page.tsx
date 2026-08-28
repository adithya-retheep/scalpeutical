'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrPhone) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-[#D4AF6A]/40 overflow-hidden mx-auto bg-white p-1">
            <Image src="/logo.jpeg" alt="Logo" width={56} height={56} className="object-cover w-full h-full rounded-full" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Reset Password</h2>
          <p className="text-xs text-[#8A8A82]">
            Enter your registered Login ID or Mobile Number to receive password reset instructions
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 rounded-2xl p-5 text-center space-y-3">
            <CheckCircle2 size={32} className="text-[#3B6D11] mx-auto" />
            <h3 className="font-bold text-base text-[#1F3D2B]">Reset Instructions Sent</h3>
            <p className="text-xs text-[#5F5E5A]">
              We have dispatched password recovery instructions to <strong>{emailOrPhone}</strong> via SMS / Email verification.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-2 bg-[#1F3D2B] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Login ID or Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. adithya@scalpeutical.app"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-xs"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E5E2D8] text-center">
          <Link href="/auth/login" className="text-xs text-[#5F5E5A] font-semibold hover:text-[#1F3D2B] flex items-center justify-center gap-1">
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
