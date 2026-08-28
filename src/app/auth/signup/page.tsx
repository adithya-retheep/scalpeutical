'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Phone, Mail, User, Lock, KeyRound, ArrowRight, CheckCircle, RefreshCw, ShieldCheck, AlertCircle, ChevronDown, BellRing, Copy, Sparkles, MessageSquare } from 'lucide-react';

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

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');

  // Country Selection (Defaults to India +91)
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);

  // Step 1 Inputs
  const [fullName, setFullName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [emailInput, setEmailInput] = useState('');

  // Generated OTP state & Pop-Up Modal State
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  // Step 2 State (OTP)
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Step 3 State (Credentials)
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUpSendOTP, verifyOTP, setCredentials } = useAuth();
  const router = useRouter();

  // Handle phone digits change according to chosen flag format
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selectedCountry.digits) {
      setPhoneDigits(raw);
    }
  };

  // Switch country flag and reset phone digits
  const handleCountryChange = (countryCode: string) => {
    const found = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
    setSelectedCountry(found);
    setPhoneDigits('');
    setError('');
  };

  // Validation Checkers
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim());
  const isPhoneValid = phoneDigits.length === selectedCountry.digits;
  const canSendOtp = authMode === 'email' ? isEmailValid : (isPhoneValid && fullName.trim().length > 0);

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle Step 1 Submission (Send OTP & Open Pop-Up Modal)
  const handleStep1SendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendOtp) {
      if (authMode === 'email') {
        setError('Please enter a valid email address (e.g. username@gmail.com).');
      } else {
        setError(`Please enter exactly ${selectedCountry.digits} digits for ${selectedCountry.name} (${selectedCountry.dialCode}).`);
      }
      return;
    }

    setError('');
    setIsLoading(true);

    const fullIdentifier =
      authMode === 'email'
        ? emailInput.trim()
        : `${selectedCountry.dialCode} ${phoneDigits.trim()}`;

    setTargetIdentifier(fullIdentifier);

    try {
      const res = await signUpSendOTP(fullIdentifier, authMode === 'email');
      setSentOtpCode(res.generatedOtp);
      setStep(2);
      setShowOtpModal(true); // Open Pop-Up Message Modal!
      setResendTimer(30);
      setIsResendDisabled(true);
    } catch {
      setError('Failed to send verification OTP code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2 Submission (OTP Verification)
  const handleStep2VerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const isValid = await verifyOTP(otpCode, sentOtpCode);
      if (isValid) {
        setLoginId(targetIdentifier);
        setStep(3);
        setShowOtpModal(false);
      } else {
        setError(`Invalid OTP code entered. Please check the code sent to ${targetIdentifier}.`);
      }
    } catch {
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 3 Submission (Set Credentials & Redirect Back to Sign In)
  const handleStep3SetCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please provide both Login ID and Password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await setCredentials(loginId, password, fullName);
      // Once created, redirect back to Sign In page so user logs in with new credentials!
      router.push(`/auth/login?registered=true&loginId=${encodeURIComponent(loginId)}`);
    } catch {
      setError('Failed to complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await signUpSendOTP(targetIdentifier, authMode === 'email');
      setSentOtpCode(res.generatedOtp);
      setShowOtpModal(true); // Open Pop-Up Message Modal again!
      setResendTimer(30);
      setIsResendDisabled(true);
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 relative">
      
      {/* POP-UP MESSAGE MODAL DIALOG */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-full bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] flex items-center justify-center mx-auto text-2xl shadow-2xs">
              💬
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">OTP Code Message</h3>
              <p className="text-xs text-[#5F5E5A]">
                Verification code dispatched for <strong className="font-mono text-[#1F3D2B]">{targetIdentifier}</strong>
              </p>
            </div>

            <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A82]">Your 6-Digit OTP Code</span>
              <div className="font-mono text-3xl font-extrabold tracking-widest text-[#3B6D11]">
                {sentOtpCode}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setOtpCode(sentOtpCode);
                  setShowOtpModal(false);
                }}
                className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Auto-Fill Code & Continue</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full py-2 text-xs font-semibold text-[#8A8A82] hover:text-[#5F5E5A]"
              >
                Close Pop-Up
              </button>
            </div>

          </div>
        </div>
      )}

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
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Create Your Account</h2>
          <p className="text-xs text-[#8A8A82]">
            Register to start tracking your scalp-care journey
          </p>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-4 text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1F3D2B]' : 'text-[#8A8A82]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#1F3D2B] text-white' : 'bg-gray-200'}`}>1</span>
            <span>Register</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1F3D2B]' : 'text-[#8A8A82]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#1F3D2B] text-white' : 'bg-gray-200'}`}>2</span>
            <span>OTP Verify</span>
          </div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#1F3D2B]' : 'text-[#8A8A82]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#1F3D2B] text-white' : 'bg-gray-200'}`}>3</span>
            <span>Password</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: Registration with Country Flag Selector & Validation */}
        {step === 1 && (
          <form onSubmit={handleStep1SendOTP} className="space-y-4">
            
            {/* Mode Selector (Mobile Number vs Email) */}
            <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D8] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('phone'); setError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'phone' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
                }`}
              >
                <Phone size={14} />
                <span>Mobile Number</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('email'); setError(''); }}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'email' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
                }`}
              >
                <Mail size={14} />
                <span>Email Address</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="type here"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            {authMode === 'phone' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                  Mobile Number ({selectedCountry.dialCode}) — Requires {selectedCountry.digits} Digits
                </label>
                
                <div className="flex gap-2">
                  {/* Country Flag Selector (Defaults to India +91) */}
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

                  {/* Phone Input with dynamic format matching chosen country flag */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      placeholder={`${selectedCountry.digits} digits...`}
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
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                    <Mail size={18} />
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

            <button
              type="submit"
              disabled={isLoading || !canSendOtp}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                canSendOtp
                  ? 'bg-[#1F3D2B] hover:bg-[#152a1d] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isLoading ? 'Sending OTP...' : 'Send OTP Verification Code'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Verification of Sent OTP */}
        {step === 2 && (
          <form onSubmit={handleStep2VerifyOTP} className="space-y-4">
            <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl text-center space-y-1">
              <span className="text-xs text-[#8A8A82]">Verification Target:</span>
              <p className="font-bold text-sm text-[#1F3D2B] font-mono">{targetIdentifier}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A]">
                  Enter 6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(true)}
                  className="text-xs text-[#3B6D11] font-bold hover:underline flex items-center gap-1"
                >
                  <MessageSquare size={12} /> View Pop-Up Message
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="enter code"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-lg font-bold tracking-widest text-center text-[#1F3D2B] font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length < 4}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying OTP...' : 'Verify OTP & Continue'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex justify-between items-center text-xs pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#5F5E5A] hover:underline"
              >
                Change {authMode === 'email' ? 'Email' : 'Number'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResendDisabled || isLoading}
                className="text-[#D4AF6A] font-bold hover:underline disabled:opacity-40 flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>{isResendDisabled ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Password & Credentials Creation */}
        {step === 3 && (
          <form onSubmit={handleStep3SetCredentials} className="space-y-4">
            <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 p-3.5 rounded-2xl text-xs text-[#3B6D11] font-bold flex items-center gap-2">
              <CheckCircle size={16} />
              <span>OTP Verified Successfully! Set your login password.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Your Scalpeutical Login ID
              </label>
              <input
                type="text"
                readOnly
                value={loginId}
                className="w-full px-4 py-3 bg-gray-100 border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Set Account Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8A82]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration & Go to Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E5E2D8] text-center">
          <p className="text-xs text-[#5F5E5A]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#1F3D2B] font-bold underline hover:text-[#3B6D11]">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
