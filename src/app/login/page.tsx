'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#8A8A82]">
      Redirecting to Scalpeutical Sign In...
    </div>
  );
}
