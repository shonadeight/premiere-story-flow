import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail,
  User, 
  Target, 
  DollarSign, 
  Calculator,
  BarChart3,
  TrendingUp,
  GitBranch,
  Shield,
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Plus,
  Clock,
  Edit3,
  Settings,
  Eye
} from 'lucide-react';

interface OnboardingData {
  email: string;
  verificationCode: string;
  name: string;
  phone: string;
  role: string;
  description: string;
  visibility: string;
  goalStatement: string;
  startDate: string;
  endDate: string;
  contributionTypes: string[];
  valuationModel: string;
  baseUnit: string;
  trackingInputs: string[];
  verificationMethod: string;
  rewardTypes: string[];
  distributionModel: string;
  payoutTriggers: string[];
  allowSubtimelines: boolean;
  subtimelinesCreation: string;
  governanceRules: string[];
  kycRequired: boolean;
}

const steps = [
  { id: 1, title: 'Authentication', icon: Mail },
  { id: 2, title: 'Email Verification', icon: CheckCircle },
  { id: 3, title: 'Basic Identity & Visibility', icon: User },
  { id: 4, title: 'Purpose & Scope', icon: Target },
  { id: 5, title: 'Contribution Rules', icon: DollarSign },
  { id: 6, title: 'Valuation Configuration', icon: Calculator },
  { id: 7, title: 'Tracking Configuration', icon: BarChart3 },
  { id: 8, title: 'Outcome Sharing', icon: TrendingUp },
  { id: 9, title: 'Subtimeline Rules', icon: GitBranch },
  { id: 10, title: 'Governance & Compliance', icon: Shield },
  { id: 11, title: 'Preview & Publish', icon: CheckCircle },
];

const contributionTypes = [
  { id: 'financial', label: '💰 Financial', description: 'cash, crypto, debt, pledges' },
  { id: 'intellectual', label: '🧠 Intellectual', description: 'consulting, deliverables, IP' },
  { id: 'marketing', label: '🌍 Network & Marketing', description: 'referrals, campaigns, events' },
  { id: 'assets', label: '🏢 Assets', description: 'land, buildings, equipment' },
  { id: 'followup', label: '📋 Follow-up', description: 'onboarding, maintenance tasks' },
  { id: 'timeline', label: '📊 Timeline Investment', description: 'other timelines as contributions' },
];

const valuationModels = [
  { id: 'fixed-unit', label: 'Fixed Unit', description: 'Set price per contribution unit' },
  { id: 'hourly-rate', label: 'Hourly Rate', description: 'Based on time invested' },
  { id: 'market-index', label: 'Market Index', description: 'Linked to market performance' },
  { id: 'outcome-based', label: 'Outcome Based', description: 'Based on results achieved' },
  { id: 'hybrid', label: 'Hybrid', description: 'Combination of methods' },
];

const trackingInputOptions = [
  { id: 'manual-logs', label: 'Manual Logs', description: 'Self-reported progress' },
  { id: 'file-uploads', label: 'File Uploads', description: 'Documents and evidence' },
  { id: 'api-feeds', label: 'API Feeds', description: 'CRM, payments, analytics' },
  { id: 'third-party', label: 'Third Party', description: 'External verification' },
];

const verificationMethods = [
  { id: 'self-attest', label: 'Self Attest', description: 'User confirms completion' },
  { id: 'owner-approved', label: 'Owner Approved', description: 'Timeline owner verifies' },
  { id: 'third-party', label: 'Third Party Audited', description: 'External verification' },
  { id: 'smart-contract', label: 'Smart Contract', description: 'Automated validation' },
];

const rewardTypeOptions = [
  { id: 'profit-share', label: 'Profit %', description: 'Percentage of profits' },
  { id: 'equity', label: 'Equity', description: 'Ownership shares' },
  { id: 'royalties', label: 'Royalties', description: 'Ongoing payments' },
  { id: 'credits', label: 'Credits', description: 'Platform credits' },
  { id: 'access', label: 'Access', description: 'Special privileges' },
  { id: 'badges', label: 'Badges', description: 'Recognition rewards' },
];

const distributionModels = [
  { id: 'pro-rata', label: 'Pro-rata', description: 'Proportional to contribution' },
  { id: 'tiered', label: 'Tiered', description: 'Different levels of rewards' },
  { id: 'milestone', label: 'Milestone Release', description: 'Released at milestones' },
  { id: 'custom', label: 'Custom', description: 'Custom distribution logic' },
];

const payoutTriggerOptions = [
  { id: 'milestone', label: 'Milestone Reached', description: 'When goals are achieved' },
  { id: 'time-based', label: 'Time Based', description: 'At regular intervals' },
  { id: 'verified-outcome', label: 'Verified Outcome', description: 'When results are confirmed' },
  { id: 'revenue-threshold', label: 'Revenue Threshold', description: 'When income targets met' },
];

const subtimelinesCreationOptions = [
  { id: 'auto', label: 'Auto', description: 'Each contribution spawns a subtimeline' },
  { id: 'template', label: 'Template', description: 'Contributors use preset templates' },
  { id: 'manual', label: 'Manual', description: 'Owner creates subtimelines on demand' },
  { id: 'conditional', label: 'Conditional', description: 'Auto-create when conditions met' },
];

const governanceOptions = [
  { id: 'owner-only', label: 'Owner Only', description: 'Owner has full control' },
  { id: 'multi-sign', label: 'Multi-Signature', description: 'Multiple approvals required' },
  { id: 'vote-based', label: 'Vote Based', description: 'Community voting' },
  { id: 'delegated', label: 'Delegated', description: 'Assigned administrators' },
];

const professionalRoles = [
  'Entrepreneur', 'Professional Investor', 'Software Developer', 'Business Consultant', 
  'Corporate Executive', 'Marketing Manager', 'Data Scientist', 'Product Manager', 
  'UX/UI Designer', 'Sales Director', 'Financial Advisor', 'Project Manager',
  'DevOps Engineer', 'Research Scientist', 'Content Creator', 'Digital Marketer',
  'Operations Manager', 'HR Director', 'Legal Counsel', 'Chief Technology Officer',
  'Chief Financial Officer', 'Creative Director', 'Business Analyst', 'Architect',
  'Doctor', 'Teacher', 'Engineer', 'Accountant', 'Real Estate Agent', 'Freelancer'
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customRole, setCustomRole] = useState('');
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    email: '',
    verificationCode: '',
    name: '',
    phone: '',
    role: '',
    description: '',
    visibility: 'public',
    goalStatement: '',
    startDate: '',
    endDate: '',
    contributionTypes: [],
    valuationModel: 'fixed-unit',
    baseUnit: 'USD',
    trackingInputs: [],
    verificationMethod: 'self-attest',
    rewardTypes: [],
    distributionModel: 'pro-rata',
    payoutTriggers: [],
    allowSubtimelines: true,
    subtimelinesCreation: 'manual',
    governanceRules: [],
    kycRequired: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (verificationTimer > 0) {
      interval = setInterval(() => {
        setVerificationTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [verificationTimer]);

  const sendVerificationCode = async () => {
    if (!data.email) return;
    
    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        toast.error(error.message || "Failed to send verification code");
      } else {
        setVerificationTimer(60);
        toast.success('Verification code sent to your email!');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      toast.error("Failed to send verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await sendVerificationCode();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Verify OTP code
      setIsVerifying(true);
      try {
        const { data: authData, error } = await supabase.auth.verifyOtp({
          email: data.email,
          token: data.verificationCode,
          type: 'email'
        });

        if (error) {
          console.error('Error verifying OTP:', error);
          toast.error(error.message || "Invalid verification code");
          setIsVerifying(false);
          return;
        }

        if (authData.user && authData.session) {
          toast.success("Email verified successfully!");
          setCurrentStep(3);
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        toast.error("Failed to verify code");
      } finally {
        setIsVerifying(false);
      }
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and save to database
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("User not authenticated");
          return;
        }

        // Save profile with timeline configuration data
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: data.email,
            name: data.name,
            phone: data.phone,
            professional_role: data.role
          });

        if (profileError) {
          console.error('Error saving profile:', profileError);
          toast.error("Failed to save profile");
          return;
        }

        // Save contribution types
        if (data.contributionTypes.length > 0) {
          const contributionData = data.contributionTypes.map(type => ({
            user_id: user.id,
            contribution_type: type
          }));
          
          const { error: contributionError } = await supabase
            .from('user_contribution_types')
            .insert(contributionData);

          if (contributionError) {
            console.error('Error saving contribution types:', contributionError);
          }
        }

        // Save reward types as expectations
        if (data.rewardTypes.length > 0) {
          const expectationData = data.rewardTypes.map(reward => ({
            user_id: user.id,
            expectation: reward
          }));
          
          const { error: expectationError } = await supabase
            .from('user_expectations')
            .insert(expectationData);

          if (expectationError) {
            console.error('Error saving expectations:', expectationError);
          }
        }

        // Save distribution model as outcome sharing
        if (data.distributionModel) {
          const { error: outcomeError } = await supabase
            .from('user_outcome_sharing')
            .insert({
              user_id: user.id,
              outcome_type: data.distributionModel
            });

          if (outcomeError) {
            console.error('Error saving outcome sharing:', outcomeError);
          }
        }

        toast.success('Welcome to ShonaCoin! Your profile timeline has been created.');
        window.location.href = '/';
      } catch (error) {
        console.error('Error completing onboarding:', error);
        toast.error("Failed to complete onboarding");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (value: string, field: keyof Pick<OnboardingData, 'contributionTypes' | 'trackingInputs' | 'rewardTypes' | 'payoutTriggers' | 'governanceRules'>) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Authentication
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                We'll send you a verification code to confirm your email
              </p>
            </div>
          </div>
        );

      case 2: // Email Verification
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Verification Code</label>
              <Input
                placeholder="Enter 6-digit code"
                value={data.verificationCode}
                onChange={(e) => setData({...data, verificationCode: e.target.value})}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              {verificationTimer > 0 && (
                <p className="text-xs text-muted-foreground">
                  Code expires in {verificationTimer} seconds
                </p>
              )}
              {verificationTimer === 0 && data.email && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={sendVerificationCode}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Sending...' : 'Resend Code'}
                </Button>
              )}
            </div>
          </div>
        );

      case 3: // Basic Identity & Visibility
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="Alex Johnson"
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={data.phone}
                onChange={(e) => setData({...data, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Role</label>
              <Select value={data.role} onValueChange={(value) => {
                setData({...data, role: value});
                if (value === 'custom') {
                  setCustomRole('');
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {professionalRoles.map((role) => (
                    <SelectItem key={role.toLowerCase().replace(/\s+/g, '-')} value={role.toLowerCase().replace(/\s+/g, '-')}>
                      {role}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
              {data.role === 'custom' && (
                <Input
                  placeholder="Enter your custom role"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setData({...data, role: e.target.value});
                  }}
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeline Visibility</label>
              <Select value={data.visibility} onValueChange={(value) => setData({...data, visibility: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can view</SelectItem>
                  <SelectItem value="private">Private - Only you can view</SelectItem>
                  <SelectItem value="invite-only">Invite Only - Selected members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4: // Purpose & Scope
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your professional timeline and what you aim to achieve..."
                value={data.description}
                onChange={(e) => setData({...data, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Main Goal Statement</label>
              <Input
                placeholder="e.g., Build a sustainable SaaS business"
                value={data.goalStatement}
                onChange={(e) => setData({...data, goalStatement: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={data.startDate}
                  onChange={(e) => setData({...data, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target End Date</label>
                <Input
                  type="date"
                  value={data.endDate}
                  onChange={(e) => setData({...data, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Contribution Rules
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                What types of contributions will you accept? (multi-select)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {contributionTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={data.contributionTypes.includes(type.id) ? "default" : "outline"}
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => toggleSelection(type.id, 'contributionTypes')}
                  >
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6: // Valuation Configuration
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valuation Model</label>
              <Select value={data.valuationModel} onValueChange={(value) => setData({...data, valuationModel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {valuationModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Unit</label>
              <Select value={data.baseUnit} onValueChange={(value) => setData({...data, baseUnit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollars</SelectItem>
                  <SelectItem value="EUR">EUR - Euros</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                  <SelectItem value="credits">Credits - Platform Credits</SelectItem>
                  <SelectItem value="hours">Hours - Time Units</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 7: // Tracking Configuration
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                How will progress be tracked? (multi-select)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {trackingInputOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={data.trackingInputs.includes(option.id) ? "default" : "outline"}
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => toggleSelection(option.id, 'trackingInputs')}
                  >
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Method</label>
              <Select value={data.verificationMethod} onValueChange={(value) => setData({...data, verificationMethod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {verificationMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div>
                        <div className="font-medium">{method.label}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 8: // Outcome Sharing
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                What rewards will you offer? (multi-select)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {rewardTypeOptions.map((reward) => (
                  <Button
                    key={reward.id}
                    variant={data.rewardTypes.includes(reward.id) ? "default" : "outline"}
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => toggleSelection(reward.id, 'rewardTypes')}
                  >
                    <div>
                      <div className="font-medium">{reward.label}</div>
                      <div className="text-xs text-muted-foreground">{reward.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Distribution Model</label>
              <Select value={data.distributionModel} onValueChange={(value) => setData({...data, distributionModel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {distributionModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">
                Payout Triggers (multi-select)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {payoutTriggerOptions.map((trigger) => (
                  <Button
                    key={trigger.id}
                    variant={data.payoutTriggers.includes(trigger.id) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left text-sm"
                    onClick={() => toggleSelection(trigger.id, 'payoutTriggers')}
                  >
                    <div>
                      <div className="font-medium">{trigger.label}</div>
                      <div className="text-xs text-muted-foreground">{trigger.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 9: // Subtimeline Rules
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowSubtimelines"
                checked={data.allowSubtimelines}
                onCheckedChange={(checked) => setData({...data, allowSubtimelines: checked === true})}
              />
              <label htmlFor="allowSubtimelines" className="text-sm font-medium">
                Allow subtimelines
              </label>
            </div>
            {data.allowSubtimelines && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtimeline Creation</label>
                <Select value={data.subtimelinesCreation} onValueChange={(value) => setData({...data, subtimelinesCreation: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subtimelinesCreationOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 10: // Governance & Compliance
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Governance Rules (multi-select)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {governanceOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={data.governanceRules.includes(option.id) ? "default" : "outline"}
                    className="justify-start h-auto p-4 text-left"
                    onClick={() => toggleSelection(option.id, 'governanceRules')}
                  >
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="kycRequired"
                checked={data.kycRequired}
                onCheckedChange={(checked) => setData({...data, kycRequired: checked === true})}
              />
              <label htmlFor="kycRequired" className="text-sm font-medium">
                Require KYC/identity verification for contributors
              </label>
            </div>
          </div>
        );

      case 11: // Preview & Publish
        return (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ready to Publish!</h3>
                <p className="text-sm text-muted-foreground">
                  Your profile timeline is configured and ready to be published.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-left">
                <h4 className="font-medium text-sm mb-2">Timeline Summary:</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong>Name:</strong> {data.name}</p>
                  <p><strong>Role:</strong> {data.role}</p>
                  <p><strong>Visibility:</strong> {data.visibility}</p>
                  <p><strong>Contribution Types:</strong> {data.contributionTypes.length} selected</p>
                  <p><strong>Valuation Model:</strong> {data.valuationModel}</p>
                  <p><strong>Reward Types:</strong> {data.rewardTypes.length} selected</p>
                  <p><strong>Tracking Methods:</strong> {data.trackingInputs.length} selected</p>
                  <p><strong>Governance:</strong> {data.governanceRules.length} rules</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.email && data.email.includes('@');
      case 2:
        return data.verificationCode.length === 6;
      case 3:
        return data.name && data.phone && data.role && data.visibility;
      case 4:
        return data.description && data.goalStatement;
      case 5:
        return data.contributionTypes.length > 0;
      case 6:
        return data.valuationModel && data.baseUnit;
      case 7:
        return data.trackingInputs.length > 0 && data.verificationMethod;
      case 8:
        return data.rewardTypes.length > 0 && data.distributionModel && data.payoutTriggers.length > 0;
      case 9:
        return true; // Optional configurations
      case 10:
        return data.governanceRules.length > 0;
      case 11:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Create Your Profile Timeline</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                Follow the timeline creation procedure to set up your profile with proper contribution rules, valuation, and outcome sharing.
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium">{steps[currentStep - 1]?.title}</p>
                <p className="text-xs text-muted-foreground">Step {currentStep} of {steps.length}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-4 pb-4">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Footer with Navigation Buttons - Fixed at bottom */}
      <div className="mt-auto p-4 bg-background/95 backdrop-blur-sm border-t sticky bottom-0">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex-1 sm:flex-none sm:min-w-[120px] touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Previous</span>
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isVerifying}
              className="flex-1 sm:flex-none sm:min-w-[120px] touch-manipulation"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 mr-1 sm:mr-2 border-b-2 border-primary-foreground"></div>
                  <span className="text-sm sm:text-base">
                    {currentStep === 1 ? 'Sending...' : 'Verifying...'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">
                    {currentStep === steps.length ? 'Publish Timeline' : 'Next'}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};