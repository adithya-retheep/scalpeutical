'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth-context';
import { StorageStore } from '../../lib/storage-store';
import { AudioNarrator } from '../../components/AudioNarrator';
import { FileText, Share2, Download, ShieldCheck, Info, Check, Copy, Clock, Globe, Eye } from 'lucide-react';

export default function DermatologistReportPage() {
  const { user, activeProduct, activePeriod } = useAuth();
  const [createdShareLink, setCreatedShareLink] = useState<string | null>(null);
  const [expiryHours, setExpiryHours] = useState<number>(48);
  const [copied, setCopied] = useState(false);
  const [reportLanguage, setReportLanguage] = useState<'en' | 'ml'>('en');

  const assessments = StorageStore.getAssessments(activePeriod?.trackingPeriodId || 'period_101');
  const baseline = assessments.find((a) => a.type === 'baseline') || assessments[0];
  const latest = assessments[assessments.length - 1] || baseline;

  const baselineScore = baseline ? baseline.totalScore : 18;
  const latestScore = latest ? latest.totalScore : 10;

  const summaryEn = `Discuss With a Dermatologist Report: Patient ${user?.fullName || 'User'} has completed ${assessments.length || 4} weeks of structured scalp symptom monitoring while using ${activeProduct?.productName || 'Ketoconazole 2% Intensive Scalp Solution'}. Initial baseline symptom score was recorded at ${baselineScore} out of 30. Current Week 4 symptom score is recorded at ${latestScore} out of 30, reflecting an observed reduction in visible flaking and itching. This report records self-reported symptoms, photo consistency scores, and local climate variables without claiming product causality or clinical drug efficacy.`;

  const summaryMl = `ഡെർമറ്റോളജിസ്റ്റുമായി ചർച്ച ചെയ്യാനുള്ള റിപ്പോർട്ട്: ${user?.fullName || 'ഉപയോക്താവ്'} എന്ന വ്യക്തി ${activeProduct?.productName || 'Ketoconazole 2% Shampoo'} ഉപയോഗിച്ചുകൊണ്ട് ${assessments.length || 4} ആഴ്ചത്തെ നിരീക്ഷണം പൂർത്തിയാക്കി. ആദ്യ സൂചിക സ്‌കോർ 30-ൽ ${baselineScore} ആയിരുന്നു. നാലാം ആഴ്ചയിലെ നിലവിലെ സ്‌കോർ 30-ൽ ${latestScore} ആണ്. ഈ റിപ്പോർട്ട് സ്വയം രേഖപ്പെടുത്തിയ ലക്ഷണങ്ങളും ചിത്രങ്ങളും അടങ്ങുന്നതാണ്.`;

  const handleGenerateShareLink = () => {
    const token = `token_${Math.random().toString(36).substring(2, 12)}`;
    const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

    StorageStore.createShareLink({
      linkId: `link_${Math.random().toString(36).substring(2, 8)}`,
      reportId: 'rep_101',
      userId: user?.userId || 'user_demo_101',
      token,
      expiresAt,
      revoked: false,
      createdAt: new Date().toISOString(),
    });

    const shareUrl = `${window.location.origin}/share/${token}`;
    setCreatedShareLink(shareUrl);
  };

  const handleCopyLink = () => {
    if (createdShareLink) {
      navigator.clipboard.writeText(createdShareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header — Section 31 EXACT TITLE */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E2D8] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
              <FileText size={14} />
              <span>Dermatologist Consultation Handoff</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
              Discuss With a Dermatologist
            </h1>
            <p className="text-xs text-[#8A8A82] mt-1">
              Comprehensive recorded observation summary for clinical consultation
            </p>
          </div>

          {/* Section 31 Buttons: VIEW REPORT | EXPORT REPORT | SHARE REPORT */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              className="bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye size={14} />
              <span>VIEW REPORT</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>EXPORT REPORT</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateShareLink}
              className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Share2 size={14} />
              <span>SHARE REPORT</span>
            </button>
          </div>
        </div>

        {/* Section 31 MANDATORY NOTICE */}
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
          <Info size={18} className="text-[#8A8A82] shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">
            <strong className="text-[#1F3D2B]">Clinical Notice:</strong> This report is a summary of recorded observations and is not a medical diagnosis.
          </div>
        </div>
      </div>

      {/* Language Switcher & Audio Narrator */}
      <AudioNarrator
        textEn={summaryEn}
        textMl={summaryMl}
        title="Report Audio Summary (English & മലയാളം)"
      />

      {/* Report Summary Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Patient Demographics & Climate Box */}
        <div className="border-b border-[#E5E2D8] pb-4 flex flex-wrap justify-between gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8A8A82] block">PATIENT INFORMATION</span>
            <span className="font-bold text-sm text-[#1F3D2B]">{user?.fullName || 'User'}</span>
            <p className="text-[#5F5E5A]">{user?.ageRange || '25-34'} · {user?.sex || 'Male'} · Hair: {user?.hairType || 'Wavy'}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#8A8A82] block">LOCATION & CLIMATE</span>
            <span className="font-semibold text-[#1F3D2B]">{user?.location || 'Kochi, Kerala, India'}</span>
            <p className="text-[#5F5E5A]">Dietary Info: {user?.dietaryInfo || 'Balanced'}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[#8A8A82] block">CURRENT PRODUCT</span>
            <span className="font-semibold text-[#1F3D2B]">{activeProduct?.productName || 'Ketoconazole 2% Solution'}</span>
            <p className="text-[#5F5E5A]">Tracking Period: Week 4 of 4</p>
          </div>
        </div>

        {/* Executive Summary Text */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-[#1F3D2B]">Recorded Symptom Trajectory</h4>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setReportLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${reportLanguage === 'en' ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#5F5E5A]'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setReportLanguage('ml')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${reportLanguage === 'ml' ? 'bg-[#1F3D2B] text-white' : 'bg-[#FAF9F5] text-[#5F5E5A]'}`}
              >
                മലയാളം
              </button>
            </div>
          </div>

          <p className="text-xs text-[#5F5E5A] leading-relaxed bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8]">
            {reportLanguage === 'en' ? summaryEn : summaryMl}
          </p>
        </div>

        {/* Score Breakdown Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-[#1F3D2B]">Symptom Score Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F5] text-[#5F5E5A] uppercase text-[10px] border-b border-[#E5E2D8]">
                <tr>
                  <th className="py-2.5 px-3">Symptom Dimension</th>
                  <th className="py-2.5 px-3">Baseline (Day 1)</th>
                  <th className="py-2.5 px-3">Current (Week 4)</th>
                  <th className="py-2.5 px-3">Recorded Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2D8]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1F3D2B]">Visible Flaking Severity</td>
                  <td className="py-2.5 px-3">3 (Severe)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">1 (Mild)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">-2 points</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1F3D2B]">Scalp Pruritus / Itching</td>
                  <td className="py-2.5 px-3">2 (Moderate)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">0 (None)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">-2 points</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1F3D2B]">Visible Scalp Erythema</td>
                  <td className="py-2.5 px-3">2 (Moderate)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">0 (None)</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">-2 points</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1F3D2B]">Total Symptom Score</td>
                  <td className="py-2.5 px-3 font-bold">{baselineScore} / 30</td>
                  <td className="py-2.5 px-3 font-bold text-[#3B6D11]">{latestScore} / 30</td>
                  <td className="py-2.5 px-3 font-extrabold text-[#3B6D11]">-44% Recorded Reduction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinician Share Link Generator */}
        {createdShareLink && (
          <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#3B6D11] flex items-center gap-1">
              <Check size={12} /> Active Clinician Link Generated
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={createdShareLink}
                className="flex-1 px-3 py-2 bg-white border border-[#E5E2D8] rounded-xl text-xs font-mono text-[#1F3D2B]"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-[#D4AF6A] hover:bg-[#c29d59] text-[#1F3D2B] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
