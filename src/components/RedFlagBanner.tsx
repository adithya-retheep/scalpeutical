'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface RedFlagBannerProps {
  symptoms?: string[];
  onDismiss?: () => void;
}

export function RedFlagBanner({ symptoms = [], onDismiss }: RedFlagBannerProps) {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 shadow-xs text-red-950 my-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-red-100 rounded-xl text-red-700 shrink-0 mt-0.5">
          <AlertOctagon size={22} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-red-900 flex items-center gap-1.5">
              <span>Concerning Symptoms Detected</span>
              <span className="bg-red-200 text-red-800 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                Medical Evaluation Required
              </span>
            </h4>
          </div>

          <p className="text-xs text-red-800 mt-1">
            Your reported check-in contained one or more symptoms that require professional medical attention:
          </p>

          <ul className="mt-2 text-xs font-semibold text-red-900 space-y-1 list-disc list-inside bg-white/70 p-2.5 rounded-xl border border-red-200">
            {symptoms.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>

          <div className="mt-3 bg-red-100/80 rounded-xl p-3 text-xs text-red-900 leading-relaxed font-medium">
            <strong>Non-Negotiable Safety Recommendation:</strong> Professional medical evaluation by a qualified dermatologist or healthcare provider is strongly recommended. Do not attempt self-treatment or delay professional clinical care.
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/report"
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ShieldAlert size={14} />
              <span>Generate Dermatologist Report</span>
            </Link>
            <Link
              href="/drawer/disclaimer"
              className="text-red-700 underline text-xs font-medium hover:text-red-900"
            >
              Read Medical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
