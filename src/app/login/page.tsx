"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Phone, User, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "setup">("phone");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-4">
             <Image src="/logo.jpeg" alt="Scalpeutical Logo" width={120} height={40} className="object-contain" />
          </div>
          <h2 className="text-white text-xl font-semibold">Secure Access</h2>
          <p className="text-blue-100 text-sm mt-2 opacity-90">Your scalp health data is strictly confidential.</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          
          {step === "phone" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </div>
                  <input type="tel" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <button 
                onClick={() => setStep("otp")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition mt-2">
                Send OTP Verification
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 text-center">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-lg font-semibold text-slate-800">Verify your number</h3>
               <p className="text-sm text-slate-500">We've sent a 6-digit code to your phone.</p>
               
               <input type="text" maxLength={6} className="w-full text-center tracking-widest text-2xl py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="------" />
               
               <button 
                onClick={() => setStep("setup")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition">
                Verify OTP
              </button>
            </div>
          )}

          {step === "setup" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Create Login Credentials</h3>
                <p className="text-sm text-slate-500">Set up an ID and Password for easy future access.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Login ID (Username / Email)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="johndoe123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input type="password" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="••••••••" />
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-blue-700 transition mt-2">
                Complete Registration
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
