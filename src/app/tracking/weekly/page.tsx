'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { StorageStore } from '../../../lib/storage-store';
import { Assessment, SymptomScores, SymptomScoreValue, ContextLog, EnvironmentalLog } from '../../../lib/types';
import { Activity, CloudSun, Calendar, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export default function WeeklyCheckInPage() {
  const { activePeriod, user } = useAuth();
  const router = useRouter();

  const [scores, setScores] = useState<SymptomScores>({
    flaking: 1,
    itching: 0,
    redness: 0,
    irritation: 1,
    oiliness: 1,
    scaling: 1,
    affectedArea: 1,
    duration: 1,
    frequency: 1,
    userSeverity: 1,
    dailyImpact: 0,
  });

  const [stress, setStress] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [sleepHours, setSleepHours] = useState(7);
  const [washFreq, setWashFreq] = useState('2-3 times weekly');
  const [headCovering, setHeadCovering] = useState(false);
  const [lifestyleNotes, setLifestyleNotes] = useState('');

  // Weather state
  const [weather, setWeather] = useState<{ tempC: number; humidity: number; condition: string } | null>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWeather({ tempC: data.tempC, humidity: data.humidity, condition: data.weatherCondition });
        }
      });
  }, []);

  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trackingPeriodId = activePeriod?.trackingPeriodId || 'period_101';

    // 1. Assessment
    const weeklyAssessment: Assessment = {
      assessmentId: `assess_${Math.random().toString(36).substring(2, 9)}`,
      trackingPeriodId,
      userId: user?.userId || 'user_demo_101',
      type: 'weekly',
      weekNumber: 4,
      scores,
      totalScore,
      maxScore: 33,
      algorithmVersion: '1.0.0',
      date: new Date().toISOString().split('T')[0],
    };
    StorageStore.addAssessment(weeklyAssessment);

    // 2. Weather Log (Innovated Feature #3)
    if (weather) {
      const envLog: EnvironmentalLog = {
        logId: `env_${Math.random().toString(36).substring(2, 9)}`,
        userId: user?.userId || 'user_demo_101',
        date: new Date().toISOString().split('T')[0],
        tempC: weather.tempC,
        humidity: weather.humidity,
        weatherCondition: weather.condition,
        source: 'Open-Meteo Weather API',
      };
      StorageStore.addEnvironmentalLog(envLog);
    }

    router.push('/tracking/analysis');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Activity size={14} />
            <span>Weekly Follow-Up Check-In</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Week 4 Scalp Check</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Record current symptom scores, lifestyle context, and auto-pulled weather variables
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#E5E2D8] p-3 rounded-2xl text-center hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-[#8A8A82] block">Current Score</span>
          <span className="text-xl font-bold text-[#3B6D11]">{totalScore} / 33</span>
        </div>
      </div>

      {/* Auto-Pulled Environmental Weather Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun size={20} className="text-[#D4AF6A]" />
            <h3 className="font-bold text-sm text-[#1F3D2B]">Auto-Pulled Environmental Weather Data</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-[#3B6D11] bg-[#EAF0E7] px-2.5 py-0.5 rounded-full">
            Live Open-Meteo
          </span>
        </div>

        <p className="text-xs text-[#5F5E5A]">
          Temperature: <strong>{weather ? `${weather.tempC}°C` : '29°C'}</strong> · Humidity: <strong>{weather ? `${weather.humidity}%` : '78%'}</strong> ({weather?.condition || 'Humid'})
        </p>
        <p className="text-[11px] text-[#8A8A82] italic">
          Displayed as a soft overlay on your timeline. Labeled strictly as a contextual variable — non-causal.
        </p>
      </div>

      {/* Check-In Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">1. Symptom Rating Update</h3>

        {/* Quick Sliders / Options for Key Symptoms */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1F3D2B] mb-1">Visible Flaking Rating (0–3)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setScores({ ...scores, flaking: val as SymptomScoreValue })}
                  className={`p-2.5 rounded-xl font-bold border transition-all ${
                    scores.flaking === val ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' : 'bg-[#FAF9F5] text-[#5F5E5A] border-[#E5E2D8]'
                  }`}
                >
                  {val === 0 ? '0 None' : val === 1 ? '1 Mild' : val === 2 ? '2 Moderate' : '3 Severe'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F3D2B] mb-1">Scalp Itching Rating (0–3)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setScores({ ...scores, itching: val as SymptomScoreValue })}
                  className={`p-2.5 rounded-xl font-bold border transition-all ${
                    scores.itching === val ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' : 'bg-[#FAF9F5] text-[#5F5E5A] border-[#E5E2D8]'
                  }`}
                >
                  {val === 0 ? '0 None' : val === 1 ? '1 Mild' : val === 2 ? '2 Moderate' : '3 Severe'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lifestyle Factors */}
        <div className="border-t border-[#E5E2D8] pt-4 space-y-4">
          <h3 className="font-bold text-base text-[#1F3D2B]">2. Lifestyle & Context Factors</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#5F5E5A] mb-1">Perceived Stress Level</label>
              <select
                value={stress}
                onChange={(e) => setStress(e.target.value as any)}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs font-semibold text-[#1F3D2B]"
              >
                <option value="Low">Low Stress</option>
                <option value="Moderate">Moderate Stress</option>
                <option value="High">High Stress</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#5F5E5A] mb-1">Wash Frequency This Week</label>
              <input
                type="text"
                value={washFreq}
                onChange={(e) => setWashFreq(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs font-semibold text-[#1F3D2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5F5E5A] mb-1">Additional Lifestyle / Hair-Care Notes</label>
            <textarea
              rows={2}
              value={lifestyleNotes}
              onChange={(e) => setLifestyleNotes(e.target.value)}
              placeholder="e.g. Tried new hair oil, intense sweating from workout..."
              className="w-full p-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs text-[#1F3D2B]"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span>Save Check-In & Generate Product Analysis</span>
          <ArrowRight size={16} />
        </button>
      </form>

    </div>
  );
}
