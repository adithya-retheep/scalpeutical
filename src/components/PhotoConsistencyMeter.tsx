'use client';

import React from 'react';
import { Camera, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { ConfidenceTier } from '../lib/types';

interface PhotoConsistencyMeterProps {
  score: number; // 0 - 100
  confidenceTier: ConfidenceTier;
  framingScore?: number;
  lightingScore?: number;
  blurScore?: number;
}

export function PhotoConsistencyMeter({
  score,
  confidenceTier,
  framingScore = 85,
  lightingScore = 90,
  blurScore = 88,
}: PhotoConsistencyMeterProps) {
  let badgeColor = 'bg-[#EAF0E7] text-[#3B6D11] border-[#3B6D11]/30';
  let barColor = 'bg-[#3B6D11]';

  if (score < 50) {
    badgeColor = 'bg-red-50 text-red-700 border-red-200';
    barColor = 'bg-red-600';
  } else if (score < 75) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    barColor = 'bg-amber-500';
  }

  return (
    <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-[#1F3D2B]">
            <Camera size={18} />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#1F3D2B]">Photo Consistency Score</h4>
            <p className="text-xs text-[#8A8A82]">Feature & embedding comparability vs Baseline</p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} flex items-center gap-1`}>
          {confidenceTier === 'High' && <CheckCircle2 size={13} />}
          {confidenceTier === 'Moderate' && <AlertCircle size={13} />}
          {(confidenceTier === 'Low' || confidenceTier === 'Unable to determine') && <HelpCircle size={13} />}
          <span>{confidenceTier} Confidence ({score}%)</span>
        </div>
      </div>

      {/* Progress Meter Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs text-[#5F5E5A] font-medium">
          <span>Tracking Quality Meter</span>
          <span className="font-bold text-[#1F3D2B]">{score} / 100</span>
        </div>
        <div className="w-full h-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
          ></div>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-2 rounded-xl">
          <span className="text-[10px] text-[#8A8A82] uppercase font-bold block">Lighting Match</span>
          <span className="font-bold text-[#1F3D2B] text-sm">{lightingScore}%</span>
        </div>
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-2 rounded-xl">
          <span className="text-[10px] text-[#8A8A82] uppercase font-bold block">Framing Angle</span>
          <span className="font-bold text-[#1F3D2B] text-sm">{framingScore}%</span>
        </div>
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-2 rounded-xl">
          <span className="text-[10px] text-[#8A8A82] uppercase font-bold block">Clarity / Focus</span>
          <span className="font-bold text-[#1F3D2B] text-sm">{blurScore}%</span>
        </div>
      </div>
    </div>
  );
}
