export type UserRole = 'owner' | 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  creditsTotal: number;
  creditsUsed: number;
  ownerId: string;
  createdAt: string;
}

export type EmailStatus = 'verified' | 'unverified' | 'catch_all' | 'invalid' | 'pending';
export type BuyingRole = 'Economic Buyer' | 'Technical Champion' | 'Security Evaluator' | 'End User' | 'Blocker';

export interface IntentTopic {
  topic: string;
  score: number; // 0-100
  surgeLevel: 'High' | 'Medium' | 'Low';
  weeklySurgePct: number;
  searchVolume: number;
}

export interface Company {
  id: string;
  workspaceId: string;
  name: string;
  domain: string;
  websiteUrl: string;
  industry: string;
  subIndustry?: string;
  employeeCount: number;
  employeeRange: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001-5000' | '5001+';
  revenueRange: '<$1M' | '$1M-$10M' | '$10M-$50M' | '$50M-$250M' | '$250M+';
  headquarters: string;
  city: string;
  state?: string;
  country: string;
  description: string;
  foundedYear: number;
  technologies: string[];
  linkedinUrl: string;
  dataSource: string;
  confidenceScore: number;
  lastUpdated: string;
  // Billion-dollar feature additions:
  intentSignals?: IntentTopic[];
  technographicScan?: TechnographicScan;
}

export interface EmploymentHistory {
  title: string;
  companyName: string;
  companyDomain?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Contact {
  id: string;
  workspaceId: string;
  companyId: string;
  companyName: string;
  companyDomain: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  seniority: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Entry';
  department: 'Executive' | 'Engineering' | 'Sales' | 'Marketing' | 'Product' | 'Operations' | 'Finance' | 'HR';
  email: string;
  emailStatus: EmailStatus;
  emailConfidence: number;
  phone?: string;
  mobileDirect?: string; // Direct dial from mobile waterfall
  city: string;
  state?: string;
  country: string;
  linkedinUrl: string;
  leadScore: number;
  leadStatus: 'New' | 'Contacted' | 'Engaged' | 'Qualified' | 'Unqualified' | 'Customer';
  lists: string[]; // List IDs
  tags: string[];
  notes?: string;
  employmentHistory?: EmploymentHistory[];
  dataSource: string;
  createdAt: string;
  lastVerifiedAt?: string;
  // Billion-dollar feature additions:
  buyingRole?: BuyingRole;
  reportsToId?: string;
  isPastCustomerChampion?: boolean;
}

export interface LeadList {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  contactCount: number;
  companyCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface SavedSearch {
  id: string;
  workspaceId: string;
  name: string;
  filters: FilterState;
  entityType: 'contacts' | 'companies';
  createdAt: string;
}

export interface FilterState {
  query?: string;
  seniority?: string[];
  departments?: string[];
  industries?: string[];
  employeeRanges?: string[];
  countries?: string[];
  emailStatuses?: EmailStatus[];
  technologies?: string[];
  minLeadScore?: number;
  revenueRanges?: string[];
  // Billion-dollar filter additions:
  intentTopics?: string[];
  buyingRoles?: BuyingRole[];
  hasJobChangePast90Days?: boolean;
  minSurgeScore?: number;
}

export interface LeadScoreRule {
  id: string;
  name: string;
  field: 'seniority' | 'department' | 'employeeCount' | 'industry' | 'emailStatus' | 'technology';
  operator: 'equals' | 'contains' | 'greater_than';
  value: string | number;
  points: number;
  isActive: boolean;
}

export interface SequenceStep {
  id: string;
  stepNumber: number;
  delayDays: number;
  channel: 'email' | 'linkedin_touch' | 'call_task';
  subject: string;
  bodyTemplate: string;
  // Billion-dollar feature addition:
  aiPersonalizationHook?: string;
}

export interface SequenceCampaign {
  id: string;
  workspaceId: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  enrolledCount: number;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  bouncedCount: number;
  steps: SequenceStep[];
  enrolledContactIds: string[];
  createdAt: string;
  attributedRevenue?: number;
}

export interface SuppressionRecord {
  id: string;
  workspaceId: string;
  type: 'email' | 'domain';
  value: string;
  reason: 'Unsubscribed' | 'Bounced' | 'Manual' | 'Compliance';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface CrmIntegration {
  id: string;
  provider: 'hubspot' | 'salesforce' | 'outreach' | 'smtp';
  name: string;
  isConnected: boolean;
  connectedAt?: string;
  apiKeyMasked?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  lastSyncedAt?: string;
  recordsSynced: number;
  fieldMappings: {
    internalField: string;
    externalField: string;
  }[];
}

export interface EmailVerificationDetail {
  email: string;
  status: EmailStatus;
  confidence: number;
  checks: {
    syntaxValid: boolean;
    domainExists: boolean;
    mxRecordsFound: boolean;
    isDisposable: boolean;
    isRoleBased: boolean;
    isCatchAll: boolean;
    smtpConnectable: boolean;
  };
  details: string;
  verifiedAt: string;
}

// ----------------------------------------------------
// BILLION-DOLLAR FEATURE MODELS
// ----------------------------------------------------

// 1. Job Change & Champion Tracker (UserGems)
export interface JobChangeAlert {
  id: string;
  workspaceId: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  previousCompany: string;
  previousTitle: string;
  newCompany: string;
  newCompanyDomain: string;
  newTitle: string;
  changedAt: string;
  daysInRole: number;
  isPastCustomer: boolean;
  status: 'new_opportunity' | 'outreach_enrolled' | 'dismissed';
}

// 2. Waterfall Enrichment (Clay)
export interface WaterfallProvider {
  id: string;
  name: string;
  tier: number;
  providerType: 'Email' | 'Mobile Phone' | 'Company Intelligence';
  matchRate: number; // e.g. 78%
  isEnabled: boolean;
  costCredits: number;
}

export interface WaterfallExecutionResult {
  id: string;
  targetEmail: string;
  targetDomain: string;
  resolvedAt: string;
  steps: {
    providerName: string;
    status: 'FOUND' | 'SKIPPED' | 'NO_MATCH';
    latencyMs: number;
    foundFields: string[];
  }[];
  finalEmail: string;
  finalDirectPhone: string;
  overallMatch: boolean;
  creditsCharged: number;
}

// 3. Autonomous AI Outbound SDR (11x / Artisan)
export interface AiSdrAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isActive: boolean;
  accountsResearched: number;
  emailsDrafted: number;
  repliesTriaged: number;
  meetingBookingsCount: number;
}

export interface AiSdrPersonalizedDraft {
  id: string;
  contactId: string;
  contactName: string;
  contactTitle: string;
  companyName: string;
  signalHook: string; // e.g. "Recent $50M Series C & expansion into AWS Frankfurt"
  subject: string;
  pitchBody: string;
  confidenceScore: number;
  status: 'pending_review' | 'auto_approved' | 'sent';
}

// 4. Automated Mailbox Pool & Reputation Warmup (Instantly / Smartlead)
export interface MailboxAccount {
  id: string;
  email: string;
  senderName: string;
  provider: 'Google Workspace' | 'Microsoft 365' | 'Custom SES Relay';
  dailyLimit: number;
  sentToday: number;
  warmupScore: number; // 0-100%
  warmupEmailsExchanged: number;
  spfValid: boolean;
  dkimValid: boolean;
  dmarcValid: boolean;
  isPaused: boolean;
}

// 5. Deep Technographic & Cloud Scanner (BuiltWith)
export interface TechnographicScan {
  domain: string;
  serverBanner: string;
  tlsIssuer: string;
  cloudProvider: 'AWS' | 'GCP' | 'Azure' | 'Hybrid';
  estimatedCloudSpendMonthly: string;
  activeFrameworks: string[];
  analyticsTools: string[];
  securityTools: string[];
  contractRenewalQuarter: string;
}

// 6. Conversation & Meeting Intelligence (Gong)
export interface SalesCallRecording {
  id: string;
  title: string;
  prospectName: string;
  prospectTitle: string;
  companyName: string;
  durationMinutes: number;
  recordedAt: string;
  overallSentiment: 'Positive' | 'Neutral' | 'Hesitant';
  talkRatioRep: number; // e.g. 42%
  talkRatioProspect: number; // e.g. 58%
  competitorMentions: string[];
  budgetMentioned: boolean;
  dealRisks: string[];
  aiExecutiveSummary: string;
}

// 7. Multi-Touch Revenue Attribution & Pipeline Forecast (Clari)
export interface RevenueAttributionOpportunity {
  id: string;
  dealName: string;
  companyName: string;
  dealValue: number;
  stage: 'Closed Won' | 'Negotiation' | 'Proposal' | 'Discovery';
  originatingSequence: string;
  firstTouchDate: string;
  closedDate: string;
  touchpointsCount: number;
  winProbability: number;
  roiMultiplier: number; // e.g. 14.2x
}

// 8. Real Estate Intelligence & Zestimate Engine (Zillow / CoStar / PropStream)
export interface PropertyListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  searchArea: string;
  lat: number;
  lng: number;
  propertyType: 'Commercial Office' | 'Multifamily (5+ Units)' | 'Industrial Warehouse' | 'Retail & Mixed Use' | 'Single Family Residential' | 'Development Land';
  units?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet: number;
  lotSizeAcres?: number;
  yearBuilt: number;
  zestimate: number;
  listPrice?: number;
  pricePerSqFt: number;
  capRate: number; // e.g. 7.4%
  grossRentalYield: number; // e.g. 9.8%
  estimatedNetOperatingIncome: number;
  status: 'Off-Market Deal' | 'Pre-Foreclosure / Distressed' | 'Active MLS' | 'Motivated Seller' | 'Recently Sold';
  estimatedEquityPct: number;
  mortgageBalance: number;
  taxAssessment: number;
  annualPropertyTaxes: number;
  zoning: string;
  imageUrl: string;
  // Historical property rates & AI pricing suggestions
  historicalRates: {
    oldSaleDate: string;
    oldSalePrice: number;
    oldPricePerSqFt: number;
    priorAssessment2021: number;
    historicalAppreciationPct: number;
    suggestedMarketRatePerSqFt: number;
    suggestedTargetOfferPrice: number;
    suggestedTargetRatePerSqFt: number;
    rateRecommendationReasoning: string;
  };
  // Direct Seller Contact Details
  sellerContact: {
    name: string;
    entity: string;
    phone: string;
    email: string;
    role: string;
    motivation: string;
    commissionAgreedPct: number; // e.g. 2.5%
  };
  // Matched Buyers with Contact Info & Dual Commission
  matchedBuyers: {
    buyerId: string;
    buyerName: string;
    entityName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    matchScore: number;
    buyFeeAgreedPct: number; // e.g. 2.0%
    estDualCommission: number;
  }[];
  ownerRecord: {
    ownerName: string;
    holdingEntity: string;
    ownerType: 'Absentee Corporate LLC' | 'Individual Owner-Occupied' | 'Out-of-State Landlord' | 'Institutional REIT';
    ownershipDurationYears: number;
    skipTracedContact?: {
      contactName: string;
      title: string;
      verifiedMobile: string;
      verifiedEmail: string;
      confidence: number;
    };
  };
  motivatingFactors: string[];
  comps: { address: string; soldPrice: number; distanceMiles: number; soldDate: string }[];
}

export interface BuyerProfile {
  id: string;
  name: string;
  entityName: string;
  buyerType: 'Institutional Private Equity' | 'Family Office' | '1031 Exchange Buyer' | 'Value-Add Syndicator' | 'Local Cash Investor';
  verifiedFundsProof: string;
  targetAssetClasses: string[];
  targetMarkets: string[];
  minBudget: number;
  maxBudget: number;
  minCapRate: number;
  closingTimelineDays: number;
  contactEmail: string;
  contactPhone: string;
  dealsClosedPast12Mo: number;
  activeBuyBoxDescription: string;
  matchCount?: number;
}

export interface SellerInquiry {
  id: string;
  propertyAddress: string;
  cityStateZip: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  askingPrice: number;
  estimatedZestimate: number;
  timeline: 'Immediate (14-30 days cash)' | '60-90 days' | 'Flexible';
  reasonForSelling: string;
  propertyType: string;
  submittedAt: string;
  status: 'Under Review' | 'Matched to 4 Buyers' | 'Underwriting Completed' | 'Offer Sent';
}

// 9. Dual-Party Bridge Deal & Commission Payout Engine
export interface BridgeDeal {
  id: string;
  propertyId: string;
  propertyAddress: string;
  propertyType: string;
  searchArea: string;
  imageUrl: string;
  sellerName: string;
  sellerEntity: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerCommissionPct: number; // e.g. 2.5%
  buyerId: string;
  buyerName: string;
  buyerEntity: string;
  buyerContactName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerCommissionPct: number; // e.g. 2.0%
  agreedPrice: number;
  sellerCommissionFee: number;
  buyerCommissionFee: number;
  totalCommission: number;
  oldRatePerSqFt: number;
  suggestedRatePerSqFt: number;
  dealStatus: 'Bridge Match Discovered' | 'Dual Agreements Out for Signature' | 'LOI / Underwriting' | 'In Escrow' | 'Closed & Commission Distributed';
  createdAt: string;
  targetCloseDate: string;
  escrowRef: string;
}

// 10. AI Autonomous Deal Structuring & Negotiation Oracle (World-First)
export interface AiDealArbitration {
  propertyId: string;
  propertyAddress: string;
  sellerReservePrice: number;
  buyerMaxBudget: number;
  clearingPriceRecommended: number;
  sellerDiscountCapturedPct: number;
  buyerEquitySpreadUsd: number;
  sellerCommissionUsd: number;
  buyerFinderFeeUsd: number;
  totalDualPlatformTakeUsd: number;
  optimalStructure: 'All-Cash Direct Escrow' | 'Hybrid 1031 Exchange Equity Roll' | 'Seller Subordinated Carry' | 'Earnout Contingent Recap';
  aiUnderwritingThesis: string;
  riskAssessment: {
    category: string;
    level: 'Low' | 'Moderate' | 'High';
    mitigation: string;
  }[];
  generatedLoiTerms: {
    closingDays: number;
    inspectionPeriodDays: number;
    earnestMoneyDeposit: number;
    contingencies: string[];
  };
}

// 11. Autonomous Multi-Agent Swarm (Start-to-Finish Deal Engine)
export type AgentPhase = 
  | 'scout'          // Phase 1: Property Discovery & Deed Forensics
  | 'seller_call'    // Phase 2: LLC Unmasking & AI Voice Call to Seller
  | 'buyer_match'    // Phase 3: Institutional Capital Buy-Box Match
  | 'negotiation'    // Phase 4: Multi-Agent Clearing Price Arbiter
  | 'due_diligence'  // Phase 5: Title Audit, Liens & Estoppels
  | 'closing';       // Phase 6: Dual-Commission Escrow Wire & Settlement

export interface SwarmAgent {
  id: string;
  name: string;
  codename: string;
  role: string;
  phase: AgentPhase;
  model: string;
  avatarColor: string;
  specialty: string;
}

export interface SwarmLog {
  id: string;
  timestamp: string;
  phase: AgentPhase;
  agentName: string;
  agentRole: string;
  message: string;
  type: 'scout' | 'voice' | 'match' | 'negotiate' | 'audit' | 'escrow' | 'success';
}

export interface SwarmExecution {
  id: string;
  propertyId: string;
  propertyAddress: string;
  searchArea: string;
  status: 'idle' | 'running' | 'completed' | 'paused';
  currentPhase: AgentPhase;
  phaseProgress: number; // 0 - 100
  startedAt: string;
  completedAt?: string;
  speedMode: 'realtime' | 'turbo';
  logs: SwarmLog[];

  // Phase 1: Scout & Deed Forensics Output
  deedForensics: {
    scannedRegistry: string;
    deedYear: string;
    originalPriceSqFt: number;
    currentAvmSqFt: number;
    targetOfferPrice: number;
    targetPriceSqFt: number;
    appreciationPct: number;
    liquidationTrigger: string;
    equityBuildUpUsd: number;
    inPlaceNetNoi: number;
    capRateEstimated: number;
  };

  // Phase 2: Seller Engagement & Voice Call Output
  sellerEngagement: {
    sellerName: string;
    unmaskedEntity: string;
    verifiedCell: string;
    verifiedEmail: string;
    callDurationSeconds: number;
    callStatus: 'Completed - Mandate Secured' | 'In Progress' | 'Queued';
    callTranscript: { speaker: string; text: string; time: string; sentiment?: 'neutral' | 'positive' | 'objection' | 'closed' }[];
    sellerCommissionAgreedPct: number;
    representationAgreementRef: string;
    agreementSignedAt: string;
  };

  // Phase 3: Institutional Capital Match Output
  buyerMatchResult: {
    buyerId: string;
    buyerName: string;
    entityName: string;
    buyerType: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    maxBudget: number;
    fitScore: number;
    memoDelivered: boolean;
    memoRef: string;
    buyerFinderFeeAgreedPct: number;
  };

  // Phase 4: Multi-Agent Clearing Price Arbiter Output
  negotiationArbitration: {
    clearingPrice: number;
    sellerDiscountPct: number;
    buyerEquityBufferUsd: number;
    roundsNegotiated: number;
    optimalStructure: string;
    loiSignedBilateral: boolean;
    loiRef: string;
    loiSignedAt: string;
    roundsSummary: { round: number; sellerBid: number; buyerOffer: number; note: string }[];
  };

  // Phase 5: Autonomous Due Diligence & Title Audit Output
  dueDiligenceAudit: {
    titleSearchStatus: 'Clean Title Commitment Issued' | 'Pending';
    delawareGoodStanding: boolean;
    taxLienSearch: 'No Municipal Liens Detected' | 'Lien Identified';
    environmentalPhase1: 'Clean Phase I Environmental ESA' | 'Remediation Required';
    estoppelCertificatesVerified: number;
    totalTenantLeasesAudited: number;
    auditPassed: boolean;
    auditRef: string;
  };

  // Phase 6: Escrow Wire Settlement & Dual Commission Close Output
  closingSettlement: {
    grossSalePrice: number;
    sellerCommissionTake: number;   // e.g. 2.5%
    buyerFinderFeeTake: number;     // e.g. 2.0%
    totalPlatformTake: number;       // seller + buyer
    netSellerProceeds: number;
    earnestDepositHeld: number;
    escrowWireRef: string;
    altaStatementRef: string;
    settlementCompletedAt: string;
    fundsDistributed: boolean;
    qualifiedIntermediary1031Routing: string;
  };
}

// 12. Autonomous Fleet Orchestrator (Multi-Asset Corridor Execution)
export interface FleetPropertyStatus {
  propertyId: string;
  address: string;
  city: string;
  searchArea: string;
  propertyType: string;
  zestimate: number;
  currentPhase: AgentPhase;
  phaseProgress: number;
  status: 'idle' | 'running' | 'completed';
  activeAgent: string;
  dualCommission: number;
  clearingPrice: number;
  buyerName: string;
  updatedAt: string;
}


