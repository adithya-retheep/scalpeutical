'use client';

import React, { useEffect, useState } from 'react';
import { StorageStore } from '../../../lib/storage-store';
import { EvidenceReference } from '../../../lib/types';
import { BookOpen, ExternalLink, Filter, Search } from 'lucide-react';

export default function EvidenceDatabasePage() {
  const [evidenceList, setEvidenceList] = useState<EvidenceReference[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    setEvidenceList(StorageStore.getEvidence());
  }, []);

  const filtered = evidenceList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.associatedIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.evidenceType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <BookOpen size={14} />
            <span>Peer-Reviewed Clinical Database</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Evidence References</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Sourced scientific literature, clinical trials, systematic reviews, and regulatory guidelines
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3 text-[#8A8A82]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by active ingredient (e.g. Ketoconazole, Zinc Pyrithione)..."
            className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs font-medium text-[#1F3D2B]"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl px-3 py-2 text-xs font-bold text-[#1F3D2B]"
        >
          <option value="all">All Evidence Types</option>
          <option value="clinical_trial">Clinical Trial</option>
          <option value="systematic_review">Systematic Review</option>
          <option value="guideline">Guideline</option>
          <option value="peer_reviewed">Peer-Reviewed</option>
          <option value="manufacturer_claim">Manufacturer Claim (Labeled Separately)</option>
        </select>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.referenceId} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E2D8] pb-3">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  item.evidenceType === 'manufacturer_claim'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-[#EAF0E7] text-[#3B6D11] border border-[#3B6D11]/30'
                }`}
              >
                {item.evidenceType.replace('_', ' ')}
              </span>

              <span className="text-xs font-semibold text-[#D4AF6A]">
                Associated: {item.associatedIngredient}
              </span>
            </div>

            <h3 className="font-bold text-base text-[#1F3D2B] leading-snug">{item.title}</h3>
            <p className="text-xs text-[#8A8A82]">{item.authors} · <em>{item.journalOrSource}</em> ({item.year})</p>

            <p className="text-xs text-[#5F5E5A] bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E2D8] leading-relaxed">
              {item.summary}
            </p>

            <div className="flex justify-end pt-1">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#1F3D2B] hover:underline flex items-center gap-1"
              >
                <span>View Source Literature</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
