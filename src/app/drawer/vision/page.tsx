'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Lightbulb, ShieldCheck, ArrowRight } from 'lucide-react';

export default function VisionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Vision Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#D4AF6A] border border-[#D4AF6A]/30 text-xs font-bold mb-2">
            <Sparkles size={14} />
            <span>Digital Healthcare Vision</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">Vision</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Research-oriented exploration of generative AI in supportive clinical monitoring
          </p>
        </div>
      </div>

      {/* Inspirational Quote Card */}
      <div className="bg-gradient-to-br from-[#1F3D2B] to-[#2d573d] text-white rounded-3xl p-8 shadow-md text-center space-y-4 relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-[#D4AF6A]/20 text-[#D4AF6A] flex items-center justify-center mx-auto border border-[#D4AF6A]/40">
          <Compass size={24} />
        </div>

        <blockquote className="font-serif text-xl sm:text-2xl font-bold text-[#FAF9F5] italic leading-relaxed">
          "Every small step can open a new door to new opportunities."
        </blockquote>

        <p className="text-sm text-[#D4AF6A] font-semibold">
          Use your talent and skills.
        </p>

        <p className="text-xs text-[#E5E2D8] max-w-xl mx-auto opacity-90 leading-relaxed pt-2 border-t border-white/10">
          Ann Maria Devassy, M.Pharm — Pharmacy Practice, Kerala, India
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#E5E2D8] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-bold text-sm">
            <Lightbulb size={18} className="text-[#D4AF6A]" />
            <span>AI as a Supportive Assistant</span>
          </div>
          <p className="text-xs text-[#5F5E5A] leading-relaxed">
            AI technologies should serve as structured documentation partners, organizing complex longitudinal user findings to support clinical decision-making.
          </p>
        </div>

        <div className="bg-white border border-[#E5E2D8] rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#1F3D2B] font-bold text-sm">
            <ShieldCheck size={18} className="text-[#3B6D11]" />
            <span>Product Neutrality & Safety</span>
          </div>
          <p className="text-xs text-[#5F5E5A] leading-relaxed">
            Observational monitoring must remain product-neutral, avoiding independent commercial promotion or unverified clinical claims.
          </p>
        </div>
      </div>

      <div className="pt-2 text-center">
        <Link
          href="/drawer/creator"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1F3D2B] hover:underline"
        >
          <span>Return to Creator & Founder Profile</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  );
}
