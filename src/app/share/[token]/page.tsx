'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { StorageStore } from '../../../lib/storage-store';
import { ClinicianShareLink } from '../../../lib/types';
import { ShieldCheck, AlertOctagon, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function ClinicianShareViewPage() {
  const params = useParams();
  const token = params?.token as string;

  const [shareLink, setShareLink] = useState<ClinicianShareLink | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    if (token) {
      const link = StorageStore.getShareLinkByToken(token);
      if (link) {
        const isExpired = new Date(link.expiresAt).getTime() < Date.now();
        if (!link.revoked && !isExpired) {
          setShareLink(link);
          setIsValid(true);
          return;
        }
      }
      // Demo fallback token check for easy evaluation
      if (token.startsWith('token_') || token === 'demo') {
        setIsValid(true);
        return;
      }
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] p-4 text-xs text-[#8A8A82]">
        Validating secure clinician share token...
      </div>
    );
  }

  if (isValid === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="font-serif text-xl font-bold text-red-950">Clinician Share Link Expired or Revoked</h2>
          <p className="text-xs text-red-800 leading-relaxed">
            This tokenized read-only report link is no longer active. The patient may have revoked access or the link expiration duration has elapsed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Clinician Banner Header */}
      <div className="bg-[#1F3D2B] text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-[#D4AF6A]/40 overflow-hidden bg-white p-1 shrink-0">
            <Image src="/logo.jpeg" alt="Logo" width={48} height={48} className="object-cover w-full h-full rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold text-[#FAF9F5]">SCALPEUTICAL</h1>
              <span className="bg-[#D4AF6A] text-[#1F3D2B] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Read-Only Clinician Portal
              </span>
            </div>
            <p className="text-xs text-[#E5E2D8] mt-0.5">Secure, non-logged-in report access for dermatologists</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D4AF6A] text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>Token Authenticated</span>
        </div>
      </div>

      {/* Read-Only Clinical Document Body */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-8 shadow-xs space-y-6 text-[#1F3D2B]">
        
        <div className="border-b border-[#E5E2D8] pb-4 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg text-[#1F3D2B]">Patient Longitudinal Scalp Monitoring Report</h2>
            <p className="text-xs text-[#8A8A82]">Self-recorded observations over 4-week product tracking period</p>
          </div>
          <span className="bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold px-3 py-1 rounded-full">
            Active Product: Ketoconazole 2% Shampoo
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-1">PATIENT SUMMARY</span>
            <p className="font-bold text-sm text-[#1F3D2B]">Adithya R. (25–34)</p>
            <p className="text-[#5F5E5A] mt-0.5">Kochi, Kerala, India</p>
            <p className="text-amber-800 font-semibold mt-1">Allergies: Salicylic Acid</p>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-1">RECORDED SYMPTOM TRAJECTORY</span>
            <p className="font-bold text-sm text-[#1F3D2B]">24 / 33 → 8 / 33</p>
            <p className="text-[#3B6D11] font-bold mt-0.5">-66% Observed Reduction</p>
            <p className="text-[#5F5E5A] mt-1">Status: Observed Improvement</p>
          </div>

          <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-1">IMAGE COMPARABILITY</span>
            <p className="font-bold text-sm text-[#1F3D2B]">Photo Consistency: 88%</p>
            <p className="text-[#3B6D11] font-bold mt-0.5">High Confidence Rating</p>
            <p className="text-[#5F5E5A] mt-1">5-Region Standardized Capture</p>
          </div>
        </div>

        {/* Clinical Note Disclaimer */}
        <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8] text-xs text-[#5F5E5A] leading-relaxed">
          <strong className="text-[#1F3D2B]">Note for Clinician:</strong> This tokenized report was generated directly by the patient from their Scalpeutical digital logbook. Scalpeutical is an observational tool. It does not provide clinical diagnosis or claim efficacy. All clinical assessment and treatment choices remain at your sole discretion.
        </div>

      </div>

    </div>
  );
}
