'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context';
import { UserCheck, Plus, X, ArrowRight, Save, Info, AlertTriangle, Globe, Sparkles } from 'lucide-react';

// CLINICAL TYPE-AHEAD SUGGESTION LISTS
const COMMON_ALLERGIES_SUGGESTIONS = [
  'Salicylic Acid',
  'Synthetic Fragrance',
  'Sodium Lauryl Sulfate (SLS)',
  'Parabens',
  'Coal Tar',
  'Ketoconazole',
  'Formaldehyde Releasers',
  'Essential Oils',
  'Linalool',
  'Limonene',
  'Propylene Glycol',
  'Methylisothiazolinone (MIT)'
];

const COMMON_CONCERNS_SUGGESTIONS = [
  'Visible flaking',
  'Occasional itching',
  'Scalp dryness',
  'Redness & irritation',
  'Excess oiliness',
  'Scalp tightness',
  'Hair thinning',
  'Follicle tenderness',
  'Product buildup',
  'Sensitivity to weather'
];

const COMMON_HEALTH_CONDITIONS_SUGGESTIONS = [
  'Seasonal allergies',
  'Eczema / Atopic Dermatitis',
  'Asthma',
  'Psoriasis',
  'Thyroid imbalance',
  'Hypertension',
  'None'
];

const COMMON_MEDICATIONS_SUGGESTIONS = [
  'None',
  'Antihistamines',
  'Topical Corticosteroid',
  'Antifungal Shampoo',
  'Biotin Supplement',
  'Vitamin D3',
  'Minoxidil'
];

export default function ProfilePage() {
  const { user, updateProfile, completeProfileStep } = useAuth();
  const router = useRouter();

  // All text fields start completely empty if user has not provided them
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [ageRange, setAgeRange] = useState(user?.ageRange || '25-34');
  const [sex, setSex] = useState(user?.sex || 'Male');
  const [location, setLocation] = useState(user?.location || '');
  const [hairType, setHairType] = useState(user?.hairType || '');
  const [dietaryInfo, setDietaryInfo] = useState(user?.dietaryInfo || '');
  const [relevantHistory, setRelevantHistory] = useState(user?.relevantHistory || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ml'>(user?.preferredLanguage || 'en');

  // Arrays start empty or user-configured
  const [concerns, setConcerns] = useState<string[]>(user?.scalpConcerns || []);
  const [newConcern, setNewConcern] = useState('');
  const [showConcernSuggestions, setShowConcernSuggestions] = useState(false);

  const [allergies, setAllergies] = useState<string[]>(user?.knownAllergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [showAllergySuggestions, setShowAllergySuggestions] = useState(false);

  const [healthConditions, setHealthConditions] = useState<string[]>(user?.healthConditions || ['Seasonal allergies']);
  const [newCondition, setNewCondition] = useState('');
  const [showConditionSuggestions, setShowConditionSuggestions] = useState(false);

  const [medications, setMedications] = useState<string[]>(user?.currentMedications || ['None']);
  const [newMed, setNewMed] = useState('');
  const [showMedSuggestions, setShowMedSuggestions] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Item Helpers
  const addAllergy = (item: string) => {
    const val = item.trim();
    if (val && !allergies.includes(val)) {
      setAllergies([...allergies, val]);
    }
    setNewAllergy('');
    setShowAllergySuggestions(false);
  };

  const addConcern = (item: string) => {
    const val = item.trim();
    if (val && !concerns.includes(val)) {
      setConcerns([...concerns, val]);
    }
    setNewConcern('');
    setShowConcernSuggestions(false);
  };

  const addCondition = (item: string) => {
    const val = item.trim();
    if (val && !healthConditions.includes(val)) {
      setHealthConditions([...healthConditions, val]);
    }
    setNewCondition('');
    setShowConditionSuggestions(false);
  };

  const addMed = (item: string) => {
    const val = item.trim();
    if (val && !medications.includes(val)) {
      setMedications([...medications, val]);
    }
    setNewMed('');
    setShowMedSuggestions(false);
  };

  const saveProfileData = () => {
    updateProfile({
      fullName: fullName.trim() ? fullName.trim() : null,
      ageRange,
      sex: sex as any,
      location,
      hairType,
      dietaryInfo,
      scalpConcerns: concerns,
      knownAllergies: allergies,
      healthConditions,
      currentMedications: medications,
      relevantHistory,
      preferredLanguage,
    });
    completeProfileStep();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfileData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleProceedToBaseline = () => {
    saveProfileData();
    router.push('/assessment/baseline');
  };

  // Filtered Suggestion Generators
  const filteredAllergies = COMMON_ALLERGIES_SUGGESTIONS.filter(
    (item) => item.toLowerCase().includes(newAllergy.toLowerCase()) && !allergies.includes(item)
  );

  const filteredConcerns = COMMON_CONCERNS_SUGGESTIONS.filter(
    (item) => item.toLowerCase().includes(newConcern.toLowerCase()) && !concerns.includes(item)
  );

  const filteredConditions = COMMON_HEALTH_CONDITIONS_SUGGESTIONS.filter(
    (item) => item.toLowerCase().includes(newCondition.toLowerCase()) && !healthConditions.includes(item)
  );

  const filteredMeds = COMMON_MEDICATIONS_SUGGESTIONS.filter(
    (item) => item.toLowerCase().includes(newMed.toLowerCase()) && !medications.includes(item)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E7] text-[#3B6D11] text-xs font-bold mb-2">
            <UserCheck size={14} />
            <span>Patient/User Demographic & Health Profile</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">User Profile Setup</h2>
          <p className="text-xs text-[#8A8A82] mt-1">
            Enter demographics, health, allergies, climate, hair type, and dietary information
          </p>
        </div>
      </div>

      {/* Why Information is Collected Callout */}
      <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 text-xs text-[#5F5E5A] flex items-start gap-3">
        <Info size={18} className="text-[#D4AF6A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#1F3D2B]">Why is health, climate & allergy info collected?</strong>
          <p className="mt-1 leading-relaxed">
            Allergies are cross-referenced in scanned product ingredients. Climate, hair type, and dietary notes help contextualize weekly flaking observations and support English & Malayalam audio-narrated reports.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#EAF0E7] border border-[#3B6D11]/30 text-[#3B6D11] p-4 rounded-2xl text-xs font-bold text-center">
          Profile updated successfully! Information saved cleanly.
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E2D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Language Preference */}
        <div className="bg-[#FAF9F5] border border-[#E5E2D8] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-xs text-[#1F3D2B] flex items-center gap-1.5">
              <Globe size={16} className="text-[#D4AF6A]" />
              <span>Language Preference for Text & Audio Guidance</span>
            </span>
            <p className="text-[11px] text-[#8A8A82] mt-0.5">Select language for scan guidance, reports, and voice narration</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreferredLanguage('en')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                preferredLanguage === 'en'
                  ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                  : 'bg-white text-[#5F5E5A] border-[#E5E2D8]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setPreferredLanguage('ml')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                preferredLanguage === 'ml'
                  ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                  : 'bg-white text-[#5F5E5A] border-[#E5E2D8]'
              }`}
            >
              മലയാളം (Malayalam)
            </button>
          </div>
        </div>

        {/* Basic Info & Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Age Range
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
            >
              <option value="18-24">18–24 years</option>
              <option value="25-34">25–34 years</option>
              <option value="35-44">35–44 years</option>
              <option value="45-54">45–54 years</option>
              <option value="55+">55+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              Sex / Gender
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Location & Hair Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              LOCATION & LOCAL CLIMATE (CITY, REGION)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kochi, Kerala, India"
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              HAIR TYPE & TEXTURE
            </label>
            <input
              type="text"
              value={hairType}
              onChange={(e) => setHairType(e.target.value)}
              placeholder="e.g. Wavy, Straight, Curly, Fine/Thin"
              className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
            />
          </div>
        </div>

        {/* Dietary Info */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
            RELEVANT DIETARY INFORMATION
          </label>
          <input
            type="text"
            value={dietaryInfo}
            onChange={(e) => setDietaryInfo(e.target.value)}
            placeholder="e.g. Balanced, Vegetarian, High dairy, Low processed sugar"
            className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm font-medium text-[#1F3D2B]"
          />
        </div>

        {/* KNOWN ALLERGIES & SENSITIVITIES WITH TYPE-AHEAD SUGGESTIONS */}
        <div className="border-t border-[#E5E2D8] pt-4 relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2B] mb-1 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-[#D4AF6A]" />
            <span>KNOWN ALLERGIES & SENSITIVITIES (CROSS-REFERENCED IN PRODUCT SCANS)</span>
          </label>
          
          <div className="flex flex-wrap gap-2 my-2">
            {allergies.length === 0 ? (
              <span className="text-xs text-[#8A8A82] italic">No allergies added yet. Type below to add.</span>
            ) : (
              allergies.map((item, idx) => (
                <span key={idx} className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span>{item}</span>
                  <button type="button" onClick={() => setAllergies(allergies.filter((_, i) => i !== idx))} className="hover:text-red-700">
                    <X size={13} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => {
                  setNewAllergy(e.target.value);
                  setShowAllergySuggestions(true);
                }}
                onFocus={() => setShowAllergySuggestions(true)}
                placeholder="Type allergy (e.g. Salicylic Acid, Fragrance, Sulphates)..."
                className="flex-1 px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
              />
              <button
                type="button"
                onClick={() => addAllergy(newAllergy)}
                className="bg-[#1F3D2B] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Type-Ahead Suggestions Menu */}
            {showAllergySuggestions && filteredAllergies.length > 0 && (
              <div className="absolute z-20 left-0 right-16 mt-1 bg-white border border-[#E5E2D8] rounded-2xl shadow-lg max-h-48 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#8A8A82] border-b border-[#E5E2D8] flex items-center gap-1">
                  <Sparkles size={11} className="text-[#D4AF6A]" /> Clinical Allergens Suggestions (Click to Add)
                </div>
                {filteredAllergies.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addAllergy(sug)}
                    className="w-full text-left px-4 py-2 text-xs text-[#1F3D2B] hover:bg-[#FAF9F5] font-medium flex items-center justify-between"
                  >
                    <span>{sug}</span>
                    <Plus size={12} className="text-[#3B6D11]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RELEVANT SCALP CONCERNS WITH TYPE-AHEAD SUGGESTIONS */}
        <div className="border-t border-[#E5E2D8] pt-4 relative">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
            RELEVANT SCALP CONCERNS
          </label>
          
          <div className="flex flex-wrap gap-2 my-2">
            {concerns.length === 0 ? (
              <span className="text-xs text-[#8A8A82] italic">No concerns added yet. Type below to add.</span>
            ) : (
              concerns.map((item, idx) => (
                <span key={idx} className="bg-[#FAF9F5] border border-[#E5E2D8] text-[#1F3D2B] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span>{item}</span>
                  <button type="button" onClick={() => setConcerns(concerns.filter((_, i) => i !== idx))} className="hover:text-red-700">
                    <X size={13} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newConcern}
                onChange={(e) => {
                  setNewConcern(e.target.value);
                  setShowConcernSuggestions(true);
                }}
                onFocus={() => setShowConcernSuggestions(true)}
                placeholder="Type concern (e.g. Visible flaking, itching, dryness)..."
                className="flex-1 px-4 py-2.5 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs font-medium text-[#1F3D2B] focus:outline-none focus:border-[#1F3D2B]"
              />
              <button
                type="button"
                onClick={() => addConcern(newConcern)}
                className="bg-[#1F3D2B] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {/* Type-Ahead Suggestions Menu */}
            {showConcernSuggestions && filteredConcerns.length > 0 && (
              <div className="absolute z-20 left-0 right-16 mt-1 bg-white border border-[#E5E2D8] rounded-2xl shadow-lg max-h-48 overflow-y-auto py-1">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#8A8A82] border-b border-[#E5E2D8] flex items-center gap-1">
                  <Sparkles size={11} className="text-[#D4AF6A]" /> Common Scalp Concerns (Click to Add)
                </div>
                {filteredConcerns.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addConcern(sug)}
                    className="w-full text-left px-4 py-2 text-xs text-[#1F3D2B] hover:bg-[#FAF9F5] font-medium flex items-center justify-between"
                  >
                    <span>{sug}</span>
                    <Plus size={12} className="text-[#3B6D11]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* HEALTH & MEDICATIONS WITH TYPE-AHEAD SUGGESTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E5E2D8] pt-4">
          
          {/* HEALTH CONDITIONS */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              RELEVANT HEALTH CONDITIONS (PAST & PRESENT)
            </label>
            <div className="flex flex-wrap gap-1.5 my-2">
              {healthConditions.map((item, idx) => (
                <span key={idx} className="bg-[#FAF9F5] border border-[#E5E2D8] text-xs font-medium text-[#1F3D2B] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>{item}</span>
                  <button type="button" onClick={() => setHealthConditions(healthConditions.filter((_, i) => i !== idx))} className="hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => {
                    setNewCondition(e.target.value);
                    setShowConditionSuggestions(true);
                  }}
                  onFocus={() => setShowConditionSuggestions(true)}
                  placeholder="e.g. Seasonal allergies, Eczema"
                  className="flex-1 px-3 py-2 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs text-[#1F3D2B]"
                />
                <button
                  type="button"
                  onClick={() => addCondition(newCondition)}
                  className="bg-[#1F3D2B] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>

              {showConditionSuggestions && filteredConditions.length > 0 && (
                <div className="absolute z-20 left-0 right-12 mt-1 bg-white border border-[#E5E2D8] rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                  {filteredConditions.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addCondition(sug)}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1F3D2B] hover:bg-[#FAF9F5]"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MEDICATIONS */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
              CURRENT & PREVIOUS MEDICATION HISTORY
            </label>
            <div className="flex flex-wrap gap-1.5 my-2">
              {medications.map((item, idx) => (
                <span key={idx} className="bg-[#FAF9F5] border border-[#E5E2D8] text-xs font-medium text-[#1F3D2B] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span>{item}</span>
                  <button type="button" onClick={() => setMedications(medications.filter((_, i) => i !== idx))} className="hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMed}
                  onChange={(e) => {
                    setNewMed(e.target.value);
                    setShowMedSuggestions(true);
                  }}
                  onFocus={() => setShowMedSuggestions(true)}
                  placeholder="e.g. None, Antihistamines"
                  className="flex-1 px-3 py-2 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-xs text-[#1F3D2B]"
                />
                <button
                  type="button"
                  onClick={() => addMed(newMed)}
                  className="bg-[#1F3D2B] text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>

              {showMedSuggestions && filteredMeds.length > 0 && (
                <div className="absolute z-20 left-0 right-12 mt-1 bg-white border border-[#E5E2D8] rounded-xl shadow-lg max-h-40 overflow-y-auto py-1">
                  {filteredMeds.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addMed(sug)}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#1F3D2B] hover:bg-[#FAF9F5]"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* History Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5E5A] mb-1">
            Relevant Scalp-Care History Notes
          </label>
          <textarea
            rows={3}
            value={relevantHistory}
            onChange={(e) => setRelevantHistory(e.target.value)}
            placeholder="Describe previous routines or observations..."
            className="w-full p-4 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl text-sm text-[#1F3D2B]"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#E5E2D8]">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#1F3D2B] hover:bg-[#152a1d] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Save size={16} />
            <span>Save Profile & Allergies</span>
          </button>

          <button
            type="button"
            onClick={handleProceedToBaseline}
            className="w-full sm:w-auto bg-[#D4AF6A] hover:bg-[#c29d59] text-[#1F3D2B] px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Proceed to Baseline Assessment</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </form>
    </div>
  );
}
