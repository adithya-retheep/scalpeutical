'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StorageStore } from '../../../lib/storage-store';
import { TrackingPeriod, Product, Assessment } from '../../../lib/types';
import { Scale, Info, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export default function ProductComparisonPage() {
  const [periods, setPeriods] = useState<TrackingPeriod[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    setPeriods(StorageStore.getTrackingPeriods());
    setProducts(StorageStore.getProducts());
    setAssessments(StorageStore.getAssessments());
  }, []);

  const comparisonData = periods.map((p) => {
    const prod = products.find((pr) => pr.productId === p.productId);
    const pAssessments = assessments.filter((a) => a.trackingPeriodId === p.trackingPeriodId);
    const base = pAssessments.find((a) => a.type === 'baseline') || pAssessments[0];
    const latest = pAssessments[pAssessments.length - 1] || base;

    const bScore = base ? base.totalScore : 24;
    const lScore = latest ? latest.totalScore : 8;
    const reductionPct = bScore > 0 ? Math.round(((bScore - lScore) / bScore) * 100) : 0;

    return {
      period: p,
      product: prod,
      baseScore: bScore,
      finalScore: lScore,
      reductionPct,
      durationWeeks: pAssessments.length || 4,
    };
  });

  const sortedByReduction = [...comparisonData].sort((a, b) => b.reductionPct - a.reductionPct);
  const topObserved = sortedByReduction[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Scale size={14} />
            <span>Personal Observation Comparison</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Product Comparison Engine</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Evaluating observed symptom changes across your own tracked product periods
          </p>
        </div>
      </div>

      {/* Observational Comparison Neutrality Summary */}
      {topObserved && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 rounded-3xl p-6 text-[#1F3D2B] space-y-3">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-[#3B6D11]" />
            <h3 className="font-bold text-base">Observational Summary</h3>
          </div>
          <p className="text-xs text-[#1F3D2B] leading-relaxed">
            Among the products you have personally tracked, <strong>{topObserved.period.productName}</strong> showed the largest observed reduction in your recorded symptom score (<strong>-{topObserved.reductionPct}%</strong> over {topObserved.durationWeeks} weeks).
          </p>
          <div className="bg-white/80 p-3 rounded-2xl border border-[#3B6D11]/20 text-[11px] font-medium text-[#1F3D2B]">
            <strong>Neutrality & Safety Principle:</strong> This comparison reflects only your own self-recorded observations during these specific periods. It does not establish that one product is clinically superior or best for everyone. Please discuss these recorded observations with a dermatologist before altering your scalp care routine.
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparisonData.map((item, idx) => (
          <div key={idx} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#E5E2D8] pb-3 mb-3">
                <span className="text-[10px] uppercase font-bold text-[#8A8A82] tracking-wider block">
                  TRACKED PRODUCT #{idx + 1}
                </span>
                <h4 className="font-bold text-base text-[#1F3D2B]">{item.period.productName}</h4>
                <p className="text-xs text-[#D4AF6A] font-semibold">{item.period.brand}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
                  <span className="text-[#8A8A82]">Active Ingredients:</span>
                  <span className="font-semibold text-[#1F3D2B]">{item.product?.activeIngredients?.join(', ') || 'Zinc / Ketoconazole'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
                  <span className="text-[#8A8A82]">Baseline Symptom Score:</span>
                  <span className="font-semibold text-[#1F3D2B]">{item.baseScore} / 33</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
                  <span className="text-[#8A8A82]">Latest Recorded Score:</span>
                  <span className="font-semibold text-[#1F3D2B]">{item.finalScore} / 33</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF9F5]">
                  <span className="text-[#8A8A82]">Observed Change:</span>
                  <span className="font-bold text-[#3B6D11]">-{item.reductionPct}% Reduction</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#8A8A82]">Recorded Outcome:</span>
                  <span className="font-bold text-[#1F3D2B]">{item.period.status}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/product/${item.period.productId}`}
              className="w-full bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] py-2.5 rounded-xl font-bold text-xs text-center transition-colors block"
            >
              View Detailed Product Log
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
