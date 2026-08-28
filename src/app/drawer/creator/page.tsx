'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, Sparkles, Award, GraduationCap, MapPin, Heart, ArrowRight, Cpu } from 'lucide-react';

export default function CreatorAndFounderPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Main Creator & Founder Hero Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Header Title - EXACT MATCH REQUIREMENT */}
        <div className="border-b border-[#E5E2D8] pb-6 text-center space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF6A]">
            Creator & Founder — Scalpeutical
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
            Ann Maria Devassy
          </h1>
          <p className="text-sm font-bold text-[#1F3D2B] flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1">
              <GraduationCap size={16} className="text-[#1F3D2B]" />
              <span>M.Pharm — Pharmacy Practice</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#D4AF6A]">
              <Cpu size={16} />
              <span>Integrating Pharmacy with Artificial Intelligence</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#8A8A82]">
              <MapPin size={14} />
              <span>Kerala, India</span>
            </span>
          </p>
        </div>

        {/* Profile Avatar / Logo Display */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          <div className="w-28 h-28 rounded-full border-4 border-[#D4AF6A]/40 p-1 bg-white shadow-md relative overflow-hidden shrink-0">
            <Image
              src="/logo.jpeg"
              alt="Scalpeutical Logo & Creator Emblem"
              width={112}
              height={112}
              className="object-cover w-full h-full rounded-full"
              priority
            />
          </div>

          <div className="text-center sm:text-left space-y-1 max-w-md">
            <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">Integrating Pharmacy with Artificial Intelligence</h3>
            <p className="text-xs text-[#5F5E5A] leading-relaxed">
              Advancing evidence-based digital scalp-care monitoring tools designed to empower patients, support pharmacists, and assist dermatologists without replacing clinical judgment.
            </p>
          </div>
        </div>

        {/* Creator Story Block (Exact Story Text Requirement) */}
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-6 space-y-4 text-xs sm:text-sm text-[#1F3D2B] leading-relaxed">
          <h3 className="font-bold text-base text-[#1F3D2B] flex items-center gap-2 border-b border-[#E5E2D8] pb-2">
            <Sparkles size={18} className="text-[#D4AF6A]" />
            <span>The Creator Story</span>
          </h3>

          <p>
            Scalpeutical was initiated by Ann Maria Devassy as part of her journey toward integrating artificial intelligence with the pharmacy practice field.
          </p>

          <p>
            The application represents an early step in her exploration of modern digital healthcare, generative AI, and research-oriented applications of artificial intelligence in pharmacy and scalp care.
          </p>

          <p>
            Her vision is to explore how AI can support healthcare professionals by organizing information, monitoring changes, supporting documentation, and generating useful insights.
          </p>

          <p className="font-semibold text-[#1F3D2B] bg-[#EAF0E7] p-3 rounded-xl border border-[#3B6D11]/20">
            AI is intended to assist pharmacists, dermatologists, doctors, and other healthcare professionals — not replace their knowledge, clinical judgment, or professional responsibility.
          </p>
        </div>

        {/* Vision Link Section */}
        <div className="pt-2 flex justify-between items-center">
          <Link
            href="/drawer/vision"
            className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Read Founder Vision & Core Principles</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

    </div>
  );
}
