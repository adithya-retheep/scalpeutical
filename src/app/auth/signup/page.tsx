'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Phone, User, Lock, KeyRound, ArrowRight, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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

  const { signUpPhone, verifyOTP, setCredentials } = useAuth();
  const router = useRouter();

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

  // Handle Step 1 Submission
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) {
      setError('Please provide your full name and valid phone number.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signUpPhone(fullName, phoneNumber);
      setStep(2);
      setResendTimer(30);
      setIsResendDisabled(true);
    } catch {
      setError('Failed to send SMS verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2 Submission (OTP Verification)
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setError('Please enter a valid 4-6 digit SMS OTP code.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const isValid = await verifyOTP(otpCode);
      if (isValid) {
        setLoginId(`${fullName.toLowerCase().replace(/\s+/g, '')}@scalpeutical.app`);
        setStep(3);
      } else {
        setError('Invalid OTP code. Try entering 123456 for demo verification.');
      }
    } catch {
      setError('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 3 Submission (Set Credentials)
  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please provide both Login ID and Password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await setCredentials(loginId, password);
      router.push('/profile'); // Proceed to Profile Setup
    } catch {
      setError('Failed to create account credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendTimer(30);
    setIsResendDisabled(true);
    setError('A new 6-digit OTP code has been sent via SMS.');
    await signUpPhone(fullName, phoneNumber);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-[#D4AF6A]/40 overflow-hidden mx-auto bg-white p-1">
            <Image src="/logo.jpeg" alt="Logo" width={56} height={56} className="object-cover w-full h-full rounded-full" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Create Account</h2>
          <p className="text-xs text-[#8A8A82]">
            Step {step} of 3 — {step === 1 ? 'Mobile Registration' : step === 2 ? 'OTP Verification' : 'Set Credentials'}
          </p>
        </div>

        {/* Multi-step Stepper Indicator */}
        <div className="flex items-center justify-between px-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#8A8A82] border border-[#E5E2D8]'}`}>1</div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-[#1F3D2B]' : 'bg-[#E5E2D8]'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#8A8A82] border border-[#E5E2D8]'}`}>2</div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-[#1F3D2B]' : 'bg-[#E5E2D8]'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#8A8A82] border border-[#E5E2D8]'}`}>3</div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Name & Phone Number */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ann Maria Devassy"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Phone Number (SMS Verification)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Send SMS Verification Code</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-3 rounded-xl text-xs text-[#5F5E5A]">
              Verification code sent to <strong>{phoneNumber}</strong>. For quick testing, enter demo code <strong>123456</strong>.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1 2 3 4 5 6"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-center text-lg font-mono font-bold tracking-widest text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8A8A82]">
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Code expired'}
              </span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResendDisabled}
                className="text-[#1F3D2B] font-bold hover:underline disabled:opacity-40 flex items-center gap-1"
              >
                <RefreshCw size={12} />
                <span>Resend OTP</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Verify & Continue</span>
              <CheckCircle size={16} />
            </button>
          </form>
        )}

        {/* STEP 3: Set Login Credentials */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Assign Login ID / Identifier
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Set Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
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
              <span>Complete Setup & Create Profile</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E5E2D8] text-center">
          <p className="text-xs text-[#5F5E5A]">
            Already registered?{' '}
            <Link href="/auth/login" className="text-[#1F3D2B] font-bold underline hover:text-[#3B6D11]">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
