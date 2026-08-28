'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardCheck,
  Scan,
  Activity,
  User,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/auth-context';

export function Navigation() {
  const pathname = usePathname();
  const { activeProduct } = useAuth();

  const primaryNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Assess', href: '/assessment/baseline', icon: ClipboardCheck },
    { name: 'Product', href: '/product/scan', icon: Scan },
    { name: 'Tracking', href: '/tracking/weekly', icon: Activity },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const desktopSecondaryItems = [
    { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
    { name: 'Product History', href: '/product/history', icon: Clock },
    { name: 'Clinical Report', href: '/report', icon: FileText },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Phone Bottom Navigation Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E2D8] px-2 py-1.5 flex justify-around items-center shadow-lg">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                active
                  ? 'text-[#1F3D2B] font-bold bg-[#EAF0E7]'
                  : 'text-[#8A8A82] hover:text-[#5F5E5A]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Laptop / Desktop Left Sidebar Navigation (>= 768px) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E5E2D8] bg-[#FAF9F5] min-h-[calc(100vh-4rem)] p-4 shrink-0 justify-between">
        <div className="space-y-6">
          {/* Active Product Quick Info Box */}
          <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-[#8A8A82] tracking-wider">Currently Tracking</span>
              <span className="w-2 h-2 rounded-full bg-[#3B6D11] animate-pulse"></span>
            </div>
            <p className="font-bold text-sm text-[#1F3D2B] truncate">
              {activeProduct ? activeProduct.productName : 'No Active Product'}
            </p>
            <p className="text-xs text-[#5F5E5A]">
              {activeProduct ? activeProduct.brand : 'Scan a product to begin'}
            </p>
            <Link
              href="/product/scan"
              className="mt-3 w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle size={14} />
              <span>Scan Product</span>
            </Link>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A82] mb-2">
              Main Dashboard
            </p>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? 'bg-[#1F3D2B] text-[#FAF9F5] shadow-xs'
                      : 'text-[#5F5E5A] hover:bg-white hover:text-[#1F3D2B] border border-transparent hover:border-[#E5E2D8]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Clinical & AI Tools Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#8A8A82] mb-2">
              Clinical & AI Tools
            </p>
            {desktopSecondaryItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    active
                      ? 'bg-[#1F3D2B] text-[#FAF9F5] shadow-xs'
                      : 'text-[#5F5E5A] hover:bg-white hover:text-[#1F3D2B] border border-transparent hover:border-[#E5E2D8]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Medical Disclaimer Tag */}
        <div className="pt-4 border-t border-[#E5E2D8] text-[11px] text-[#8A8A82]">
          <p className="font-semibold text-[#1F3D2B] flex items-center gap-1">
            <Sparkles size={12} className="text-[#D4AF6A]" /> Scalpeutical Clinical AI
          </p>
          <p className="mt-1 leading-tight">AI assists monitoring. Healthcare professionals decide.</p>
        </div>
      </aside>
    </>
  );
}
