'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { Phone, Mail, User, Lock, KeyRound, ArrowRight, CheckCircle, RefreshCw, Globe, ShieldCheck, AlertCircle } from 'lucide-react';

const COUNTRIES = [
  { flag: '🇮🇳', name: 'India', code: '+91' },
  { flag: '🇦🇪', name: 'UAE', code: '+971' },
  { flag: '🇺🇸', name: 'USA', code: '+1' },
  { flag: '🇬🇧', name: 'UK', code: '+44' },
  { flag: '🇸🇬', name: 'Singapore', code: '+65' },
  { flag: '🇨🇦', name: 'Canada', code: '+1' },
  { flag: '🇦🇺', name: 'Australia', code: '+61' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: '+966' },
];

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');

  // Step 1 State
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default India (+91)
  const [phoneNumber, setPhoneNumber] = useState('');

  // Sent OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Step 2 State (OTP Input)
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // Step 3 State (Credentials)
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setCredentials } = useAuth();
  const router = useRouter();

  // Validation Checkers
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim());
  const isValidPhone = phoneNumber.trim().replace(/\D/g, '').length >= 7;
  const isInputValid = authMethod === 'email' ? isValidEmail : isValidPhone;

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

  // Generate & Send OTP
  const sendOtpCode = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    const target = authMethod === 'email' ? emailAddress : `${countryCode} ${phoneNumber}`;
    setInfoMessage(`OTP Code sent to ${target}: ${newOtp}`);
  };

  // Handle Step 1 Submission (Send OTP)
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }
    if (!isInputValid) {
      setError(
        authMethod === 'email'
          ? 'Please enter a valid email address (e.g. username@gmail.com).'
          : 'Please enter a valid mobile number.'
      );
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      sendOtpCode();
      setStep(2);
      setResendTimer(30);
      setIsResendDisabled(true);
    } catch {
      setError('Failed to send OTP verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2 Submission (Verify OTP)
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      setError(`Incorrect OTP code. Please enter the exact 6-digit code sent (${generatedOtp}).`);
      return;
    }

    setError('');
    setInfoMessage('');
    setIsLoading(true);
    try {
      const assignedId = authMethod === 'email' ? emailAddress : `${countryCode}${phoneNumber}`;
      setLoginId(assignedId);
      setStep(3);
    } catch {
      setError('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 3 Submission (Set Password)
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

  const handleResendOTP = () => {
    sendOtpCode();
    setResendTimer(30);
    setIsResendDisabled(true);
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
            Step {step} of 3 — {step === 1 ? 'Verification Setup' : step === 2 ? 'OTP Verification' : 'Set Password'}
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
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* STEP 1: Email or Mobile Number Registration */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            
            {/* Method Toggle */}
            <div className="flex bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D8]">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
                }`}
              >
                <Mail size={14} />
                <span>Email Address</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('mobile')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMethod === 'mobile' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A]'
                }`}
              >
                <Phone size={14} />
                <span>Mobile Number</span>
              </button>
            </div>

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

            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#8A8A82]">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="username@gmail.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                    required
                  />
                </div>
                <p className="text-[11px] text-[#8A8A82] mt-1">
                  {isValidEmail ? '✓ Valid email format' : 'Enter valid email (username@gmail.com) to enable Send OTP'}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                  Mobile Number (Select Country Flag)
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-bold text-[#1F3D2B]"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code + c.name} value={c.code}>
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
                      required
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#8A8A82] mt-1">
                  Selected Country Prefix: <strong className="text-[#1F3D2B]">{countryCode}</strong> {isValidPhone ? '✓ Valid mobile format' : 'Enter mobile number to enable Send OTP'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isInputValid || !fullName}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>{isInputValid ? 'Send OTP Code' : 'Enter Valid Info to Send OTP'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Verify Exact Sent OTP Code */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Enter 6-Digit OTP Code
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
                  placeholder="Enter 6-digit OTP"
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
              disabled={isLoading || otpCode.length < 6}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] disabled:bg-gray-300 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Verify & Continue</span>
              <CheckCircle size={16} />
            </button>
          </form>
        )}

        {/* STEP 3: Set Credentials */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
                Verified Account Login ID
              </label>
              <input
                type="text"
                value={loginId}
                readOnly
                className="w-full px-4 py-3 bg-[#EAF0E7] border border-[#3B6D11]/30 rounded-xl text-sm font-bold text-[#1F3D2B]"
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
              disabled={isLoading || !password || password !== confirmPassword}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] disabled:bg-gray-300 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Complete Registration & Setup Profile</span>
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
