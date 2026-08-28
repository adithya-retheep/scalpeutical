'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, Sparkles, Award, GraduationCap, MapPin, Heart, ArrowRight, Cpu, Compass, Lightbulb } from 'lucide-react';

export default function CreatorAndFounderPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Main Creator & Founder Hero Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        
        {/* Header Title - EXACT MATCH REQUIREMENT */}
        <div className="border-b border-[#E5E2D8] pb-6 text-center space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF6A]">
            FOUNDER & CREATOR
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
            About the Founder & Creator
          </h1>
        </div>

        {/* Profile Details & Credentials */}
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-6 text-center space-y-3">
          <div className="w-28 h-28 rounded-full border-4 border-[#D4AF6A]/40 p-1 bg-white shadow-md mx-auto relative overflow-hidden">
            <Image
              src="/logo.jpeg"
              alt="Ann Maria Devassy"
              width={112}
              height={112}
              className="object-cover w-full h-full rounded-full"
              priority
            />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">
              Ann Maria Devassy
            </h2>
            <div className="font-bold text-sm text-[#1F3D2B] flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
              <span className="flex items-center gap-1">
                <GraduationCap size={16} className="text-[#1F3D2B]" />
                <span>M.Pharm — Pharmacy Practice</span>
              </span>
              <span className="hidden sm:inline text-[#8A8A82]">·</span>
              <span className="flex items-center gap-1 text-[#3B6D11]">
                <Cpu size={16} />
                <span>Integrating Pharmacy with Artificial Intelligence</span>
              </span>
            </div>
          </div>
        </div>

        {/* Creator Story Block (Word-for-Word Prompt Specs) */}
        <div className="bg-white border border-[#E5E2D8] rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-[#1F3D2B] leading-relaxed">
          <h3 className="font-bold text-base text-[#1F3D2B] flex items-center gap-2 border-b border-[#E5E2D8] pb-2">
            <Sparkles size={18} className="text-[#D4AF6A]" />
            <span>Founding Purpose</span>
          </h3>

          <p>
            Scalpeutical was initiated as part of a journey toward exploring the integration of artificial intelligence with pharmacy and healthcare.
          </p>

          <p>
            The vision is to explore how AI can support healthcare professionals by organizing information, monitoring changes over time, supporting documentation, and generating useful insights.
          </p>

          <p className="font-semibold text-[#1F3D2B] bg-[#EAF0E7] p-4 rounded-xl border border-[#3B6D11]/20">
            AI is intended to assist pharmacists, dermatologists, doctors, and other healthcare professionals — not replace their knowledge, clinical judgment, or professional responsibility.
          </p>
        </div>

        {/* Vision Section (Exact Prompt Spec) */}
        <div className="bg-gradient-to-br from-[#1F3D2B] to-[#2d573d] text-white rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Lightbulb size={18} className="text-[#D4AF6A]" />
            <h3 className="font-serif text-lg font-bold text-[#FAF9F5]">Vision</h3>
          </div>

          <p className="text-sm font-serif italic text-[#D4AF6A]">
            &ldquo;Every small step can open a new door to new opportunities.&rdquo;
          </p>

          <p className="text-xs text-[#E5E2D8] leading-relaxed">
            Use your talent and skills to explore, learn, create, and contribute to the future.
          </p>
        </div>

        {/* Action Link back to Dashboard */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Return to Home Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
}
