'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Phone, Mail, ChevronDown, KeyRound, CheckCircle } from 'lucide-react';

interface CountryConfig {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
  digits: number;
}

const COUNTRIES: CountryConfig[] = [
  { code: 'IN', flag: '🇮🇳', name: 'India', dialCode: '+91', digits: 10 },
  { code: 'AE', flag: '🇦🇪', name: 'United Arab Emirates', dialCode: '+971', digits: 9 },
  { code: 'US', flag: '🇺🇸', name: 'United States', dialCode: '+1', digits: 10 },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dialCode: '+44', digits: 10 },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia', dialCode: '+966', digits: 9 },
  { code: 'QA', flag: '🇶🇦', name: 'Qatar', dialCode: '+974', digits: 8 },
  { code: 'OM', flag: '🇴🇲', name: 'Oman', dialCode: '+968', digits: 8 },
  { code: 'KW', flag: '🇰🇼', name: 'Kuwait', dialCode: '+965', digits: 8 },
  { code: 'BH', flag: '🇧🇭', name: 'Bahrain', dialCode: '+973', digits: 8 },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore', dialCode: '+65', digits: 8 },
];

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Country Selection (Defaults to India +91)
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);

  // Inputs
  const [phoneDigits, setPhoneDigits] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');

  // OTP Login state
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signUpSendOTP, verifyOTP } = useAuth();
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selectedCountry.digits) {
      setPhoneDigits(raw);
    }
  };

  const handleCountryChange = (code: string) => {
    const found = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    setSelectedCountry(found);
    setPhoneDigits('');
    setError('');
  };

  // Validation Checkers
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim());
  const isPhoneValid = phoneDigits.length === selectedCountry.digits;
  const isIdentifierValid = authMode === 'email' ? isEmailValid : isPhoneValid;

  const currentIdentifier =
    authMode === 'email'
      ? emailInput.trim()
      : `${selectedCountry.dialCode} ${phoneDigits.trim()}`;

  // Password Sign In
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIdentifierValid) {
      if (authMode === 'email') {
        setError('Please enter a valid email address (e.g. username@gmail.com).');
      } else {
        setError(`Please enter exactly ${selectedCountry.digits} digits for ${selectedCountry.name} (${selectedCountry.dialCode}).`);
      }
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(currentIdentifier, password);
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

  // OTP Send
  const handleSendOTP = async () => {
    if (!isIdentifierValid) {
      if (authMode === 'email') {
        setError('Please enter a valid email address (e.g. username@gmail.com).');
      } else {
        setError(`Please enter exactly ${selectedCountry.digits} digits for ${selectedCountry.name} (${selectedCountry.dialCode}).`);
      }
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await signUpSendOTP(currentIdentifier, authMode === 'email');
      setSentOtpCode(res.generatedOtp);
      setOtpSent(true);
    } catch {
      setError('Failed to send OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Submit & Verification
  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const isValid = await verifyOTP(enteredOtp, sentOtpCode);
      if (isValid) {
        await login(currentIdentifier, 'authenticated_via_otp');
        router.push('/');
      } else {
        setError(`Invalid OTP code entered. Check code sent to ${currentIdentifier}.`);
      }
    } catch {
      setError('OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Mode Selector (Mobile Number vs Email) */}
        <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D8] text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('phone'); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'phone' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
            }`}
          >
            <Phone size={14} />
            <span>Mobile Number</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'email' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
            }`}
          >
            <Mail size={14} />
            <span>Email Address</span>
          </button>
        </div>

        {/* Sign In Options Toggle (Password vs OTP) */}
        <div className="flex justify-end gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setOtpSent(false); setError(''); }}
            className={loginMethod === 'password' ? 'text-[#1F3D2B] font-bold underline' : 'text-[#8A8A82]'}
          >
            Sign in with Password
          </button>
          <span className="text-[#8A8A82]">·</span>
          <button
            type="button"
            onClick={() => { setLoginMethod('otp'); setError(''); }}
            className={loginMethod === 'otp' ? 'text-[#1F3D2B] font-bold underline' : 'text-[#8A8A82]'}
          >
            Sign in with OTP
          </button>
        </div>

        {/* Identifier Input */}
        {authMode === 'phone' ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Login ID / Mobile ({selectedCountry.dialCode}) — Requires {selectedCountry.digits} Digits
            </label>
            
            <div className="flex gap-2">
              {/* Flag Selector (Defaults to India +91) */}
              <div className="relative shrink-0">
                <select
                  value={selectedCountry.code}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="appearance-none bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl px-3 py-3 pr-8 text-sm font-bold text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-4 text-[#8A8A82] pointer-events-none" />
              </div>

              <div className="relative flex-1">
                <input
                  type="tel"
                  value={phoneDigits}
                  onChange={handlePhoneChange}
                  placeholder="type here"
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B] tracking-wider font-mono"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-1.5 text-[11px]">
              <span className="text-[#8A8A82]">Country: {selectedCountry.flag} {selectedCountry.name}</span>
              <span className={`font-bold ${isPhoneValid ? 'text-[#3B6D11]' : 'text-amber-700'}`}>
                {phoneDigits.length} / {selectedCountry.digits} digits
              </span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Login ID / Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                <User size={18} />
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="type here"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
              />
            </div>
            <p className="text-[11px] text-[#8A8A82] mt-1">Must be valid format (e.g. username@gmail.com)</p>
          </div>
        )}

        {/* PASSWORD LOGIN FORM */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isIdentifierValid}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                isIdentifierValid
                  ? 'bg-[#1F3D2B] hover:bg-[#152a1d] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* OTP LOGIN FORM */}
        {loginMethod === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={isSubmitting || !isIdentifierValid}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                  isIdentifierValid
                    ? 'bg-[#1F3D2B] hover:bg-[#152a1d] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{isSubmitting ? 'Sending OTP...' : 'Send OTP to Sign In'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <form onSubmit={handleOtpVerifySubmit} className="space-y-4">
                <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#1F3D2B] p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-[#3B6D11] block flex items-center gap-1">
                    <CheckCircle size={14} /> OTP Sent to {currentIdentifier}
                  </span>
                  <p className="text-[11px]">
                    Enter verification OTP code: <strong className="font-mono text-base text-[#3B6D11]">{sentOtpCode}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                      <KeyRound size={18} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="enter code"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-lg font-bold tracking-widest text-center text-[#1F3D2B] font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || enteredOtp.length < 4}
                  className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        )}

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
    </div>
  );
}
