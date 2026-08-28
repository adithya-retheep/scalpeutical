'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Play, Square } from 'lucide-react';

interface AudioNarratorProps {
  textEn: string;
  textMl: string;
  title?: string;
}

export function AudioNarrator({ textEn, textMl, title = 'Audio Guidance & Narration' }: AudioNarratorProps) {
  const [language, setLanguage] = useState<'en' | 'ml'>('en');
  const [isPlaying, setIsPlaying] = useState(false);

  const activeText = language === 'en' ? textEn : textMl;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Audio playback is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(activeText);
    utterance.lang = language === 'en' ? 'en-US' : 'ml-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E2D8] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-lg text-[#1F3D2B]">
            <Volume2 size={16} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#1F3D2B]">{title}</h4>
            <p className="text-[10px] text-[#8A8A82]">Available in English & മലയാളം (Malayalam)</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D8]">
          <button
            type="button"
            onClick={() => {
              handleStop();
              setLanguage('en');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              language === 'en' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A] hover:text-[#1F3D2B]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => {
              handleStop();
              setLanguage('ml');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              language === 'ml' ? 'bg-[#1F3D2B] text-white shadow-2xs' : 'text-[#5F5E5A] hover:text-[#1F3D2B]'
            }`}
          >
            മലയാളം
          </button>
        </div>
      </div>

      {/* Audio Player Controls & Text Preview */}
      <div className="flex items-center justify-between gap-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
        <p className="text-xs text-[#1F3D2B] font-medium leading-relaxed italic flex-1 truncate">
          "{activeText}"
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handleSpeak}
              className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Play size={13} fill="currentColor" />
              <span>Play Audio</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Square size={13} fill="currentColor" />
              <span>Stop Audio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
