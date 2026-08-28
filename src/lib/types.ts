export type SymptomScoreValue = 0 | 1 | 2 | 3; // 0=None, 1=Mild, 2=Moderate, 3=Severe

export interface SymptomScores {
  flaking: SymptomScoreValue;
  itching: SymptomScoreValue;
  redness: SymptomScoreValue;
  irritation: SymptomScoreValue;
  oiliness: SymptomScoreValue;
  scaling: SymptomScoreValue;
  affectedArea: SymptomScoreValue;
  duration: SymptomScoreValue;
  frequency: SymptomScoreValue;
  userSeverity: SymptomScoreValue;
  dailyImpact: SymptomScoreValue;
}

export type VisibleFlakingSeverity = 'Minimal' | 'Mild' | 'Moderate' | 'Marked';
export type ConfidenceTier = 'High' | 'Moderate' | 'Low' | 'Unable to determine';
export type ResponseStatus = 'Observed improvement' | 'No meaningful improvement' | 'Worsened';
export type EvidenceType =
  | 'clinical_trial'
  | 'systematic_review'
  | 'guideline'
  | 'regulatory'
  | 'peer_reviewed'
  | 'manufacturer_claim';

export interface UserProfile {
  userId: string;
  fullName: string;
  phoneNumber: string;
  loginId: string;
  profileCompleted?: boolean;
  baselineCompleted?: boolean;
  ageRange?: string;
  sex?: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  location?: string;
  latitude?: number;
  longitude?: number;
  hairType?: string;
  dietaryInfo?: string;
  scalpConcerns?: string[];
  knownAllergies?: string[];
  healthConditions?: string[];
  currentMedications?: string[];
  previousProducts?: string[];
  currentProductId?: string;
  relevantHistory?: string;
  preferredLanguage?: 'en' | 'ml'; // English or Malayalam
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: string;
  userId: string;
  brand: string;
  productName: string;
  productType: string;
  activeIngredients: string[];
  concentration?: string;
  directions?: string;
  warnings?: string;
  manufacturer?: string;
  description?: string;
  labelImageUrl?: string;
  isAyurvedicOrHerbal?: boolean;
  createdAt: string;
}

export interface AllergyConflictFlag {
  flagId: string;
  userId: string;
  productId: string;
  ingredient: string;
  matchedAllergy: string;
  message: string;
  createdAt: string;
}

export interface TrackingPeriod {
  trackingPeriodId: string;
  userId: string;
  productId: string;
  productName: string;
  brand: string;
  startDate: string;
  endDate?: string;
  baselineAssessmentId: string;
  status: ResponseStatus | 'In progress';
  createdAt: string;
  updatedAt: string;
}

export interface Assessment {
  assessmentId: string;
  trackingPeriodId: string;
  userId: string;
  type: 'baseline' | 'weekly';
  weekNumber: number;
  scores: SymptomScores;
  totalScore: number;
  maxScore: number;
  algorithmVersion: string;
  date: string;
}

export type ScalpRegion = 'front_hairline' | 'top_central' | 'left' | 'right' | 'back_occipital';

export interface ScalpImage {
  imageId: string;
  trackingPeriodId: string;
  userId: string;
  region: ScalpRegion;
  imageUrl: string;
  captureDate: string;
  weekNumber: number;
  qualityPassed: boolean;
  qualityIssues?: string[];
}

export interface PhotoQualityMetrics {
  blurScore: number; // 0-100 (higher = clearer)
  lightingScore: number; // 0-100
  framingScore: number; // 0-100
  scalpVisibilityScore: number; // 0-100
}

export interface ImageAnalysis {
  analysisId: string;
  imageId: string;
  trackingPeriodId: string;
  userId: string;
  consistencyScore: number; // 0 - 100 (Photo Consistency Score)
  confidenceTier: ConfidenceTier;
  visibleFlakingSeverity: VisibleFlakingSeverity;
  affectedAreaDistribution: string;
  rednessIrritationObserved: string;
  changeFromBaseline?: string;
  changeFromPrevious?: string;
  qualityMetrics: PhotoQualityMetrics;
  disclaimer?: string;
  createdAt: string;
}

export interface ContextLog {
  contextId: string;
  trackingPeriodId: string;
  userId: string;
  date: string;
  stressLevel?: 'Low' | 'Moderate' | 'High';
  sleepHours?: number;
  washFrequency?: string;
  headCovering?: boolean;
  dietNotes?: string;
  medicationChanges?: string;
  lifestyleNotes?: string;
}

export interface EnvironmentalLog {
  logId: string;
  userId: string;
  date: string;
  tempC: number;
  humidity: number;
  weatherCondition: string;
  source: string; // e.g. "Open-Meteo Weather API"
  isManualOverride?: boolean;
}

export interface EvidenceReference {
  referenceId: string;
  title: string;
  authors: string;
  journalOrSource: string;
  year: number;
  url: string;
  evidenceType: EvidenceType;
  summary: string;
  associatedIngredient: string;
}

export interface Report {
  reportId: string;
  userId: string;
  trackingPeriodId: string;
  createdAt: string;
  summaryText: string;
  dermatologistNotes?: string;
}

export interface ClinicianShareLink {
  linkId: string;
  reportId: string;
  userId: string;
  token: string;
  expiresAt: string;
  revoked: boolean;
  createdAt: string;
}

export interface RedFlagAlert {
  detected: boolean;
  symptoms: string[];
  recommendation: string;
}
