'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StorageStore } from '../../../lib/storage-store';
import { TrackingPeriod, Product, Assessment } from '../../../lib/types';
import { Clock, TrendingDown, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProductHistoryPage() {
  const [trackingPeriods, setTrackingPeriods] = useState<TrackingPeriod[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    setTrackingPeriods(StorageStore.getTrackingPeriods());
    setProducts(StorageStore.getProducts());
    setAssessments(StorageStore.getAssessments());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Clock size={14} />
            <span>Longitudinal Tracking Logs</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">My Product History</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Historical log of all anti-dandruff and scalp-care routines tracked over time
          </p>
        </div>

        <Link
          href="/product/compare"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>Compare Products</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Product Tracking History Cards */}
      <div className="space-y-4">
        {trackingPeriods.map((period) => {
          const prod = products.find((p) => p.productId === period.productId);
          const periodAssessments = assessments.filter((a) => a.trackingPeriodId === period.trackingPeriodId);
          const base = periodAssessments.find((a) => a.type === 'baseline') || periodAssessments[0];
          const latest = periodAssessments[periodAssessments.length - 1] || base;

          const baseScore = base ? base.totalScore : 23;
          const finalScore = latest ? latest.totalScore : 8;
          const delta = baseScore > 0 ? Math.round(((baseScore - finalScore) / baseScore) * 100) : 0;

          return (
            <div key={period.trackingPeriodId} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E2D8] pb-3">
                <div>
                  <h3 className="font-bold text-lg text-[#1F3D2B]">{period.productName}</h3>
                  <p className="text-xs text-[#D4AF6A] font-semibold">{period.brand}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    period.status === 'Observed improvement'
                      ? 'bg-[#EAF0E7] text-[#3B6D11] border-[#3B6D11]/30'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {period.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
                  <span className="text-[#8A8A82] font-bold block mb-0.5">ACTIVE INGREDIENT</span>
                  <span className="font-semibold text-[#1F3D2B]">{prod?.activeIngredients?.join(', ') || 'Zinc / Ketoconazole'}</span>
                </div>

                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
                  <span className="text-[#8A8A82] font-bold block mb-0.5">TRACKING DATES</span>
                  <span className="font-semibold text-[#1F3D2B]">
                    {period.startDate} {period.endDate ? `to ${period.endDate}` : '(Current)'}
                  </span>
                </div>

                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
                  <span className="text-[#8A8A82] font-bold block mb-0.5">SYMPTOM TRAJECTORY</span>
                  <span className="font-semibold text-[#1F3D2B]">{baseScore}/33 → {finalScore}/33</span>
                </div>

                <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
                  <span className="text-[#8A8A82] font-bold block mb-0.5">OBSERVED CHANGE</span>
                  <span className="font-bold text-[#3B6D11]">-{delta}% Reduction</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  href={`/product/${period.productId}`}
                  className="text-xs font-bold text-[#1F3D2B] hover:underline flex items-center gap-1"
                >
                  <span>View Full Product Log</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
