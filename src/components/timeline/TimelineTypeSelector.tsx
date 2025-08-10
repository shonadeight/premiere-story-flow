import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  User, 
  DollarSign, 
  MessageSquare, 
  Brain, 
  Share2, 
  Package,
  Sparkles
} from 'lucide-react';
import { TimelineType } from '@/types/timeline';

interface TimelineTypeSelectorProps {
  selectedType: TimelineType | '';
  onTypeSelect: (type: TimelineType) => void;
}

const timelineTypes = [
  {
    type: 'project' as TimelineType,
    icon: Rocket,
    title: 'Project Timeline',
    description: 'Track project deliverables, milestones, and team contributions',
    examples: ['Software development', 'Product launches', 'Research projects'],
    accepts: ['Cash funding', 'Time contributions', 'Asset resources', 'Expertise'],
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
  },
  {
    type: 'profile' as TimelineType,
    icon: User,
    title: 'Profile Timeline',
    description: 'Personal or business profile that serves as the root timeline',
    examples: ['Personal portfolio', 'Company profile', 'Professional brand'],
    accepts: ['Direct sponsorships', 'Skill investments', 'Network connections'],
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300'
  },
  {
    type: 'financial' as TimelineType,
    icon: DollarSign,
    title: 'Financial Contribution Timeline',
    description: 'Manage cash, crypto, debt, pledges, and equity investments',
    examples: ['Startup funding', 'Loan agreements', 'Investment rounds'],
    accepts: ['Cash', 'Cryptocurrency', 'Debt instruments', 'Equity stakes'],
    color: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300'
  },
  {
    type: 'followup' as TimelineType,
    icon: MessageSquare,
    title: 'Follow-up Timeline',
    description: 'Track ongoing support, maintenance, and relationship building',
    examples: ['Client onboarding', 'Customer support', 'Maintenance schedules'],
    accepts: ['Support hours', 'Monitoring services', 'Relationship building'],
    color: 'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300'
  },
  {
    type: 'intellectual' as TimelineType,
    icon: Brain,
    title: 'Intellectual Contribution Timeline',
    description: 'Capture knowledge, IP, consulting, and deliverable contributions',
    examples: ['Consulting services', 'Patent development', 'Training programs'],
    accepts: ['Consulting hours', 'Intellectual property', 'Training materials'],
    color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300'
  },
  {
    type: 'network' as TimelineType,
    icon: Share2,
    title: 'Network & Marketing Timeline',
    description: 'Track referrals, campaigns, events, and partnership building',
    examples: ['Marketing campaigns', 'Referral programs', 'Event hosting'],
    accepts: ['Referral networks', 'Campaign budgets', 'Event organization'],
    color: 'bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300'
  },
  {
    type: 'assets' as TimelineType,
    icon: Package,
    title: 'Assets Contribution Timeline',
    description: 'Manage physical and digital asset contributions and usage',
    examples: ['Equipment lending', 'Real estate', 'Digital licenses'],
    accepts: ['Physical assets', 'Digital assets', 'Equipment', 'Property'],
    color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-700 dark:text-cyan-300'
  }
];

export const TimelineTypeSelector = ({ selectedType, onTypeSelect }: TimelineTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Choose Timeline Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the type that best matches your timeline's purpose and contribution model
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timelineTypes.map((timelineType) => {
          const Icon = timelineType.icon;
          const isSelected = selectedType === timelineType.type;
          
          return (
            <Card
              key={timelineType.type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onTypeSelect(timelineType.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${timelineType.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{timelineType.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timelineType.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">Examples:</h5>
                    <div className="flex flex-wrap gap-1">
                      {timelineType.examples.map((example, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">Accepts:</h5>
                    <div className="flex flex-wrap gap-1">
                      {timelineType.accepts.map((accept, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {accept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 mt-0.5 text-primary" />
          <div className="text-sm">
            <p className="font-medium mb-1">Timeline Hierarchy</p>
            <p className="text-muted-foreground">
              Each timeline can have subtimelines of any type. For example, a Project Timeline 
              can contain Financial, Intellectual, and Network subtimelines to track different 
              aspects of contributions and outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};