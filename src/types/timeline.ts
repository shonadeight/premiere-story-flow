export type TimelineType = 
  | 'project'           // Project Timeline
  | 'profile'           // Profile Timeline (root)
  | 'financial'         // Financial Contribution Timeline
  | 'followup'          // Follow-up Timeline
  | 'intellectual'      // Intellectual Contribution Timeline
  | 'network'           // Network & Marketing Timeline
  | 'assets'            // Assets Contribution Timeline
  | 'custom';           // Custom Timeline Type

export type ContributionType = 
  | 'cash' | 'crypto' | 'debt' | 'pledge' | 'equity'     // Financial
  | 'consulting' | 'deliverable' | 'royalty' | 'ip'     // Intellectual
  | 'referral' | 'campaign' | 'event' | 'content'      // Network/Marketing
  | 'land' | 'building' | 'equipment' | 'digital'      // Assets
  | 'hours' | 'maintenance' | 'support'                 // Follow-up
  | 'timeline';                                         // Timeline-to-timeline

export interface CustomMetrics {
  [key: string]: any;
}

export interface InvestmentTerms {
  minInvestment: number;
  maxInvestment: number;
  roi: number;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  negotiable: boolean;
}

export interface Timeline {
  id: string;
  title: string;
  type: TimelineType;
  customType?: string;
  description: string;
  
  // Basic Identity & Visibility
  ownerId: string;
  visibility: 'public' | 'private' | 'invite-only';
  
  // Purpose & Scope
  purpose: string;
  scope: string;
  startDate?: string;
  endDate?: string;
  milestones?: string[];
  
  // Contribution Rules (what this timeline accepts)
  allowedContributionTypes: ContributionType[];
  contributionForms?: Record<ContributionType, any>; // Custom capture forms
  
  // Valuation Configuration
  valuationModel: 'fixed' | 'hourly' | 'market' | 'outcome' | 'hybrid' | 'custom';
  baseUnit: 'USD' | 'token' | 'credits';
  conversionRules?: any;
  
  // Tracking Configuration
  trackingInputs: ('manual' | 'files' | 'api')[];
  verificationMethod: 'self' | 'owner' | 'third-party' | 'smart-contract';
  dataSources?: string[];
  
  // Outcome Sharing Configuration
  rewardTypes: ('profit' | 'equity' | 'royalties' | 'credits' | 'access' | 'badges')[];
  distributionModel: 'pro-rata' | 'tiered' | 'milestone' | 'custom';
  payoutTriggers: string[];
  
  // Subtimeline Rules
  allowSubtimelines: boolean;
  subtimelineCreation: 'auto' | 'template' | 'manual' | 'conditional';
  subtimelineInheritance: boolean;
  
  // Governance & Compliance
  governance: {
    approvalRequired: boolean;
    approvers: string[];
    multiSig?: boolean;
    kycRequired?: boolean;
    kycThreshold?: number;
  };
  
  // Current state
  value: number;
  currency: string;
  change: number;
  changePercent: number;
  invested: boolean;
  investedAmount?: number;
  subtimelines: Timeline[];
  rating: number;
  views: number;
  investedMembers: number;
  matchedTimelines: number;
  status: 'draft' | 'active' | 'completed' | 'paused' | 'seeking-investment';
  createdAt: string;
  updatedAt: string;
  
  // Legacy and additional fields
  tags: string[];
  attachments?: string[];
  recordings?: string[];
  chatHistory?: ChatMessage[];
  contributions?: Contribution[];
  outcomes?: Outcome[];
  parentTimelineId?: string;
  customMetrics?: CustomMetrics;
  investmentTerms?: InvestmentTerms;
  isPublic: boolean;
  collaborators?: string[];
  matchingCriteria?: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'member';
  timestamp: string;
  senderName?: string;
}

export interface Contribution {
  id: string;
  type: ContributionType;
  subtype?: string;
  value: number;
  description: string;
  contributor: string;
  contributorId: string;
  timestamp: string;
  version: number;
  proofAttachments?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'verified';
  valuation?: {
    method: 'fixed' | 'hourly' | 'market' | 'outcome' | 'custom';
    baseValue: number;
    conversionRate?: number;
    formula?: string;
  };
  verification?: {
    required: boolean;
    method: 'self' | 'owner' | 'third-party' | 'smart-contract';
    verifiedBy?: string;
    verifiedAt?: string;
  };
}

export interface Outcome {
  id: string;
  description: string;
  value: number;
  type: 'revenue' | 'roi' | 'deliverable' | 'impact';
  timestamp: string;
  sharedWith: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalInvested: number;
  totalReturns: number;
  activeTimelines: number;
  portfolioValue: number;
}