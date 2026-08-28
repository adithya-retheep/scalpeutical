'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  UserCheck,
  Sparkles,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/auth-context';

interface HeaderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeaderDrawer({ isOpen, onClose }: HeaderDrawerProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const menuItems = [
    {
      title: 'Creator & Founder',
      subtitle: 'Ann Maria Devassy, M.Pharm',
      icon: UserCheck,
      href: '/drawer/creator',
      color: 'text-[#1F3D2B]',
    },
    {
      title: 'Vision',
      subtitle: 'AI Integration in Digital Healthcare',
      icon: Sparkles,
      href: '/drawer/vision',
      color: 'text-[#D4AF6A]',
    },
    {
      title: 'Evidence References',
      subtitle: 'Clinical studies & literature',
      icon: BookOpen,
      href: '/drawer/evidence',
      color: 'text-emerald-700',
    },
    {
      title: 'Privacy Policy',
      subtitle: 'Data security & image deletion',
      icon: ShieldCheck,
      href: '/drawer/privacy',
      color: 'text-slate-700',
    },
    {
      title: 'Medical Disclaimer',
      subtitle: 'Observational safety guidelines',
      icon: AlertTriangle,
      href: '/drawer/disclaimer',
      color: 'text-amber-700',
    },
    {
      title: 'Settings',
      subtitle: 'Account & preference management',
      icon: Settings,
      href: '/drawer/settings',
      color: 'text-slate-700',
    },
  ];

  const handleLogout = () => {
    onClose();
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div
        className="w-full max-w-sm bg-[#FAF9F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E2D8] animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div>
          <div className="p-4 bg-[#1F3D2B] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF9F5]/10 border border-[#D4AF6A]/40 flex items-center justify-center text-[#D4AF6A] font-semibold text-sm">
                {user?.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#FAF9F5]">{user?.fullName || 'Scalpeutical User'}</h3>
                <p className="text-xs text-[#D4AF6A]">{user?.phoneNumber || 'Member'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 py-2 bg-[#EAF0E7] border-b border-[#E5E2D8] text-xs text-[#1F3D2B] font-medium flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#3B6D11]" />
            <span>AI-Assisted Scalp Monitoring Tool</span>
          </div>

          {/* Drawer Menu List */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white border border-transparent hover:border-[#E5E2D8] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-xs border border-[#E5E2D8] ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1F3D2B] group-hover:text-[#3B6D11] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#8A8A82]">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#8A8A82] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer / Logout */}
        <div className="p-4 border-t border-[#E5E2D8] bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
          <p className="text-[11px] text-center text-[#8A8A82] mt-3">
            Scalpeutical v1.0.0 · Professional Clinical Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
