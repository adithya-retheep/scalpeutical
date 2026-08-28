'use client';

import React, { useState } from 'react';
import { Settings, Bell, Lock, Smartphone, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../../context/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [weeklyReminder, setWeeklyReminder] = useState(true);
  const [weatherAutoPull, setWeatherAutoPull] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#5F5E5A] border border-[#E5E2D8] text-xs font-bold mb-2">
            <Settings size={14} />
            <span>Preferences & Application Settings</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Settings</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Manage check-in reminders, environmental auto-pulling, and device options
          </p>
        </div>
      </div>

      {saved && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] p-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          <span>Settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 text-xs text-[#1F3D2B]">
        
        <div className="space-y-4">
          <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">Notification & Tracking Preferences</h3>

          <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D8]">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-[#1F3D2B]" />
              <div>
                <p className="font-bold text-[#1F3D2B]">Weekly Scalp Check Reminders</p>
                <p className="text-[#8A8A82] text-[11px]">Receive push / SMS reminders for your weekly scalp photo check-in</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={weeklyReminder}
              onChange={(e) => setWeeklyReminder(e.target.checked)}
              className="w-4 h-4 accent-[#1F3D2B] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D8]">
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-[#D4AF6A]" />
              <div>
                <p className="font-bold text-[#1F3D2B]">Passive Weather & Humidity Auto-Pull</p>
                <p className="text-[#8A8A82] text-[11px]">Auto-fetch local Open-Meteo climate data for saved location per check-in</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={weatherAutoPull}
              onChange={(e) => setWeatherAutoPull(e.target.checked)}
              className="w-4 h-4 accent-[#1F3D2B] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            Save Settings
          </button>
        </div>

      </form>

    </div>
  );
}
