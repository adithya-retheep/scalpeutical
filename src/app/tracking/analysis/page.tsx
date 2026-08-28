'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StorageStore } from '../../../lib/storage-store';
import { useAuth } from '../../../context/auth-context';
import { Assessment, Product, ResponseStatus } from '../../../lib/types';
import { PhotoConsistencyMeter } from '../../../components/PhotoConsistencyMeter';
import { Activity, TrendingDown, ArrowRight, ShieldCheck, FileText, Info, Camera } from 'lucide-react';

export default function ProductResponseAnalysisPage() {
  const { activePeriod, activeProduct } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    if (activePeriod) {
      setAssessments(StorageStore.getAssessments(activePeriod.trackingPeriodId));
    } else {
      setAssessments(StorageStore.getAssessments('period_101'));
    }
  }, [activePeriod]);

  const baseline = assessments.find((a) => a.type === 'baseline') || assessments[0];
  const current = assessments[assessments.length - 1] || baseline;

  const baselineScore = baseline ? baseline.totalScore : 24;
  const currentScore = current ? current.totalScore : 8;
  const maxScore = 33;

  const percentageReduction =
    baselineScore > 0
      ? Math.max(0, Math.round(((baselineScore - currentScore) / baselineScore) * 100))
      : 0;

  let status: ResponseStatus = 'Observed improvement';
  if (percentageReduction < 10) status = 'No meaningful improvement';
  if (currentScore > baselineScore + 3) status = 'Worsened';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Activity size={14} />
            <span>Product Response Evaluation</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Product Response Analysis</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Tracking period analysis for {activeProduct?.productName || 'Ketoconazole 2% Shampoo'}
          </p>
        </div>

        <Link
          href="/report"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <FileText size={16} />
          <span>Dermatologist Handoff</span>
        </Link>
      </div>

      {/* Status Classification Banner */}
      <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 rounded-3xl p-6 shadow-xs text-[#1F3D2B] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#3B6D11]">RECORDED RESPONSE STATUS</span>
          <span className="bg-[#3B6D11] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {status}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#3B6D11]">-{percentageReduction}%</span>
          <span className="text-sm font-semibold text-[#1F3D2B]">Symptom Score Reduction</span>
        </div>

        <p className="text-xs text-[#1F3D2B] leading-relaxed">
          Your recorded symptom score decreased from <strong>{baselineScore}/33</strong> (Baseline) to <strong>{currentScore}/33</strong> (Week 4). Visible flaking findings also appear reduced in standardized scalp image evaluations.
        </p>
      </div>

      {/* Photo Quality & Consistency Score */}
      <PhotoConsistencyMeter
        score={88}
        confidenceTier="High"
        framingScore={90}
        lightingScore={86}
        blurScore={88}
      />

      {/* Side-by-Side Image Comparison */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">Standardized Image Comparison</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8A8A82] uppercase block">BASELINE (WEEK 0)</span>
            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[#E5E2D8] bg-[#FAF9F5] relative">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80"
                alt="Baseline scalp image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                Moderate Flaking (24/33)
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#8A8A82] uppercase block">CURRENT (WEEK 4)</span>
            <div className="aspect-4/3 rounded-2xl overflow-hidden border border-[#E5E2D8] bg-[#FAF9F5] relative">
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&auto=format&fit=crop&q=80"
                alt="Current scalp image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-[#3B6D11] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                Mild Flaking (8/33)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Non-Causal Medical Disclaimer Box */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#8A8A82] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1F3D2B]">Observational Non-Causal Statement:</strong> These findings represent observed changes recorded during this tracking period. They do not establish that the product caused the improvement or prove clinical efficacy. All decisions regarding product continuation, modification, or discontinuation should be made with a qualified dermatologist.
        </div>
      </div>

    </div>
  );
}
