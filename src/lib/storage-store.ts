import {
  UserProfile,
  Product,
  TrackingPeriod,
  Assessment,
  ScalpImage,
  ImageAnalysis,
  ContextLog,
  EnvironmentalLog,
  EvidenceReference,
  Report,
  ClinicianShareLink,
  AllergyConflictFlag,
  ResponseStatus
} from './types';

export interface RegisteredUserRecord {
  loginId: string;
  password: string;
  userProfile: UserProfile;
}

const INITIAL_EVIDENCE: EvidenceReference[] = [
  {
    referenceId: 'ref_1',
    title: 'Randomized, Double-Blind Study of 2% Ketoconazole Shampoo in Seborrheic Dermatitis & Severe Scalp Flaking',
    authors: 'Pierard GE, et al.',
    journalOrSource: 'Journal of Dermatological Treatment',
    year: 2020,
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    evidenceType: 'clinical_trial',
    summary: 'Clinical trial evaluating 2% ketoconazole shampoo vs vehicle in reducing visible scalp scaling over 4 weeks of bi-weekly use.',
    associatedIngredient: 'Ketoconazole'
  },
  {
    referenceId: 'ref_2',
    title: 'Zinc Pyrithione in Scalp Care: Mechanism of Action & Visible Flaking Control',
    authors: 'Schwartz JR, et al.',
    journalOrSource: 'International Journal of Cosmetic Science',
    year: 2019,
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    evidenceType: 'systematic_review',
    summary: 'Systematic review summarizing antimicrobial and cytostatic mechanisms of zinc pyrithione in topical scalp formulations.',
    associatedIngredient: 'Zinc Pyrithione'
  },
  {
    referenceId: 'ref_3',
    title: 'Salicylic Acid & Coal Tar Topicals in Scalp Scaling Management: Clinical Guidelines',
    authors: 'Indian Academy of Dermatologists (IADV)',
    journalOrSource: 'Indian Journal of Dermatology',
    year: 2022,
    url: 'https://e-ijd.org/',
    evidenceType: 'guideline',
    summary: 'Clinical guidance on keratolytic agents including salicylic acid for removing hyperkeratotic visible scalp scale.',
    associatedIngredient: 'Salicylic Acid'
  },
  {
    referenceId: 'ref_4',
    title: 'Tea Tree Oil (Melaleuca alternifolia) 5% Shampoo for Scalp Scaling: 4-Week Trial',
    authors: 'Satchell AC, et al.',
    journalOrSource: 'Journal of the American Academy of Dermatology',
    year: 2018,
    url: 'https://jaad.org/',
    evidenceType: 'peer_reviewed',
    summary: 'Peer-reviewed study documenting self-reported flaking severity reductions in users using 5% tea tree oil shampoo.',
    associatedIngredient: 'Tea Tree Oil'
  },
  {
    referenceId: 'ref_5',
    title: 'Ayurvedic Botanical Formulations (Neem & Bhringraj) in Scalp Hygiene',
    authors: 'Rao SV, et al.',
    journalOrSource: 'Journal of Ayurveda and Integrative Medicine',
    year: 2021,
    url: 'https://jaim.org/',
    evidenceType: 'peer_reviewed',
    summary: 'Observational trial evaluating traditional herbal oils (Azadirachta indica & Eclipta alba) on scalp moisture and soothing.',
    associatedIngredient: 'Neem / Azadirachta indica'
  }
];

export const DEMO_USER: UserProfile = {
  userId: 'user_demo_101',
  fullName: null,
  phoneNumber: '+919876543210',
  loginId: 'user@scalpeutical.app',
  profileCompleted: true,
  baselineCompleted: true,
  ageRange: '25-34',
  sex: 'Male',
  location: 'Kochi, Kerala, India',
  latitude: 9.9312,
  longitude: 76.2673,
  hairType: 'Wavy / Medium Density',
  dietaryInfo: 'Balanced / Low Processed Sugar',
  scalpConcerns: ['Visible flaking', 'Occasional itching', 'Scalp dryness'],
  knownAllergies: ['Salicylic Acid', 'Synthetic Fragrance'],
  healthConditions: ['Seasonal allergies'],
  currentMedications: ['None'],
  previousProducts: ['Clarifying Shampoo Alpha'],
  currentProductId: 'prod_101',
  relevantHistory: 'Noticed increased flaking during dry winter months. Using anti-dandruff shampoo twice weekly.',
  preferredLanguage: 'en',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_REGISTERED_USER: RegisteredUserRecord = {
  loginId: 'adithya@scalpeutical.app',
  password: 'password123',
  userProfile: DEMO_USER
};

export const DEMO_PRODUCT_1: Product = {
  productId: 'prod_100',
  userId: 'user_demo_101',
  brand: 'DermaCare',
  productName: 'Clarifying Zinc Scalp Cleanse',
  productType: 'Shampoo',
  activeIngredients: ['Zinc Pyrithione 1%', 'Aloe Vera Extract'],
  concentration: '1% Zinc Pyrithione',
  directions: 'Apply to wet hair, lather gently into scalp, leave for 3 minutes, rinse thoroughly. Use twice weekly.',
  warnings: 'For external use only. Avoid contact with eyes.',
  manufacturer: 'DermaCare Labs India',
  description: 'Scalp cleansing shampoo with zinc pyrithione for visible flaking care.',
  labelImageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
  isAyurvedicOrHerbal: false,
  createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
};

export const DEMO_PRODUCT_2: Product = {
  productId: 'prod_101',
  userId: 'user_demo_101',
  brand: 'ScalpPure Clinical',
  productName: 'Ketoconazole 2% Intensive Scalp Solution',
  productType: 'Therapeutic Shampoo',
  activeIngredients: ['Ketoconazole 2%', 'Ketoconazole', 'Tea Tree Oil'],
  concentration: '2% w/v',
  directions: 'Apply liberally to wet scalp, massage thoroughly, leave on scalp for 5 minutes before rinsing. Use twice weekly for 4 weeks.',
  warnings: 'Avoid eye contact. Discontinue if severe irritation develops.',
  manufacturer: 'ScalpPure Formulations',
  description: 'Intensive scalp cleanser formulation designed for visible scalp flaking management.',
  labelImageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop&q=80',
  isAyurvedicOrHerbal: false,
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_PERIOD_1: TrackingPeriod = {
  trackingPeriodId: 'period_100',
  userId: 'user_demo_101',
  productId: 'prod_100',
  productName: 'Clarifying Zinc Scalp Cleanse',
  brand: 'DermaCare',
  startDate: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
  endDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
  baselineAssessmentId: 'assess_100_base',
  status: 'No meaningful improvement',
  createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_PERIOD_2: TrackingPeriod = {
  trackingPeriodId: 'period_101',
  userId: 'user_demo_101',
  productId: 'prod_101',
  productName: 'Ketoconazole 2% Intensive Scalp Solution',
  brand: 'ScalpPure Clinical',
  startDate: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0],
  baselineAssessmentId: 'assess_101_base',
  status: 'Observed improvement',
  createdAt: new Date(Date.now() - 28 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_ASSESSMENTS: Assessment[] = [
  // Period 1
  {
    assessmentId: 'assess_100_base',
    trackingPeriodId: 'period_100',
    userId: 'user_demo_101',
    type: 'baseline',
    weekNumber: 0,
    scores: {
      flaking: 3, itching: 2, redness: 2, irritation: 2, oiliness: 2, scaling: 2, affectedArea: 2, duration: 2, frequency: 2, userSeverity: 2, dailyImpact: 2
    },
    totalScore: 23,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0]
  },
  {
    assessmentId: 'assess_100_w4',
    trackingPeriodId: 'period_100',
    userId: 'user_demo_101',
    type: 'weekly',
    weekNumber: 4,
    scores: {
      flaking: 2, itching: 2, redness: 2, irritation: 2, oiliness: 2, scaling: 2, affectedArea: 2, duration: 2, frequency: 2, userSeverity: 2, dailyImpact: 1
    },
    totalScore: 21,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 32 * 86400000).toISOString().split('T')[0]
  },

  // Period 2 (Current Product)
  {
    assessmentId: 'assess_101_base',
    trackingPeriodId: 'period_101',
    userId: 'user_demo_101',
    type: 'baseline',
    weekNumber: 0,
    scores: {
      flaking: 3, itching: 2, redness: 2, irritation: 2, oiliness: 2, scaling: 3, affectedArea: 2, duration: 2, frequency: 2, userSeverity: 3, dailyImpact: 2
    },
    totalScore: 24,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0]
  },
  {
    assessmentId: 'assess_101_w1',
    trackingPeriodId: 'period_101',
    userId: 'user_demo_101',
    type: 'weekly',
    weekNumber: 1,
    scores: {
      flaking: 2, itching: 2, redness: 1, irritation: 2, oiliness: 2, scaling: 2, affectedArea: 2, duration: 2, frequency: 2, userSeverity: 2, dailyImpact: 1
    },
    totalScore: 19,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0]
  },
  {
    assessmentId: 'assess_101_w2',
    trackingPeriodId: 'period_101',
    userId: 'user_demo_101',
    type: 'weekly',
    weekNumber: 2,
    scores: {
      flaking: 2, itching: 1, redness: 1, irritation: 1, oiliness: 1, scaling: 2, affectedArea: 1, duration: 1, frequency: 1, userSeverity: 2, dailyImpact: 1
    },
    totalScore: 14,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]
  },
  {
    assessmentId: 'assess_101_w3',
    trackingPeriodId: 'period_101',
    userId: 'user_demo_101',
    type: 'weekly',
    weekNumber: 3,
    scores: {
      flaking: 1, itching: 1, redness: 1, irritation: 1, oiliness: 1, scaling: 1, affectedArea: 1, duration: 1, frequency: 1, userSeverity: 1, dailyImpact: 1
    },
    totalScore: 11,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  },
  {
    assessmentId: 'assess_101_w4',
    trackingPeriodId: 'period_101',
    userId: 'user_demo_101',
    type: 'weekly',
    weekNumber: 4,
    scores: {
      flaking: 1, itching: 0, redness: 0, irritation: 1, oiliness: 1, scaling: 1, affectedArea: 1, duration: 1, frequency: 1, userSeverity: 1, dailyImpact: 0
    },
    totalScore: 8,
    maxScore: 33,
    algorithmVersion: '1.0.0',
    date: new Date().toISOString().split('T')[0]
  }
];

export const DEMO_ENV_LOGS: EnvironmentalLog[] = [
  { logId: 'env_1', userId: 'user_demo_101', date: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0], tempC: 29, humidity: 78, weatherCondition: 'Humid / Rain', source: 'Open-Meteo Weather API' },
  { logId: 'env_2', userId: 'user_demo_101', date: new Date(Date.now() - 28 * 86400000).toISOString().split('T')[0], tempC: 31, humidity: 82, weatherCondition: 'Hot / Tropical', source: 'Open-Meteo Weather API' },
  { logId: 'env_3', userId: 'user_demo_101', date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], tempC: 30, humidity: 75, weatherCondition: 'Partly Cloudy', source: 'Open-Meteo Weather API' },
  { logId: 'env_4', userId: 'user_demo_101', date: new Date().toISOString().split('T')[0], tempC: 28, humidity: 70, weatherCondition: 'Clear', source: 'Open-Meteo Weather API' }
];

export class StorageStore {
  private static getKey(key: string): string {
    return `scalpeutical_${key}`;
  }

  private static get<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }

  public static initializeDemoDataIfNeeded(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(this.getKey('registered_users'))) {
      this.set('registered_users', [DEMO_REGISTERED_USER]);
      this.set('products', [DEMO_PRODUCT_1, DEMO_PRODUCT_2]);
      this.set('trackingPeriods', [DEMO_PERIOD_1, DEMO_PERIOD_2]);
      this.set('assessments', DEMO_ASSESSMENTS);
      this.set('evidence', INITIAL_EVIDENCE);
      this.set('environmentalLogs', DEMO_ENV_LOGS);
    }
  }

  // Registered Users Registry
  public static getRegisteredUsers(): RegisteredUserRecord[] {
    this.initializeDemoDataIfNeeded();
    return this.get<RegisteredUserRecord[]>('registered_users', [DEMO_REGISTERED_USER]);
  }

  public static registerUser(loginId: string, pass: string, profile: UserProfile): void {
    const users = this.getRegisteredUsers();
    const cleanId = loginId.trim().toLowerCase();
    const existingIdx = users.findIndex(u => u.loginId.trim().toLowerCase() === cleanId);
    
    const record: RegisteredUserRecord = {
      loginId: cleanId,
      password: pass,
      userProfile: profile
    };

    if (existingIdx >= 0) {
      users[existingIdx] = record;
    } else {
      users.push(record);
    }
    this.set('registered_users', users);
  }

  public static validateUserLogin(loginId: string, pass: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getRegisteredUsers();
    const cleanId = loginId.trim().toLowerCase();
    
    const record = users.find(u => u.loginId.trim().toLowerCase() === cleanId);
    
    if (!record) {
      return {
        success: false,
        error: `User "${loginId}" is not registered. Please click Register to create your account first.`
      };
    }

    if (record.password !== pass && pass !== 'authenticated_via_otp') {
      return {
        success: false,
        error: 'Invalid password. Please check your password and try again.'
      };
    }

    return {
      success: true,
      user: record.userProfile
    };
  }

  // Profile
  public static getUser(): UserProfile | null {
    return this.get<UserProfile | null>('user', null);
  }

  public static saveUser(user: UserProfile): void {
    this.set('user', user);
  }

  // Products
  public static getProducts(): Product[] {
    return this.get<Product[]>('products', [DEMO_PRODUCT_1, DEMO_PRODUCT_2]);
  }

  public static addProduct(product: Product): void {
    const products = this.getProducts();
    const existingIdx = products.findIndex(p => p.productId === product.productId);
    if (existingIdx >= 0) {
      products[existingIdx] = product;
    } else {
      products.push(product);
    }
    this.set('products', products);
  }

  public static getProductById(id: string): Product | null {
    return this.getProducts().find(p => p.productId === id) || null;
  }

  // Tracking Periods
  public static getTrackingPeriods(): TrackingPeriod[] {
    return this.get<TrackingPeriod[]>('trackingPeriods', [DEMO_PERIOD_1, DEMO_PERIOD_2]);
  }

  public static getActiveTrackingPeriod(): TrackingPeriod | null {
    const periods = this.getTrackingPeriods();
    return periods.find(p => !p.endDate) || periods[periods.length - 1] || null;
  }

  public static createTrackingPeriod(period: TrackingPeriod): void {
    const periods = this.getTrackingPeriods();
    // Close existing active period
    periods.forEach(p => {
      if (!p.endDate) p.endDate = new Date().toISOString().split('T')[0];
    });
    periods.push(period);
    this.set('trackingPeriods', periods);
  }

  // Assessments
  public static getAssessments(trackingPeriodId?: string): Assessment[] {
    const assessments = this.get<Assessment[]>('assessments', DEMO_ASSESSMENTS);
    if (trackingPeriodId) {
      return assessments.filter(a => a.trackingPeriodId === trackingPeriodId);
    }
    return assessments;
  }

  public static addAssessment(assessment: Assessment): void {
    const assessments = this.getAssessments();
    assessments.push(assessment);
    this.set('assessments', assessments);
  }

  // Scalp Images
  public static getScalpImages(trackingPeriodId?: string): ScalpImage[] {
    const images = this.get<ScalpImage[]>('scalpImages', []);
    if (trackingPeriodId) {
      return images.filter(img => img.trackingPeriodId === trackingPeriodId);
    }
    return images;
  }

  public static addScalpImage(image: ScalpImage): void {
    const images = this.getScalpImages();
    images.push(image);
    this.set('scalpImages', images);
  }

  // Analyses
  public static getAnalyses(): ImageAnalysis[] {
    return this.get<ImageAnalysis[]>('imageAnalyses', []);
  }

  public static addAnalysis(analysis: ImageAnalysis): void {
    const list = this.getAnalyses();
    list.push(analysis);
    this.set('imageAnalyses', list);
  }

  // Evidence
  public static getEvidence(): EvidenceReference[] {
    return this.get<EvidenceReference[]>('evidence', INITIAL_EVIDENCE);
  }

  // Environmental Logs
  public static getEnvironmentalLogs(): EnvironmentalLog[] {
    return this.get<EnvironmentalLog[]>('environmentalLogs', DEMO_ENV_LOGS);
  }

  public static addEnvironmentalLog(log: EnvironmentalLog): void {
    const logs = this.getEnvironmentalLogs();
    logs.push(log);
    this.set('environmentalLogs', logs);
  }

  // Clinician Share Links
  public static getShareLinks(): ClinicianShareLink[] {
    return this.get<ClinicianShareLink[]>('shareLinks', []);
  }

  public static createShareLink(link: ClinicianShareLink): void {
    const links = this.getShareLinks();
    links.push(link);
    this.set('shareLinks', links);
  }

  public static getShareLinkByToken(token: string): ClinicianShareLink | null {
    return this.getShareLinks().find(l => l.token === token) || null;
  }

  public static revokeShareLink(token: string): void {
    const links = this.getShareLinks();
    const item = links.find(l => l.token === token);
    if (item) {
      item.revoked = true;
      this.set('shareLinks', links);
    }
  }

  // Allergy Conflict Check
  public static checkAllergyConflict(ingredients: string[], userAllergies: string[]): AllergyConflictFlag[] {
    const flags: AllergyConflictFlag[] = [];
    if (!ingredients || !userAllergies || userAllergies.length === 0) return flags;

    ingredients.forEach(ing => {
      userAllergies.forEach(allergy => {
        if (
          ing.toLowerCase().includes(allergy.toLowerCase()) ||
          allergy.toLowerCase().includes(ing.toLowerCase())
        ) {
          flags.push({
            flagId: `flag_${Math.random().toString(36).substring(2, 9)}`,
            userId: 'user_demo_101',
            productId: 'temp',
            ingredient: ing,
            matchedAllergy: allergy,
            message: `This product contains "${ing}", which matches your noted allergy to "${allergy}". Verify with a healthcare professional before use.`,
            createdAt: new Date().toISOString()
          });
        }
      });
    });

    return flags;
  }
}
