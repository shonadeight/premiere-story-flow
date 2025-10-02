import { z } from 'zod';

// Valuation Schemas
export const valuationSchema = z.object({
  type: z.enum(['fixed', 'formula', 'percentage']),
  amount: z.number().positive().optional(),
  currency: z.string().max(10).optional(),
  formula: z.string().max(500).optional(),
  percentage: z.number().min(0).max(100).optional(),
  direction: z.enum(['to_give', 'to_receive'])
}).refine(
  data => {
    if (data.type === 'fixed' && (!data.amount || !data.currency)) return false;
    if (data.type === 'formula' && !data.formula) return false;
    if (data.type === 'percentage' && data.percentage === undefined) return false;
    return true;
  },
  { message: "Invalid valuation configuration" }
);

// Follow-up Schemas
export const followupSchema = z.object({
  followup_status: z.string().min(1, "Status is required").max(200),
  notes: z.string().max(1000).optional(),
  due_date: z.string().optional(),
  direction: z.enum(['to_give', 'to_receive'])
});

// Smart Rules Schemas
export const smartRuleSchema = z.object({
  rule_name: z.string().min(1, "Rule name is required").max(200),
  condition: z.object({
    description: z.string().min(1, "Condition is required").max(500)
  }),
  action: z.object({
    description: z.string().min(1, "Action is required").max(500)
  }),
  enabled: z.boolean()
});

// Rating Schemas
export const ratingConfigSchema = z.object({
  criteria: z.string().min(1, "Criteria is required").max(200),
  max_rating: z.number().min(5).max(10),
  scale_type: z.string()
});

// File Schemas
export const fileSchema = z.object({
  file_name: z.string().min(1, "File name is required").max(255),
  file_type: z.string().max(100).optional(),
  file_url: z.string().max(2048),
  file_size: z.number().min(0)
});

// Knot Schemas
export const knotSchema = z.object({
  knot_type: z.enum(['merge', 'value_sharing', 'cross_link']),
  linked_timeline_id: z.string().uuid().optional().nullable(),
  configuration: z.object({
    type: z.enum(['merge', 'value_sharing', 'cross_link'])
  })
});

// Contributor Schemas
export const contributorSchema = z.object({
  user_id: z.string().min(1, "User ID is required").max(255),
  role: z.enum(['viewer', 'contributor', 'admin']),
  permissions: z.object({
    view: z.boolean(),
    edit: z.boolean().optional()
  })
});

// Insight Schemas
export const insightSchema = z.object({
  insight_type: z.string().min(1, "Insight type is required").max(200),
  configuration: z.record(z.any())
});
