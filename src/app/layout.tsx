'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { AuthProvider } from '../context/auth-context';
import { HeaderDrawer } from '../components/HeaderDrawer';
import { Navigation } from '../components/Navigation';
import './globals.css';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';

  return (
    <>
      {/* Header Bar - Shown ONLY after signing in (Hidden on Auth Pages) */}
      {!isAuthPage && (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E2D8] shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Top-Left: Crisp, undistorted aspect ratio container */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full border border-[#E5E2D8] overflow-hidden flex items-center justify-center bg-white shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.jpeg"
                  alt="Scalpeutical Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-extrabold tracking-tight text-[#1F3D2B] leading-none">
                  SCALPEUTICAL
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-[#8A8A82] font-semibold mt-0.5">
                  Scalp Monitoring
                </p>
              </div>
            </Link>

            {/* Header Right Action: 3-Dot (⋮) Overflow Drawer Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2.5 text-[#5F5E5A] hover:text-[#1F3D2B] hover:bg-[#FAF9F5] rounded-full border border-transparent hover:border-[#E5E2D8] transition-all"
              aria-label="Open secondary navigation menu"
            >
              <MoreVertical size={22} />
            </button>
          </div>
        </header>
      )}

      {/* Secondary Drawer Component */}
      {!isAuthPage && <HeaderDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />}

      {/* Main Layout Body - Responsive Phone & Desktop */}
      <div className={`flex-1 w-full mx-auto flex ${!isAuthPage ? 'max-w-7xl' : ''}`}>
        {/* Desktop Left Sidebar Navigation */}
        <Navigation />

        {/* Main Content Area */}
        <main className={`flex-1 max-w-full overflow-x-hidden ${!isAuthPage ? 'p-4 sm:p-6 md:p-8 pb-20 md:pb-8' : 'p-4 flex items-center justify-center min-h-screen'}`}>
          {children}
        </main>
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Scalpeutical — AI-Assisted Scalp-Care Monitoring</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <body className="bg-[#FAF9F5] text-[#1F3D2B] min-h-screen flex flex-col font-sans antialiased selection:bg-[#D4AF6A]/30">
        <AuthProvider>
          <MainLayoutContent>{children}</MainLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
