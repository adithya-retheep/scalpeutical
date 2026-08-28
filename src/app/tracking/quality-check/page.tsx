'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoConsistencyMeter } from '../../../components/PhotoConsistencyMeter';
import { StorageStore } from '../../../lib/storage-store';
import { ConfidenceTier, ImageAnalysis } from '../../../lib/types';
import { ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

export default function QualityCheckPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);

  useEffect(() => {
    fetch('/api/analyze-scalp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region: 'top_central' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalysis(data.result);
          StorageStore.addAnalysis(data.result);
        }
      })
      .finally(() => setIsAnalyzing(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <ShieldCheck size={14} />
            <span>Automated Image Quality & Feature Comparability</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Quality & Consistency Verification</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Evaluating camera framing, lighting similarity, and image embeddings before AI observation
          </p>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="bg-white border border-[#E5E2D8] rounded-3xl p-12 text-center space-y-4">
          <RefreshCw size={36} className="animate-spin text-[#1F3D2B] mx-auto" />
          <h3 className="font-bold text-base text-[#1F3D2B]">Evaluating Photo Consistency & Image Quality...</h3>
          <p className="text-xs text-[#8A8A82]">Checking blur, lighting, framing, and feature embeddings vs Baseline image</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Photo Consistency Meter Component (Innovated Feature #2) */}
          <PhotoConsistencyMeter
            score={analysis.consistencyScore}
            confidenceTier={analysis.confidenceTier}
            framingScore={analysis.qualityMetrics.framingScore}
            lightingScore={analysis.qualityMetrics.lightingScore}
            blurScore={analysis.qualityMetrics.blurScore}
          />

          {/* Verification Results Card */}
          <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-3">
              <h3 className="font-bold text-base text-[#1F3D2B]">Observational Image Analysis Output</h3>
              <span className="text-xs font-extrabold text-[#3B6D11] bg-[#EAF0E7] px-3 py-1 rounded-full">
                Verification Passed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E2D8]">
                <span className="text-[#8A8A82] font-bold block mb-1">VISIBLE FLAKING SEVERITY FINDING</span>
                <span className="text-base font-bold text-[#1F3D2B]">{analysis.visibleFlakingSeverity} Visible Flaking</span>
                <p className="text-[#5F5E5A] mt-1">{analysis.changeFromBaseline}</p>
              </div>

              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E2D8]">
                <span className="text-[#8A8A82] font-bold block mb-1">AFFECTED AREA & DISTRIBUTION</span>
                <p className="text-[#1F3D2B] font-medium">{analysis.affectedAreaDistribution}</p>
              </div>
            </div>

            <div className="bg-[#FAF9F5] p-3 text-[11px] text-[#8A8A82] rounded-xl border border-[#E5E2D8]">
              {analysis.disclaimer}
            </div>

            <button
              type="button"
              onClick={() => router.push('/tracking/weekly')}
              className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Complete Weekly Check-In Form</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : null}

    </div>
  );
}
