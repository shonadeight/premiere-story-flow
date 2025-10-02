export type ContributionCategory = 'financial' | 'intellectual' | 'marketing' | 'assets';

export type ContributionStatus = 
  | 'draft'
  | 'setup_incomplete'
  | 'ready_to_receive'
  | 'ready_to_give'
  | 'negotiating'
  | 'active'
  | 'completed'
  | 'cancelled';

export type ContributionDirection = 'to_give' | 'to_receive';

export interface FinancialSubtype {
  cash: 'Cash';
  debt: 'Debt';
  equity: 'Equity Share';
  revenue_share: 'Revenue Share';
  profit_share: 'Profit Share';
  pledges: 'Pledges';
}

export interface MarketingSubtype {
  leads_onboarding: 'Leads Onboarding';
  leads_followup: 'Leads Follow-up';
  leads_conversion: 'Leads Conversion';
  leads_retention: 'Leads Retention';
}

export interface IntellectualSubtype {
  coaching: 'Coaching';
  tutoring: 'Tutoring';
  project_development: 'Project Development';
  project_planning: 'Project Planning';
  mentorship: 'Mentorship';
  consultation: 'Consultation';
  research: 'Research';
  perspectives: 'Perspectives & Strategies';
  customer_support: 'Customer Support';
  capacity_building: 'Capacity Building';
}

export interface AssetSubtype {
  farm_tools: 'Farm Tools';
  land: 'Land';
  livestock: 'Livestock';
  seeds: 'Seeds';
  construction_tools: 'Construction Tools & Machinery';
  houses: 'Houses, Rooms & Buildings';
  office_tools: 'Office Tools';
  office_spaces: 'Office Spaces';
  digital_assets: 'Digital Assets';
  software: 'Software & Apps';
  data_assets: 'Data Assets';
  vehicles: 'Vehicles & Trucks';
  custom: 'Custom Asset';
}

export interface SelectedSubtype {
  name: string;
  displayName: string;
  category: ContributionCategory;
  direction: ContributionDirection;
}

export interface ContributionSetupStep {
  stepNumber: number;
  stepName: string;
  completed: boolean;
  skipped: boolean;
}

export const CONTRIBUTION_STEPS = [
  { number: 5, name: 'Expected Insights', key: 'insights' },
  { number: 6, name: 'Expected Valuation', key: 'valuation' },
  { number: 7, name: 'Expected Follow-up Setup', key: 'followup' },
  { number: 8, name: 'Smart Rules', key: 'smartRules' },
  { number: 9, name: 'Custom Ratings', key: 'ratings' },
  { number: 10, name: 'Expected Files', key: 'files' },
  { number: 11, name: 'Expected Knots', key: 'knots' },
  { number: 12, name: 'Expected Contributors', key: 'contributors' },
  { number: 13, name: 'Users and Admins', key: 'users' }
] as const;