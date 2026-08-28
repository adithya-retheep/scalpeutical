'use client';

import React, { useEffect, useState } from 'react';
import { StorageStore } from '../../../lib/storage-store';
import { ScalpTimelineChart } from '../../../components/ScalpTimelineChart';
import { Assessment, TrackingPeriod, EnvironmentalLog } from '../../../lib/types';
import { Activity, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ScalpTimelinePage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [trackingPeriods, setTrackingPeriods] = useState<TrackingPeriod[]>([]);
  const [envLogs, setEnvLogs] = useState<EnvironmentalLog[]>([]);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    setAssessments(StorageStore.getAssessments());
    setTrackingPeriods(StorageStore.getTrackingPeriods());
    setEnvLogs(StorageStore.getEnvironmentalLogs());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Activity size={14} />
            <span>Continuous Longitudinal Graph</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Scalp Timeline</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Full symptom score & flaking severity graph spanning your entire history across all products
          </p>
        </div>

        <Link
          href="/tracking/weekly"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>Log Check-In</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Main Chart */}
      <ScalpTimelineChart
        assessments={assessments}
        trackingPeriods={trackingPeriods}
        environmentalLogs={envLogs}
        height={260}
      />

      {/* Assessment Table */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">Recorded Check-In History Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E5E2D8] text-[#8A8A82] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Week</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Symptom Score</th>
                <th className="py-2.5 px-3">Flaking Rating</th>
                <th className="py-2.5 px-3">Itching Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF9F5]">
              {assessments.map((a) => (
                <tr key={a.assessmentId} className="hover:bg-[#FAF9F5]/70 font-medium text-[#1F3D2B]">
                  <td className="py-3 px-3">{a.date}</td>
                  <td className="py-3 px-3">Week {a.weekNumber}</td>
                  <td className="py-3 px-3">
                    <span className="capitalize px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E2D8] font-bold">
                      {a.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1F3D2B]">{a.totalScore} / {a.maxScore}</td>
                  <td className="py-3 px-3">{a.scores.flaking} / 3</td>
                  <td className="py-3 px-3">{a.scores.itching} / 3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
