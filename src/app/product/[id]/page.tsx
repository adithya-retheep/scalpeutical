'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { StorageStore } from '../../../lib/storage-store';
import { Product, TrackingPeriod, AllergyConflictFlag } from '../../../lib/types';
import { ClipboardList, ShieldCheck, AlertTriangle, ArrowRight, BookOpen, Clock, Camera } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [period, setPeriod] = useState<TrackingPeriod | null>(null);
  const [conflictFlags, setConflictFlags] = useState<AllergyConflictFlag[]>([]);

  useEffect(() => {
    StorageStore.initializeDemoDataIfNeeded();
    const prod = StorageStore.getProductById(productId) || StorageStore.getProducts()[0];
    setProduct(prod);

    const periods = StorageStore.getTrackingPeriods();
    const matchPeriod = periods.find((p) => p.productId === prod.productId) || periods[periods.length - 1];
    setPeriod(matchPeriod);

    const user = StorageStore.getUser();
    if (prod && user) {
      const flags = StorageStore.checkAllergyConflict(prod.activeIngredients, user.knownAllergies || []);
      setConflictFlags(flags);
    }
  }, [productId]);

  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header Card */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#8A8A82] block mb-1">
            Product Tracking Record
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">{product.productName}</h2>
          <p className="text-xs font-semibold text-[#D4AF6A] mt-1">{product.brand} · {product.productType}</p>
        </div>

        <Link
          href="/tracking/camera"
          className="bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <Camera size={16} />
          <span>Capture Scalp Photo</span>
        </Link>
      </div>

      {/* Allergy Conflict Flag Banner */}
      {conflictFlags.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle size={18} className="text-amber-700 shrink-0" />
            <span>Ingredient-Conflict Warning</span>
          </div>
          {conflictFlags.map((flag, idx) => (
            <p key={idx} className="text-xs text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200 font-medium">
              {flag.message}
            </p>
          ))}
        </div>
      )}

      {/* Product Details Section */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-[#1F3D2B] border-b border-[#E5E2D8] pb-3">Extracted Label Specifications</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-0.5">ACTIVE INGREDIENTS</span>
            <span className="font-semibold text-[#1F3D2B] text-sm">{product.activeIngredients.join(', ')}</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-0.5">CONCENTRATION</span>
            <span className="font-semibold text-[#1F3D2B] text-sm">{product.concentration || 'Not specified'}</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-0.5">MANUFACTURER</span>
            <span className="font-semibold text-[#1F3D2B]">{product.manufacturer || 'Label Provider'}</span>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E5E2D8]">
            <span className="text-[#8A8A82] font-bold block mb-0.5">TRACKING START DATE</span>
            <span className="font-semibold text-[#1F3D2B]">{period?.startDate || '28 Aug 2026'}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-[#8A8A82] uppercase block mb-1">Directions for Use</span>
          <p className="text-xs text-[#5F5E5A] bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E5E2D8] leading-relaxed">
            {product.directions}
          </p>
        </div>

        {product.warnings && (
          <div>
            <span className="text-xs font-bold text-[#8A8A82] uppercase block mb-1">Warnings & Cautions</span>
            <p className="text-xs text-amber-900 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 leading-relaxed font-medium">
              {product.warnings}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-[#E5E2D8] flex flex-wrap gap-3">
          <Link
            href="/product/compare"
            className="flex-1 bg-[#FAF9F5] hover:bg-[#F1EFE8] border border-[#E5E2D8] text-[#1F3D2B] py-3 rounded-xl font-bold text-xs text-center transition-colors"
          >
            Compare With Tracked Products
          </Link>
          <Link
            href="/tracking/weekly"
            className="flex-1 bg-[#1F3D2B] text-white py-3 rounded-xl font-bold text-xs text-center transition-colors shadow-xs"
          >
            Log Weekly Check-In
          </Link>
        </div>

      </div>

    </div>
  );
}
