import { ContributionCategory } from '@/types/contribution';

export interface ContributionTemplate {
  id: string;
  name: string;
  category: ContributionCategory;
  subtype: string;
  description: string;
  presets: {
    insights?: any[];
    valuation?: any;
    followups?: any[];
    smartRules?: any[];
    ratings?: any;
    files?: any[];
    knots?: any[];
  };
}

export const FINANCIAL_TEMPLATES: ContributionTemplate[] = [
  {
    id: 'cash-donation',
    name: 'Cash Donation',
    category: 'financial',
    subtype: 'cash',
    description: 'One-time cash contribution with receipt tracking',
    presets: {
      valuation: {
        type: 'fixed',
        currency: 'USD',
        amount: 100
      },
      files: [
        { file_name: 'Receipt', file_type: 'PDF', required: true }
      ],
      followups: [
        { followup_status: 'Receipt Confirmation', due_days: 7 }
      ]
    }
  },
  {
    id: 'equity-investment',
    name: 'Equity Investment',
    category: 'financial',
    subtype: 'equity',
    description: 'Equity share investment with quarterly reporting',
    presets: {
      valuation: {
        type: 'percentage',
        percentage: 5
      },
      files: [
        { file_name: 'Investment Agreement', file_type: 'PDF', required: true },
        { file_name: 'Cap Table', file_type: 'XLSX', required: false }
      ],
      followups: [
        { followup_status: 'Quarterly Report', due_days: 90 }
      ],
      smartRules: [
        {
          rule_name: 'Auto-distribute dividends',
          condition: { description: 'When quarterly profit > $10,000' },
          action: { description: 'Distribute % of profit to investors' }
        }
      ]
    }
  },
  {
    id: 'revenue-share',
    name: 'Revenue Sharing Agreement',
    category: 'financial',
    subtype: 'revenue_share',
    description: 'Monthly revenue sharing with automated distribution',
    presets: {
      valuation: {
        type: 'percentage',
        percentage: 20
      },
      followups: [
        { followup_status: 'Monthly Revenue Report', due_days: 30 }
      ],
      smartRules: [
        {
          rule_name: 'Auto-calculate share',
          condition: { description: 'On monthly revenue close' },
          action: { description: 'Calculate and distribute 20% of revenue' }
        }
      ]
    }
  }
];

export const MARKETING_TEMPLATES: ContributionTemplate[] = [
  {
    id: 'social-media-campaign',
    name: 'Social Media Campaign',
    category: 'marketing',
    subtype: 'leads_onboarding',
    description: 'Multi-platform social media lead generation',
    presets: {
      insights: [
        { insight_type: 'Impressions', source: 'Facebook Ads API' },
        { insight_type: 'Clicks', source: 'Google Analytics' },
        { insight_type: 'Conversions', source: 'ShonaCoin Timeline' }
      ],
      valuation: {
        type: 'formula',
        formula: '$5 per qualified lead'
      },
      followups: [
        { followup_status: 'Daily Performance Check', due_days: 1 },
        { followup_status: 'Weekly Optimization', due_days: 7 }
      ]
    }
  },
  {
    id: 'lead-nurture',
    name: 'Lead Nurturing Program',
    category: 'marketing',
    subtype: 'leads_followup',
    description: '7-day automated follow-up sequence',
    presets: {
      followups: [
        { followup_status: 'Day 1 - Welcome Email', due_days: 1 },
        { followup_status: 'Day 3 - Value Email', due_days: 3 },
        { followup_status: 'Day 5 - Case Study', due_days: 5 },
        { followup_status: 'Day 7 - Conversion Call', due_days: 7 }
      ],
      smartRules: [
        {
          rule_name: 'Auto-tag engaged leads',
          condition: { description: 'If email open rate > 50%' },
          action: { description: 'Tag as "Hot Lead"' }
        }
      ]
    }
  }
];

export const INTELLECTUAL_TEMPLATES: ContributionTemplate[] = [
  {
    id: 'mentorship-program',
    name: 'Mentorship Program',
    category: 'intellectual',
    subtype: 'mentorship',
    description: '3-month mentorship with bi-weekly sessions',
    presets: {
      valuation: {
        type: 'fixed',
        amount: 1500,
        currency: 'USD'
      },
      followups: [
        { followup_status: 'Session 1', due_days: 14 },
        { followup_status: 'Session 2', due_days: 28 },
        { followup_status: 'Mid-point Review', due_days: 42 },
        { followup_status: 'Session 3', due_days: 56 },
        { followup_status: 'Final Session', due_days: 84 }
      ],
      ratings: {
        criteria: 'Mentorship Quality, Communication, Value Delivered',
        max_rating: 10
      }
    }
  },
  {
    id: 'consulting-project',
    name: 'Consulting Project',
    category: 'intellectual',
    subtype: 'consultation',
    description: 'Strategic consulting with deliverables',
    presets: {
      valuation: {
        type: 'formula',
        formula: '$200 per hour, 40 hour minimum'
      },
      files: [
        { file_name: 'Project Brief', file_type: 'PDF', required: true },
        { file_name: 'Final Report', file_type: 'PDF', required: true }
      ],
      followups: [
        { followup_status: 'Kickoff Meeting', due_days: 7 },
        { followup_status: 'Progress Check', due_days: 21 },
        { followup_status: 'Final Delivery', due_days: 60 }
      ]
    }
  }
];

export const ASSET_TEMPLATES: ContributionTemplate[] = [
  {
    id: 'land-lease',
    name: 'Land Lease Agreement',
    category: 'assets',
    subtype: 'land',
    description: 'Agricultural land lease with inspection requirements',
    presets: {
      valuation: {
        type: 'fixed',
        amount: 500,
        currency: 'USD'
      },
      files: [
        { file_name: 'Title Deed', file_type: 'PDF', required: true },
        { file_name: 'Survey Map', file_type: 'PDF', required: true },
        { file_name: 'Soil Test Report', file_type: 'PDF', required: false }
      ],
      followups: [
        { followup_status: 'Quarterly Inspection', due_days: 90 }
      ],
      smartRules: [
        {
          rule_name: 'Lease renewal reminder',
          condition: { description: '30 days before lease expiry' },
          action: { description: 'Send renewal notification' }
        }
      ]
    }
  },
  {
    id: 'vehicle-rental',
    name: 'Vehicle Rental',
    category: 'assets',
    subtype: 'vehicles',
    description: 'Short-term vehicle rental with insurance',
    presets: {
      valuation: {
        type: 'formula',
        formula: '$50 per day + $0.30 per mile'
      },
      files: [
        { file_name: 'Vehicle Registration', file_type: 'PDF', required: true },
        { file_name: 'Insurance Certificate', file_type: 'PDF', required: true },
        { file_name: 'Pre-rental Inspection', file_type: 'Image', required: true }
      ],
      followups: [
        { followup_status: 'Return Inspection', due_days: 7 }
      ]
    }
  },
  {
    id: 'software-license',
    name: 'Software License',
    category: 'assets',
    subtype: 'software',
    description: 'Annual software subscription with support',
    presets: {
      valuation: {
        type: 'fixed',
        amount: 2400,
        currency: 'USD'
      },
      files: [
        { file_name: 'License Agreement', file_type: 'PDF', required: true },
        { file_name: 'API Documentation', file_type: 'PDF', required: false }
      ],
      followups: [
        { followup_status: 'Renewal Reminder', due_days: 335 }
      ],
      smartRules: [
        {
          rule_name: 'Auto-renew license',
          condition: { description: 'If renewal approved by admin' },
          action: { description: 'Process renewal payment and extend license' }
        }
      ]
    }
  }
];

export const ALL_TEMPLATES = [
  ...FINANCIAL_TEMPLATES,
  ...MARKETING_TEMPLATES,
  ...INTELLECTUAL_TEMPLATES,
  ...ASSET_TEMPLATES
];

export const getTemplatesByCategory = (category: ContributionCategory): ContributionTemplate[] => {
  return ALL_TEMPLATES.filter(t => t.category === category);
};

export const getTemplatesBySubtype = (subtype: string): ContributionTemplate[] => {
  return ALL_TEMPLATES.filter(t => t.subtype === subtype);
};
