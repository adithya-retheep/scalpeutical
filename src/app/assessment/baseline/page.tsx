'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { StorageStore } from '../../../lib/storage-store';
import { SymptomScores, SymptomScoreValue, Assessment } from '../../../lib/types';
import { ClipboardCheck, Info, CheckCircle2, ArrowRight } from 'lucide-react';

const QUESTIONS: { key: keyof SymptomScores; label: string; description: string }[] = [
  { key: 'flaking', label: '1. Visible Flaking Severity', description: 'Amount of visible scaling/flakes observed on scalp or shoulders.' },
  { key: 'itching', label: '2. Scalp Itching (Pruritus)', description: 'Frequency and intensity of scalp itch sensation.' },
  { key: 'redness', label: '3. Visible Erythema / Redness', description: 'Visible redness along hairline or scalp parts.' },
  { key: 'irritation', label: '4. Scalp Irritation & Burning', description: 'Perceived tightness, sting, or sensitivity.' },
  { key: 'oiliness', label: '5. Scalp Oiliness / Sebum', description: 'Observed scalp grease or oil accumulation.' },
  { key: 'scaling', label: '6. Visible Scale Thickness', description: 'Apparent density of scalp adherent scale.' },
  { key: 'affectedArea', label: '7. Affected Scalp Regions', description: 'Extent of scalp area showing visible findings.' },
  { key: 'duration', label: '8. Duration of Symptoms', description: 'Chronicity of recorded scalp concerns.' },
  { key: 'frequency', label: '9. Symptom Frequency', description: 'How often flaking/itching is noticed throughout the week.' },
  { key: 'userSeverity', label: '10. Overall Perceived Severity', description: 'User-assessed overall rating of current scalp state.' },
  { key: 'dailyImpact', label: '11. Impact on Daily Activities', description: 'Disruption to confidence, dark clothing choice, or comfort.' },
];

export default function BaselineAssessmentPage() {
  const { user, activePeriod, completeBaselineStep } = useAuth();
  const router = useRouter();

  const [scores, setScores] = useState<SymptomScores>({
    flaking: 2,
    itching: 2,
    redness: 1,
    irritation: 1,
    oiliness: 2,
    scaling: 2,
    affectedArea: 2,
    duration: 2,
    frequency: 2,
    userSeverity: 2,
    dailyImpact: 1,
  });

  const handleScoreChange = (key: keyof SymptomScores, val: SymptomScoreValue) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
  const maxScore = 33;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trackingPeriodId = activePeriod?.trackingPeriodId || 'period_101';

    const assessment: Assessment = {
      assessmentId: `assess_${Math.random().toString(36).substring(2, 9)}`,
      trackingPeriodId,
      userId: user?.userId || 'user_demo_101',
      type: 'baseline',
      weekNumber: 0,
      scores,
      totalScore,
      maxScore,
      algorithmVersion: '1.0.0',
      date: new Date().toISOString().split('T')[0],
    };

    StorageStore.addAssessment(assessment);
    completeBaselineStep();
    router.push('/product/scan');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <ClipboardCheck size={14} />
            <span>Structured Baseline Questionnaire</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Baseline Scalp Assessment</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Establish initial estimated symptom score prior to tracking product observations
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-3 rounded-2xl text-center hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-[#8A8A82] block">Baseline Score</span>
          <span className="text-xl font-bold text-[#1F3D2B]">{totalScore} / {maxScore}</span>
        </div>
      </div>

      {/* Mandatory Non-Clinical Label Disclaimer */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#D4AF6A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1F3D2B]">Estimated Symptom Severity for Tracking Purposes:</strong> This scoring framework calculates an observational rating (0 to 33) to measure trends over time. It is not a clinical diagnostic scale.
        </div>
      </div>

      {/* Questionnaire Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {QUESTIONS.map((q) => {
          const currentVal = scores[q.key];
          return (
            <div key={q.key} className="bg-white border border-[#E5E2D8] rounded-2xl p-5 shadow-xs space-y-3">
              <div>
                <h4 className="font-bold text-sm text-[#1F3D2B]">{q.label}</h4>
                <p className="text-xs text-[#8A8A82]">{q.description}</p>
              </div>

              {/* 4-point rating options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '0 — None', val: 0 },
                  { label: '1 — Mild', val: 1 },
                  { label: '2 — Moderate', val: 2 },
                  { label: '3 — Severe', val: 3 },
                ].map((opt) => {
                  const selected = currentVal === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => handleScoreChange(q.key, opt.val as SymptomScoreValue)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all border text-center ${
                        selected
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-xs'
                          : 'bg-[#FAF9F5] text-[#5F5E5A] border-[#E5E2D8] hover:border-[#1F3D2B]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Submit Bar */}
        <div className="sticky bottom-4 z-20 bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#8A8A82] font-semibold block">Total Estimated Symptom Score</span>
            <span className="text-xl font-bold text-[#1F3D2B]">{totalScore} of {maxScore}</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Save Baseline & Scan Product</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
