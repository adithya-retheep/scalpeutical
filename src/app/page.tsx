'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { StorageStore } from '../lib/storage-store';
import { ScalpTimelineChart } from '../components/ScalpTimelineChart';
import { PhotoConsistencyMeter } from '../components/PhotoConsistencyMeter';
import { RedFlagBanner } from '../components/RedFlagBanner';
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
  CloudSun
} from 'lucide-react';
import { Assessment, EnvironmentalLog } from '../lib/types';

export default function HomeDashboard() {
  const { user, activeProduct, activePeriod, isAuthenticated } = useAuth();
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [envLogs, setEnvLogs] = useState<EnvironmentalLog[]>([]);
  const [latestWeather, setLatestWeather] = useState<{ tempC: number; humidity: number; condition: string } | null>(null);

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

  const baselineScore = baseline ? baseline.totalScore : 24;
  const currentScore = latestAssessment ? latestAssessment.totalScore : 8;
  const maxScore = baseline ? baseline.maxScore : 33;

  const percentageReduction =
    baselineScore > 0
      ? Math.max(0, Math.round(((baselineScore - currentScore) / baselineScore) * 100))
      : 0;

  // Red Flag Check
  const redFlagSymptoms: string[] = [];
  if (latestAssessment?.scores.flaking === 3 && latestAssessment?.scores.redness === 3) {
    redFlagSymptoms.push('Severe visible flaking with intense scalp erythema');
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Welcome Clinical Banner */}
      <div className="bg-[#1F3D2B] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF6A]/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5]/10 border border-[#D4AF6A]/30 text-[#D4AF6A] text-xs font-semibold mb-3">
              <ShieldCheck size={14} />
              <span>AI-Assisted Scalp Monitoring</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF9F5]">
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5E2D8] mt-1 max-w-xl">
              Currently tracking <strong>{activeProduct?.productName || 'Scalp-Care Routine'}</strong> · Week {currentPeriodAssessments.length || 4} check-in
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tracking/weekly"
              className="bg-[#D4AF6A] hover:bg-[#c29d59] text-[#1F3D2B] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-2"
            >
              <Camera size={16} />
              <span>Weekly Scalp Check</span>
            </Link>
            <Link
              href="/product/scan"
              className="bg-[#FAF9F5]/10 hover:bg-[#FAF9F5]/20 text-[#FAF9F5] border border-[#FAF9F5]/30 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Scan size={16} />
              <span>Scan Product</span>
            </Link>
          </div>
        </div>

        {/* Environmental Weather Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#E5E2D8]">
          <div className="flex items-center gap-2">
            <CloudSun size={16} className="text-[#D4AF6A]" />
            <span>
              Auto-pulled Weather ({user?.location || 'Local Climate'}):{' '}
              <strong>{latestWeather ? `${latestWeather.tempC}°C, ${latestWeather.humidity}% Humidity (${latestWeather.condition})` : '29°C, 78% Humidity (Humid)'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-[#D4AF6A]/80 font-medium">Contextual variable · Non-causal</span>
        </div>
      </div>

      {/* Red Flag Warning Banner */}
      <RedFlagBanner symptoms={redFlagSymptoms} />

      {/* Responsive Multi-Column Clinical Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Scalp Timeline Graph (Innovated Feature #1) */}
        <div className="lg:col-span-2 space-y-6">
          <ScalpTimelineChart
            assessments={assessments}
            trackingPeriods={trackingPeriods}
            environmentalLogs={envLogs}
            height={240}
          />

          {/* Stat Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Symptom Score Card */}
            <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A82] text-xs font-semibold mb-1">
                <span>SYMPTOM SCORE</span>
                <Activity size={16} className="text-[#1F3D2B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1F3D2B]">
                  {currentScore} <span className="text-xs font-normal text-[#8A8A82]">/ {maxScore}</span>
                </span>
                <span className="text-xs text-[#5F5E5A]">Baseline: {baselineScore}</span>
              </div>
              <div className="w-full bg-[#FAF9F5] border border-[#E5E2D8] h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-[#1F3D2B] h-full rounded-full transition-all"
                  style={{ width: `${(currentScore / maxScore) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Observed Change Card */}
            <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A82] text-xs font-semibold mb-1">
                <span>OBSERVED CHANGE</span>
                <TrendingDown size={16} className="text-[#3B6D11]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#3B6D11]">
                  -{percentageReduction}%
                </span>
                <span className="text-xs font-semibold text-[#3B6D11]">Reduction</span>
              </div>
              <p className="text-[11px] text-[#5F5E5A] mt-2">
                Recorded symptoms reduced during this period
              </p>
            </div>

            {/* Current Outcome Card */}
            <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[#8A8A82] text-xs font-semibold mb-1">
                <span>RECORDED STATUS</span>
                <Sparkles size={16} className="text-[#D4AF6A]" />
              </div>
              <div className="mt-1">
                <span className="inline-block bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Observed Improvement
                </span>
              </div>
              <p className="text-[11px] text-[#8A8A82] mt-2">
                High observational confidence
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: Active Product & Tracking Quality Meter */}
        <div className="space-y-6">
          {/* Photo Consistency / Tracking Quality Meter (Innovated Feature #2) */}
          <PhotoConsistencyMeter
            score={88}
            confidenceTier="High"
            framingScore={90}
            lightingScore={86}
            blurScore={88}
          />

          {/* Current Product Info Card */}
          <div className="bg-white border border-[#E5E2D8] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8A8A82] tracking-wider block">
                    CURRENT SCALP-CARE PRODUCT
                  </span>
                  <h3 className="font-bold text-base text-[#1F3D2B]">
                    {activeProduct?.productName || 'Ketoconazole 2% Intensive Solution'}
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E2D8] text-xs font-bold text-[#1F3D2B]">
                  {activeProduct?.brand || 'ScalpPure'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#5F5E5A]">
                <div className="flex justify-between">
                  <span>Active Ingredients:</span>
                  <span className="font-semibold text-[#1F3D2B]">
                    {activeProduct?.activeIngredients?.join(', ') || 'Ketoconazole 2%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tracking Start Date:</span>
                  <span className="font-semibold text-[#1F3D2B]">
                    {activePeriod?.startDate || '28 Aug 2026'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tracking Duration:</span>
                  <span className="font-semibold text-[#1F3D2B]">Week 4 of 4</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E2D8] space-y-2">
              <Link
                href="/tracking/analysis"
                className="w-full bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>View Full Response Analysis</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                href="/report"
                className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Dermatologist Report</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* AI Assistant Quick Launcher */}
          <div className="bg-gradient-to-br from-[#1F3D2B] to-[#2d573d] text-white rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 text-[#D4AF6A]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Scalpeutical AI Assistant</h4>
                <p className="text-[11px] text-[#E5E2D8]">Ask about ingredients, trends & clinical questions</p>
              </div>
            </div>
            <Link
              href="/assistant"
              className="bg-[#D4AF6A] hover:bg-[#c29d59] text-[#1F3D2B] text-xs font-extrabold px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              Ask AI
            </Link>
          </div>
        </div>

      </div>

      {/* Mandatory Observational Medical Disclaimer Box */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#8A8A82] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1F3D2B]">Observational Monitoring Disclaimer:</strong> This application displays recorded user observations over time during product usage. It does NOT diagnose dermatological conditions, establish clinical product efficacy, or prove causation. All treatment decisions should be made with a qualified dermatologist or healthcare professional.
        </div>
      </div>
    </div>
  );
}
