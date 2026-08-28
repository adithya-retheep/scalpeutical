'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { StorageStore } from '../../../lib/storage-store';
import { AllergyConflictFlag, Product, TrackingPeriod } from '../../../lib/types';
import { Scan, Camera, Upload, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function ScanProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Extracted Fields State
  const [extracted, setExtracted] = useState<any>(null);
  const [conflictFlags, setConflictFlags] = useState<AllergyConflictFlag[]>([]);
  const [disclaimerMsg, setDisclaimerMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRunOCR = async () => {
    setIsScanning(true);
    setConflictFlags([]);

    try {
      // Send sample base64 or mock request to /api/ocr
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previews[0] || '',
          userAllergies: user?.knownAllergies || ['Salicylic Acid', 'Synthetic Fragrance'],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExtracted(data.extractedData);
        setConflictFlags(data.allergyFlags || []);
        setDisclaimerMsg(data.disclaimer);
      }
    } catch (err) {
      console.warn("OCR API error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmProduct = () => {
    if (!extracted) return;

    const newProdId = `prod_${Math.random().toString(36).substring(2, 9)}`;
    const product: Product = {
      productId: newProdId,
      userId: user?.userId || 'user_demo_101',
      brand: extracted.brand,
      productName: extracted.productName,
      productType: extracted.productType,
      activeIngredients: extracted.activeIngredients,
      concentration: extracted.concentration,
      directions: extracted.directions,
      warnings: extracted.warnings,
      manufacturer: extracted.manufacturer,
      description: extracted.description,
      labelImageUrl: previews[0] || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    StorageStore.addProduct(product);

    // Create New Tracking Period
    const newPeriod: TrackingPeriod = {
      trackingPeriodId: `period_${Math.random().toString(36).substring(2, 9)}`,
      userId: user?.userId || 'user_demo_101',
      productId: newProdId,
      productName: product.productName,
      brand: product.brand,
      startDate: new Date().toISOString().split('T')[0],
      baselineAssessmentId: 'assess_base',
      status: 'In progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageStore.createTrackingPeriod(newPeriod);
    router.push(`/product/${newProdId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <Scan size={14} />
            <span>Product OCR & Vision Extraction</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Scan My Product</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Capture or upload product packaging (front, back, active ingredients, warnings)
          </p>
        </div>
      </div>

      {/* Upload & Camera Box */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1F3D2B]">1. Upload Packaging Images</h3>

        <div className="border-2 border-dashed border-[#E5E2D8] hover:border-[#1F3D2B] bg-[#FAF9F5] rounded-2xl p-8 text-center transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            id="product-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="product-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
            <div className="p-4 bg-white border border-[#E5E2D8] rounded-2xl text-[#1F3D2B] shadow-xs">
              <Camera size={28} />
            </div>
            <p className="text-sm font-bold text-[#1F3D2B]">Tap to Capture or Upload Packaging Images</p>
            <p className="text-xs text-[#8A8A82]">Front label, ingredient list, directions, warning panel</p>
          </label>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5F5E5A]">Uploaded Images ({previews.length})</p>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-[#E5E2D8] relative bg-black/5">
                  <img src={src} alt="Label preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {!extracted && (
              <button
                type="button"
                onClick={handleRunOCR}
                disabled={isScanning}
                className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {isScanning ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Extracting Product Info via Vision OCR...</span>
                  </>
                ) : (
                  <>
                    <Scan size={16} />
                    <span>Analyze Product Label & Check Allergy Conflicts</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Extracted Product Information & Ingredient Conflict Check */}
      {extracted && (
        <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between border-b border-[#E5E2D8] pb-3">
            <h3 className="font-bold text-lg text-[#1F3D2B]">2. Extracted Product Information</h3>
            <span className="text-xs text-[#3B6D11] font-bold bg-[#EAF0E7] px-3 py-1 rounded-full">
              OCR Complete
            </span>
          </div>

          {/* Innovated Feature #5: Ingredient-Conflict Flag Warning Banner */}
          {conflictFlags.length > 0 ? (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle size={18} className="text-amber-700 shrink-0" />
                <span>Non-Diagnostic Ingredient-Conflict Flag</span>
              </div>
              {conflictFlags.map((flag, idx) => (
                <p key={idx} className="text-xs text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200 font-medium">
                  {flag.message}
                </p>
              ))}
            </div>
          ) : (
            <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 rounded-2xl p-3 text-xs text-[#3B6D11] font-medium flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>No ingredient conflict flags detected against your saved allergy list ({user?.knownAllergies?.join(', ') || 'None'}).</span>
            </div>
          )}

          {/* Extracted Fields Input / Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">Brand Name</label>
              <input
                type="text"
                value={extracted.brand}
                onChange={(e) => setExtracted({ ...extracted, brand: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-semibold text-[#1F3D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">Product Name</label>
              <input
                type="text"
                value={extracted.productName}
                onChange={(e) => setExtracted({ ...extracted, productName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-semibold text-[#1F3D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">Active Ingredients</label>
              <input
                type="text"
                value={extracted.activeIngredients?.join(', ')}
                onChange={(e) => setExtracted({ ...extracted, activeIngredients: e.target.value.split(', ') })}
                className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-semibold text-[#1F3D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">Concentration</label>
              <input
                type="text"
                value={extracted.concentration}
                onChange={(e) => setExtracted({ ...extracted, concentration: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-semibold text-[#1F3D2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">Directions for Use</label>
            <textarea
              rows={2}
              value={extracted.directions}
              onChange={(e) => setExtracted({ ...extracted, directions: e.target.value })}
              className="w-full p-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs text-[#1F3D2B]"
            ></textarea>
          </div>

          <p className="text-[11px] text-[#8A8A82]">
            {disclaimerMsg || 'Product information was extracted from uploaded packaging and should be verified against physical product.'}
          </p>

          <button
            type="button"
            onClick={handleConfirmProduct}
            className="w-full bg-[#1F3D2B] hover:bg-[#152a1d] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>Confirm Product & Start Tracking Period</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
