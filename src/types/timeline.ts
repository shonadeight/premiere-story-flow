export type TimelineType = 'project' | 'contribution' | 'contact' | 'activity' | 'transaction' | 'training' | 'custom';

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
  value: number;
  currency: string;
  change: number;
  changePercent: number;
  invested: boolean;
  investedAmount?: number;
  subtimelines: number;
  rating: number;
  views: number;
  investedMembers: number;
  matchedTimelines: number;
  status: 'active' | 'completed' | 'paused' | 'seeking-investment';
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  attachments?: string[];
  recordings?: string[];
  dataSources?: string[];
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
  type: 'intellectual' | 'financial' | 'network' | 'pledge';
  value: number;
  description: string;
  contributor: string;
  timestamp: string;
  version: number;
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