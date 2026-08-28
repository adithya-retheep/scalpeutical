'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { StorageStore } from '../lib/storage-store';
import { ScalpTimelineChart } from '../components/ScalpTimelineChart';
import { PhotoConsistencyMeter } from '../components/PhotoConsistencyMeter';
import { RedFlagBanner } from '../components/RedFlagBanner';
import { AudioNarrator } from '../components/AudioNarrator';
import {
  Scan,
  Camera,
  Activity,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingDown,
  Info,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Calendar,
  CloudSun,
  Bell,
  User as UserIcon,
  CheckCircle,
  Sliders,
  ArrowRight,
  Flame,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Assessment, EnvironmentalLog } from '../lib/types';

export default function HomeDashboard() {
  const { user, activeProduct, activePeriod } = useAuth();
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [envLogs, setEnvLogs] = useState<EnvironmentalLog[]>([]);
  const [latestWeather, setLatestWeather] = useState<{ tempC: number; humidity: number; condition: string } | null>(null);
  
  // Context update inline modal state
  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedStress, setSelectedStress] = useState('Moderate');
  const [selectedSleep, setSelectedSleep] = useState('7 hours');
  const [selectedWash, setSelectedWash] = useState('Every 2 days');
  const [contextSavedToast, setContextSavedToast] = useState(false);

  useEffect(() => {
    // 1. Unauthenticated users FIRST go to Login Page
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // 2. New Users divert to Profile Setup -> Baseline Assessment
    if (user.profileCompleted === false) {
      router.push('/profile');
      return;
    }
    if (user.baselineCompleted === false) {
      router.push('/assessment/baseline');
      return;
    }

    // 3. Returning Users stay on Home Dashboard
    StorageStore.initializeDemoDataIfNeeded();
    const allAssessments = StorageStore.getAssessments();
    setAssessments(allAssessments);
    setEnvLogs(StorageStore.getEnvironmentalLogs());

    // Auto-pull local weather for user location
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLatestWeather({
            tempC: data.tempC,
            humidity: data.humidity,
            condition: data.weatherCondition,
          });
        }
      })
      .catch(() => {});
  }, [user, router]);

  if (!user || user.profileCompleted === false || user.baselineCompleted === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#8A8A82]">
        Directing to authentication / onboarding...
      </div>
    );
  }

  const trackingPeriods = StorageStore.getTrackingPeriods();
  const currentPeriodAssessments = activePeriod
    ? assessments.filter((a) => a.trackingPeriodId === activePeriod.trackingPeriodId)
    : [];

  const baseline = currentPeriodAssessments.find((a) => a.type === 'baseline') || currentPeriodAssessments[0];
  const latestAssessment = currentPeriodAssessments[currentPeriodAssessments.length - 1] || baseline;

  const baselineScore = baseline ? baseline.totalScore : 18;
  const currentScore = latestAssessment ? latestAssessment.totalScore : 10;
  const maxScore = baseline ? baseline.maxScore : 30;

  const percentageReduction =
    baselineScore > 0
      ? Math.max(0, Math.round(((baselineScore - currentScore) / baselineScore) * 100))
      : 44;

  // Time of day greeting generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Red Flag Check
  const redFlagSymptoms: string[] = [];
  if (latestAssessment?.scores.flaking === 3 && latestAssessment?.scores.redness === 3) {
    redFlagSymptoms.push('Severe visible flaking with intense scalp erythema');
  }

  const handleSaveContext = (e: React.FormEvent) => {
    e.preventDefault();
    StorageStore.addEnvironmentalLog({
      logId: `env_${Date.now()}`,
      userId: user.userId,
      date: new Date().toISOString().split('T')[0],
      tempC: latestWeather?.tempC || 29,
      humidity: latestWeather?.humidity || 78,
      weatherCondition: latestWeather?.condition || 'Humid',
      source: 'User Manual Context Update',
    });
    setShowContextModal(false);
    setContextSavedToast(true);
    setTimeout(() => setContextSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300 pb-12">
      
      {/* HOME PAGE HEADER */}
      <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
            {getGreeting()}, {user?.fullName || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8A82] mt-0.5">
            Your personal scalp tracking & observation overview
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => alert('Notifications: All weekly check-in reminders are up to date.')}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E2D8] text-[#1F3D2B] flex items-center justify-center hover:bg-[#FAF9F5] transition-colors relative shadow-2xs cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3B6D11]"></span>
          </button>

          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity shadow-2xs"
            aria-label="Profile"
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon size={18} />}
          </Link>
        </div>
      </div>

      {/* PHILOSOPHY TAGLINE BANNER */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5F5E5A]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1F3D2B] shrink-0" />
          <span className="font-semibold text-[#1F3D2B]">Core Philosophy:</span>
          <span>AI assists. Healthcare professionals decide.</span>
        </div>
        <span className="text-[11px] text-[#8A8A82]">Observational tool · Non-diagnostic</span>
      </div>

      {/* CONTEXT SAVED TOAST */}
      {contextSavedToast && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#1F3D2B] p-3.5 rounded-2xl text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-[#3B6D11]">
            <CheckCircle size={16} />
            <span>Today&apos;s environmental & lifestyle context updated!</span>
          </div>
          <span className="text-[11px] text-[#8A8A82]">Saved</span>
        </div>
      )}

      {/* SECTION 1 — CURRENT PRODUCT CARD */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E2D8] pb-4">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
              SECTION 1 · CURRENT PRODUCT TRACKING
            </span>
            <h2 className="font-bold text-lg sm:text-xl text-[#1F3D2B]">
              {activeProduct?.productName || 'Ketoconazole 2% Intensive Scalp Solution'}
            </h2>
            <p className="text-xs text-[#5F5E5A] mt-0.5">
              Brand: <strong>{activeProduct?.brand || 'ScalpPure Medical'}</strong> · Type: <strong>{activeProduct?.productType || 'Anti-Dandruff Solution'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] text-xs font-bold font-mono">
              Week {currentPeriodAssessments.length || 4} of Tracking
            </span>
            <Link
              href="/product/history"
              className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <span>View Product</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5F5E5A]">
          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] block text-[10px] uppercase font-bold">Active Ingredients</span>
            <span className="font-semibold text-[#1F3D2B]">
              {activeProduct?.activeIngredients?.join(', ') || 'Ketoconazole 2%, Salicylic Acid 1%'}
            </span>
          </div>
          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] block text-[10px] uppercase font-bold">Tracking Start Date</span>
            <span className="font-semibold text-[#1F3D2B]">
              {activePeriod?.startDate || '28 Aug 2026'}
            </span>
          </div>
          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] block text-[10px] uppercase font-bold">Auto Weather Context</span>
            <span className="font-semibold text-[#1F3D2B]">
              {latestWeather ? `${latestWeather.tempC}°C, ${latestWeather.humidity}% (${latestWeather.condition})` : '29°C, 78% Humidity (Humid)'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2 — CURRENT RECORDED STATUS */}
      <div className="bg-[#1F3D2B] text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF6A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D4AF6A] tracking-wider block">
              SECTION 2 · CURRENT RECORDED STATUS
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF9F5]">
              Observation Summary
            </h3>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#D4AF6A] text-[#1F3D2B] px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-2xs">
            <Sparkles size={14} />
            <span>Observed Improvement</span>
          </div>
        </div>

        {/* Score & Reduction Stat Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] text-gray-300 uppercase font-semibold block">Baseline Score</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white">{baselineScore} <span className="text-xs text-gray-400 font-normal">/ {maxScore}</span></span>
          </div>

          <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] text-gray-300 uppercase font-semibold block">Current Score</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#D4AF6A]">{currentScore} <span className="text-xs text-gray-400 font-normal">/ {maxScore}</span></span>
          </div>

          <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-center space-y-1">
            <span className="text-[11px] text-gray-300 uppercase font-semibold block">Recorded Reduction</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#D4AF6A]">{percentageReduction}%</span>
          </div>
        </div>

        <p className="text-xs text-[#E5E2D8] italic border-t border-white/10 pt-3 leading-relaxed">
          &ldquo;This is an observational tracking result and does not establish clinical efficacy or causation.&rdquo;
        </p>
      </div>

      {/* SECTION 3 — BASELINE VS CURRENT PROGRESS */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5E2D8] pb-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
              SECTION 3 · VISUAL PROGRESS
            </span>
            <h3 className="font-bold text-base sm:text-lg text-[#1F3D2B]">
              Baseline vs. Current Scalp Comparison
            </h3>
          </div>

          <Link
            href="/product/compare"
            className="text-xs font-bold text-[#1F3D2B] underline hover:text-[#3B6D11] flex items-center gap-1"
          >
            <span>Compare Images</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Side by Side Image Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* BASELINE CARD */}
          <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#1F3D2B] uppercase tracking-wider">BASELINE RECORD</span>
              <span className="text-[10px] font-mono bg-gray-200 px-2 py-0.5 rounded-md text-gray-700">Day 1</span>
            </div>
            
            <div className="h-32 bg-[#EAF0E7] rounded-xl flex items-center justify-center border border-[#3B6D11]/20 relative overflow-hidden">
              <div className="text-center p-3 space-y-1">
                <Camera size={24} className="mx-auto text-[#1F3D2B]/50" />
                <span className="text-xs font-bold text-[#1F3D2B] block">Baseline Scalp Image</span>
                <span className="text-[10px] text-[#8A8A82] font-mono">Front Hairline & Crown</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#5F5E5A] pt-1">
              <span>Visible Flaking: <strong className="text-amber-700">Moderate (Score 18)</strong></span>
            </div>
          </div>

          {/* CURRENT CARD */}
          <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#3B6D11] uppercase tracking-wider">LATEST RECORD (CURRENT)</span>
              <span className="text-[10px] font-mono bg-[#3B6D11] text-white px-2 py-0.5 rounded-md">Week 4</span>
            </div>
            
            <div className="h-32 bg-white rounded-xl flex items-center justify-center border border-[#3B6D11]/20 relative overflow-hidden">
              <div className="text-center p-3 space-y-1">
                <CheckCircle size={24} className="mx-auto text-[#3B6D11]" />
                <span className="text-xs font-bold text-[#1F3D2B] block">Latest Scalp Image</span>
                <span className="text-[10px] text-[#3B6D11] font-mono font-bold">Observed Flaking Reduced</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-[#5F5E5A] pt-1">
              <span>Visible Flaking: <strong className="text-[#3B6D11]">Mild (Score 10)</strong></span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4 — NEXT ACTION CALLOUT CARD */}
      <div className="bg-gradient-to-r from-[#FAF9F5] to-[#EAF0E7] border border-[#3B6D11]/30 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#3B6D11] block">
            SECTION 4 · NEXT RECOMMENDED ACTION
          </span>
          <h3 className="font-bold text-base sm:text-lg text-[#1F3D2B]">
            Your Weekly Scalp Check Is Ready
          </h3>
          <p className="text-xs text-[#5F5E5A]">
            Record your latest scalp images, visible symptoms, and contextual factors for Week 4.
          </p>
        </div>

        <Link
          href="/tracking/weekly"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Camera size={16} />
          <span>START WEEKLY CHECK</span>
        </Link>
      </div>

      {/* SECTION 5 & 6 — SYMPTOM TREND CHART & LATEST OBSERVATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 5: Symptom Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
                  SECTION 5 · SYMPTOM TREND
                </span>
                <h3 className="font-bold text-base text-[#1F3D2B]">
                  Symptom Score Trajectory (Baseline → Current)
                </h3>
              </div>

              <Link
                href="/tracking/timeline"
                className="text-xs font-bold text-[#1F3D2B] underline hover:text-[#3B6D11]"
              >
                View Full Trend
              </Link>
            </div>

            <ScalpTimelineChart
              assessments={assessments}
              trackingPeriods={trackingPeriods}
              environmentalLogs={envLogs}
              height={220}
            />
          </div>
        </div>

        {/* SECTION 6: Latest Image Observation (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
                SECTION 6 · LATEST OBSERVATION
              </span>
              <h3 className="font-bold text-base text-[#1F3D2B] mt-1">
                AI-Assisted Image Observation
              </h3>

              <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl mt-3 space-y-2 text-xs text-[#5F5E5A]">
                <div className="flex justify-between">
                  <span>Estimated Flaking:</span>
                  <strong className="text-[#3B6D11]">Mild</strong>
                </div>
                <div className="flex justify-between">
                  <span>Compared to Baseline:</span>
                  <strong className="text-[#3B6D11]">Flaking Appears Reduced</strong>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Confidence:</span>
                  <strong className="text-[#1F3D2B]">High Confidence (88%)</strong>
                </div>
              </div>
            </div>

            <Link
              href="/tracking/analysis"
              className="w-full bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-colors mt-4"
            >
              <span>View Detailed Analysis</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

      </div>

      {/* SECTION 7 — QUICK ACTIONS GRID */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
          SECTION 7 · QUICK ACTIONS
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/tracking/weekly"
            className="bg-white hover:bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 shadow-xs text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#EAF0E7] text-[#1F3D2B] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Camera size={20} />
            </div>
            <span className="font-bold text-xs text-[#1F3D2B] block">📷 Scalp Check</span>
            <span className="text-[10px] text-[#8A8A82]">Capture new image</span>
          </Link>

          <Link
            href="/product/scan"
            className="bg-white hover:bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 shadow-xs text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#EAF0E7] text-[#1F3D2B] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Scan size={20} />
            </div>
            <span className="font-bold text-xs text-[#1F3D2B] block">📦 Scan Product</span>
            <span className="text-[10px] text-[#8A8A82]">Scan label / details</span>
          </Link>

          <Link
            href="/report"
            className="bg-white hover:bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 shadow-xs text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#EAF0E7] text-[#1F3D2B] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <FileText size={20} />
            </div>
            <span className="font-bold text-xs text-[#1F3D2B] block">📊 Reports</span>
            <span className="text-[10px] text-[#8A8A82]">Dermatologist report</span>
          </Link>

          <Link
            href="/assistant"
            className="bg-white hover:bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 shadow-xs text-center space-y-2 group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#EAF0E7] text-[#1F3D2B] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <span className="font-bold text-xs text-[#1F3D2B] block">🤖 AI Assistant</span>
            <span className="text-[10px] text-[#8A8A82]">Educational support</span>
          </Link>
        </div>
      </div>

      {/* SECTION 8 — TODAY'S CONTEXT UPDATE CARD */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5E2D8] pb-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block">
              SECTION 8 · CONTEXT UPDATE
            </span>
            <h3 className="font-bold text-base text-[#1F3D2B]">
              Update Today&apos;s Contextual Factors
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowContextModal(!showContextModal)}
            className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders size={14} />
            <span>{showContextModal ? 'Close Form' : 'UPDATE CONTEXT'}</span>
          </button>
        </div>

        {/* Quick Context Chips Preview */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#5F5E5A]">
          <span className="bg-[#FAF9F5] border border-[#E5E2D8] px-3 py-1.5 rounded-full font-semibold">
            Stress: <strong>{selectedStress}</strong>
          </span>
          <span className="bg-[#FAF9F5] border border-[#E5E2D8] px-3 py-1.5 rounded-full font-semibold">
            Sleep: <strong>{selectedSleep}</strong>
          </span>
          <span className="bg-[#FAF9F5] border border-[#E5E2D8] px-3 py-1.5 rounded-full font-semibold">
            Hair Washing: <strong>{selectedWash}</strong>
          </span>
          <span className="bg-[#FAF9F5] border border-[#E5E2D8] px-3 py-1.5 rounded-full font-semibold">
            Weather: <strong>{latestWeather?.condition || 'Humid'}</strong>
          </span>
        </div>

        {/* Inline Context Update Form */}
        {showContextModal && (
          <form onSubmit={handleSaveContext} className="bg-[#FAF9F5] border border-[#E5E2D8] p-4 rounded-2xl space-y-4 pt-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#5F5E5A] mb-1">Stress Level</label>
                <select
                  value={selectedStress}
                  onChange={(e) => setSelectedStress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5E2D8] rounded-xl font-medium"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5F5E5A] mb-1">Sleep Hours</label>
                <select
                  value={selectedSleep}
                  onChange={(e) => setSelectedSleep(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5E2D8] rounded-xl font-medium"
                >
                  <option value="5 hours">5 hours</option>
                  <option value="6 hours">6 hours</option>
                  <option value="7 hours">7 hours</option>
                  <option value="8+ hours">8+ hours</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#5F5E5A] mb-1">Hair Wash Frequency</label>
                <select
                  value={selectedWash}
                  onChange={(e) => setSelectedWash(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E5E2D8] rounded-xl font-medium"
                >
                  <option value="Daily">Daily</option>
                  <option value="Every 2 days">Every 2 days</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-2.5 px-5 rounded-xl font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              Save Contextual Record
            </button>
          </form>
        )}
      </div>

      {/* MULTILINGUAL AUDIO NARRATION PLAYER */}
      <AudioNarrator
        title="Dashboard Audio Summary & Narration"
        textEn={`Welcome ${user?.fullName || 'User'}. You are currently tracking ${activeProduct?.productName || 'Ketoconazole 2 percent Intensive Scalp Solution'} in week 4. Your baseline symptom score was 18 out of 30, and your latest score is 10 out of 30, representing a 44 percent observed reduction. Visible flaking appears reduced with high analysis confidence. Remember, AI assists and healthcare professionals decide.`}
        textMl={`നമസ്കാരം ${user?.fullName || 'ഉപയോക്താവ്'}. നിങ്ങൾ ഇപ്പോൾ പ്രതിവാര തലയോട്ടി നിരീക്ഷണം പൂർത്തിയാക്കുന്നു. നിങ്ങളുടെ ആരംഭ സൂചിക 18 ഉം നിലവിലെ സൂചിക 10 ഉം ആണ്. താരംപിന്റെ അളവ് കുറഞ്ഞതായി കണ്ടെത്തി. ഓർക്കുക, AI സഹായം നൽകുന്നു, ആരോഗ്യ വിദഗ്ദ്ധർ തീരുമാനമെടുക്കുന്നു.`}
      />

      {/* SECTION 9 — IMPORTANT ALERTS (IF APPLICABLE) */}
      {redFlagSymptoms.length > 0 && (
        <RedFlagBanner symptoms={redFlagSymptoms} />
      )}

      {/* MANDATORY CLINICAL DISCLAIMER */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#8A8A82] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1F3D2B]">Observational Monitoring Disclaimer:</strong> Scalpeutical is an observational tracking application designed to document scalp images, symptoms, and contextual factors over time during product usage. It does NOT diagnose dermatological conditions, establish clinical product efficacy, or prove causation. All treatment decisions should be made with a qualified dermatologist or healthcare professional.
        </div>
      </div>

    </div>
  );
}
