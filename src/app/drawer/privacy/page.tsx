'use client';

import React, { useState } from 'react';
import { ShieldCheck, Trash2, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [deletedMsg, setDeletedMsg] = useState(false);

  const handleDeleteAllImages = () => {
    localStorage.removeItem('scalpeutical_scalpImages');
    setDeletedMsg(true);
    setTimeout(() => setDeletedMsg(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <ShieldCheck size={14} />
            <span>Sensitive Data Protection & User Rights</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Privacy Policy & Image Security</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Complete transparency regarding your scalp images, health logs, and data deletion
          </p>
        </div>
      </div>

      {deletedMsg && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] p-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          <span>All stored scalp images have been permanently deleted from local device storage.</span>
        </div>
      )}

      {/* Privacy Notice Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 text-xs text-[#1F3D2B] leading-relaxed">
        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">1. Scalp Image Privacy Guarantees</h3>

        <ul className="space-y-3 list-disc list-inside bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D8]">
          <li><strong>Explicit Consent:</strong> Scalp images are processed strictly upon your explicit check-in action.</li>
          <li><strong>No Model Training:</strong> Your scalp photographs are NEVER used for AI model training or public dataset curation.</li>
          <li><strong>Encrypted Storage:</strong> Images and clinical logs are protected with Firebase security rules restricting access exclusively to your authenticated user account.</li>
          <li><strong>Full User Control:</strong> You maintain the right to delete individual scalp photos or initiate account data purge at any time.</li>
        </ul>

        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3 pt-2">2. Data Deletion Request Flow</h3>

        <div className="space-y-3">
          <p className="text-[#5F5E5A]">
            You can purge all locally stored scalp images instantly using the control below:
          </p>

          <button
            type="button"
            onClick={handleDeleteAllImages}
            className="bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <Trash2 size={16} />
            <span>Purge All My Scalp Images Immediately</span>
          </button>
        </div>
      </div>

    </div>
  );
}
