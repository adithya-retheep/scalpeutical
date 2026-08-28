'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse, FileText } from 'lucide-react';

export default function MedicalDisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
            <AlertTriangle size={14} className="text-amber-700" />
            <span>Non-Negotiable Medical Safety Principles</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Medical Safety & Observational Disclaimer</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Mandatory framework outlining the boundaries of AI-assisted monitoring
          </p>
        </div>
      </div>

      {/* Main Principles Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-xs text-[#1F3D2B] leading-relaxed">
        
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-[#1F3D2B] flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#3B6D11]" />
            <span>1. Monitoring & Educational Tool — NOT a Diagnostic Tool</span>
          </h3>
          <p className="text-[#5F5E5A]">
            Scalpeutical is strictly an observational digital monitoring companion. It does NOT diagnose dandruff, seborrheic dermatitis, psoriasis, eczema, fungal infections, scalp infections, or any dermatological disease.
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-[#1F3D2B] flex items-center gap-2">
            <HeartPulse size={18} className="text-[#D4AF6A]" />
            <span>2. Observational Language Standards</span>
          </h3>
          <ul className="list-disc list-inside space-y-1 text-[#5F5E5A]">
            <li>We do NOT state "you have dandruff" → We state "your recorded scalp findings show visible flaking."</li>
            <li>We do NOT claim a product is "best", "medically superior", or "will cure."</li>
            <li>We do NOT instruct users to stop or switch products independently.</li>
          </ul>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-2">
          <h3 className="font-bold text-sm text-[#1F3D2B] flex items-center gap-2">
            <FileText size={18} className="text-[#1F3D2B]" />
            <span>3. Final Clinical Decision Principle</span>
          </h3>
          <p className="font-bold text-[#1F3D2B]">
            AI ASSISTS. HEALTHCARE PROFESSIONALS DECIDE.
          </p>
          <p className="text-[#5F5E5A]">
            All final decisions regarding continuing, changing, or stopping a scalp care product or treatment routine must be made with appropriate professional guidance from a qualified dermatologist.
          </p>
        </div>

      </div>

    </div>
  );
}
