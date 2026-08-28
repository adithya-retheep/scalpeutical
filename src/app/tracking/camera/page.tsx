'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { StorageStore } from '../../../lib/storage-store';
import { ScalpRegion, ScalpImage } from '../../../lib/types';
import { AudioNarrator } from '../../../components/AudioNarrator';
import { Camera, Check, ChevronRight, Upload, Info, ShieldCheck, RefreshCw } from 'lucide-react';

const REGIONS: { id: ScalpRegion; title: string; hint: string; audioEn: string; audioMl: string }[] = [
  {
    id: 'front_hairline',
    title: '1. Front Hairline',
    hint: 'Position camera 10–15 cm from forehead hairline with clear lighting.',
    audioEn: 'Position camera 10 to 15 centimeters from your forehead hairline in clear room lighting.',
    audioMl: 'വ്യക്തമായ വെളിച്ചത്തിൽ നെറ്റിയുടെ മുൻവശത്തെ മുടിരേഖയിൽ നിന്ന് 10-15 സെന്റീമീറ്റർ അകലെ ക്യാമറ പിടിക്കുക.'
  },
  {
    id: 'top_central',
    title: '2. Top / Central Scalp',
    hint: 'Part hair slightly to expose central crown scalp surface.',
    audioEn: 'Part hair slightly to expose your central crown scalp surface clearly.',
    audioMl: 'തലയുടെ മധ്യഭാഗത്തെ ചർമ്മം വ്യക്തമായി കാണുന്നതിനായി മുടി ചെറുതായി മാറ്റിവെക്കുക.'
  },
  {
    id: 'left',
    title: '3. Left Scalp Region',
    hint: 'Capture left temporal & parietal scalp area.',
    audioEn: 'Capture the left temporal and side scalp region.',
    audioMl: 'തലയുടെ ഇടതുവശത്തെ ചർമ്മത്തിന്റെ ചിത്രം പകരുക.'
  },
  {
    id: 'right',
    title: '4. Right Scalp Region',
    hint: 'Capture right temporal & parietal scalp area.',
    audioEn: 'Capture the right temporal and side scalp region.',
    audioMl: 'തലയുടെ വലതുവശത്തെ ചർമ്മത്തിന്റെ ചിത്രം പകരുക.'
  },
  {
    id: 'back_occipital',
    title: '5. Back / Occipital Scalp',
    hint: 'Tilt head forward to capture posterior occipital scalp.',
    audioEn: 'Tilt head forward slightly to capture the back occipital scalp region.',
    audioMl: 'തലയുടെ പിൻഭാഗത്തെ ചർമ്മം വ്യക്തമായി കാണുന്നതിനായി തല ചെറുതായി മുന്നോട്ട് കുനിക്കുക.'
  },
];

export default function ScalpCameraPage() {
  const { activePeriod, user } = useAuth();
  const router = useRouter();

  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({
    front_hairline: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    top_central: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&auto=format&fit=crop&q=80',
  });

  const currentRegion = REGIONS[activeRegionIndex];

  const handleCaptureDemo = () => {
    const demoUrl = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80';
    setCapturedImages((prev) => ({ ...prev, [currentRegion.id]: demoUrl }));
  };

  const handleProceedToQualityCheck = () => {
    const trackingPeriodId = activePeriod?.trackingPeriodId || 'period_101';

    Object.entries(capturedImages).forEach(([reg, url]) => {
      const imgObj: ScalpImage = {
        imageId: `img_${Math.random().toString(36).substring(2, 9)}`,
        trackingPeriodId,
        userId: user?.userId || 'user_demo_101',
        region: reg as ScalpRegion,
        imageUrl: url,
        captureDate: new Date().toISOString().split('T')[0],
        weekNumber: 4,
        qualityPassed: true,
      };
      StorageStore.addScalpImage(imgObj);
    });

    router.push('/tracking/quality-check');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Camera size={14} />
            <span>5-Region Standardized Photography</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Scalp Camera Guide</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Capture clear scalp images with English & Malayalam Audio Guidance
          </p>
        </div>
      </div>

      {/* Audio Guidance Component (English & Malayalam) */}
      <AudioNarrator
        textEn={currentRegion.audioEn}
        textMl={currentRegion.audioMl}
        title={`Scan Audio Support — ${currentRegion.title}`}
      />

      {/* Photography Instructions */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#D4AF6A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#1F3D2B]">Standardized Photography Rules:</strong>
          <p>1. Maintain same room lighting as baseline. 2. Avoid filters or aggressive flash glare. 3. Part hair gently to expose visible scalp.</p>
        </div>
      </div>

      {/* Region Selector Stepper */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {REGIONS.map((r, idx) => {
          const isDone = Boolean(capturedImages[r.id]);
          const isActive = idx === activeRegionIndex;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRegionIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all border ${
                isActive
                  ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                  : isDone
                  ? 'bg-[#EAF0E7] text-[#3B6D11] border-[#3B6D11]/30'
                  : 'bg-white text-[#5F5E5A] border-[#E5E2D8]'
              }`}
            >
              {isDone && <Check size={14} />}
              <span>{r.title.split('.')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Camera Capture Viewport Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-3">
          <h3 className="font-bold text-base text-[#1F3D2B]">{currentRegion.title}</h3>
          <span className="text-xs text-[#8A8A82]">{currentRegion.hint}</span>
        </div>

        {/* Viewport Box */}
        <div className="aspect-4/3 w-full max-w-md mx-auto bg-[#FAF9F5] border-2 border-dashed border-[#E5E2D8] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4">
          {capturedImages[currentRegion.id] ? (
            <img
              src={capturedImages[currentRegion.id]}
              alt="Captured region"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="space-y-3">
              <Camera size={40} className="text-[#1F3D2B] mx-auto opacity-40" />
              <p className="text-xs text-[#8A8A82]">Align camera with scalp surface</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCaptureDemo}
            className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <Camera size={16} />
            <span>Capture {currentRegion.title.split('.')[1]}</span>
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={() => setActiveRegionIndex(Math.max(0, activeRegionIndex - 1))}
          disabled={activeRegionIndex === 0}
          className="px-4 py-2 bg-white border border-[#E5E2D8] rounded-xl text-xs font-bold text-[#5F5E5A] disabled:opacity-40"
        >
          Previous Region
        </button>

        {activeRegionIndex < REGIONS.length - 1 ? (
          <button
            type="button"
            onClick={() => setActiveRegionIndex(activeRegionIndex + 1)}
            className="px-5 py-2.5 bg-[#1F3D2B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <span>Next Region</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleProceedToQualityCheck}
            className="px-6 py-3 bg-[#D4AF6A] hover:bg-[#c29d59] text-[#1F3D2B] rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <span>Run Quality & Consistency Check</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
