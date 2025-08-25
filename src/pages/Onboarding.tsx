import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail,
  User, 
  Target, 
  DollarSign, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Briefcase,
  Timer
} from 'lucide-react';

interface OnboardingData {
  email: string;
  name: string;
  phone: string;
  role: string;
  contributionTypes: string[];
  primeExpectations: string[];
  outcomeSharing: string[];
  interestAreas: string[];
  customContributionType: string;
  customOutcomeSharing: string;
}

const steps = [
  { id: 1, title: 'Welcome', icon: Mail },
  { id: 2, title: 'Email Verification', icon: Timer },
  { id: 3, title: 'Profile Setup', icon: User },
  { id: 4, title: 'Contribution Types', icon: DollarSign },
  { id: 5, title: 'Prime Expectations', icon: Target },
  { id: 6, title: 'Outcome Sharing', icon: Brain },
  { id: 7, title: 'Interest Areas', icon: Brain },
  { id: 8, title: 'Complete Setup', icon: CheckCircle },
];

const contributionTypes = [
  { id: 'financial', label: '💰 Financial', description: 'cash, debt, pledges' },
  { id: 'intellectual', label: '🧠 Intellectual', description: 'advisory, research, design' },
  { id: 'network', label: '🌍 Network & Marketing', description: 'referrals, events, campaigns' },
  { id: 'assets', label: '🏢 Assets', description: 'land, office space, equipment' },
  { id: 'followup', label: '📋 Follow-up', description: 'onboarding, progress tracking' },
  { id: 'custom', label: '📊 Custom', description: 'anything else' },
];

const primeExpectationGroups = [
  {
    id: 'income',
    title: 'A) Generate Income & Wealth',
    subtitle: 'passive/main source',
    options: ['Passive income generation', 'Main income source', 'Investment returns']
  },
  {
    id: 'invest',
    title: 'B) Invest in others\' contributions',
    subtitle: 'financial, networks, intellectual, assets',
    options: ['Financial investments', 'Network building', 'Intellectual property', 'Asset investments']
  },
  {
    id: 'attract',
    title: 'C) Attract timelines/leads',
    subtitle: 'contribute, evolve, invest',
    options: ['Attract contributors', 'Business evolution', 'Investment opportunities']
  },
  {
    id: 'personal',
    title: 'D) Manage personal timelines',
    subtitle: 'alone/with others',
    options: ['Solo project management', 'Collaborative projects', 'Personal development']
  },
  {
    id: 'business',
    title: 'E) Manage & fulfill business timelines',
    subtitle: 'create, valuate, track, follow-up',
    options: ['Business creation', 'Valuation management', 'Progress tracking', 'Follow-up systems']
  },
  {
    id: 'partnerships',
    title: 'F) Partnerships & co-creation',
    subtitle: 'JV, co-invest, collaborate',
    options: ['Joint ventures', 'Co-investment opportunities', 'Strategic collaboration']
  },
  {
    id: 'outcomes',
    title: 'G) Valuating outcomes',
    subtitle: 'effective outcome sharing',
    options: ['Outcome measurement', 'Value distribution', 'Performance metrics']
  },
  {
    id: 'learning',
    title: 'H) Learning & personal evolution',
    subtitle: '',
    options: ['Skill development', 'Knowledge acquisition', 'Personal growth']
  },
  {
    id: 'innovation',
    title: 'I) Develop innovation, research & IP',
    subtitle: '',
    options: ['Research & development', 'Innovation projects', 'Intellectual property creation']
  },
  {
    id: 'teaching',
    title: 'J) Teach & mentor others',
    subtitle: '',
    options: ['Teaching', 'Mentoring', 'Knowledge sharing']
  }
];

const outcomeSharingOptions = [
  'Equity',
  'Wages',
  'Credit/Loan',
  'Revenue sharing',
  'Profit sharing',
  'Networks & Intellectual outcomes',
  'Custom'
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

const interestAreas = [
  'AI/ML', 'SaaS', 'Blockchain', 'Green Energy', 'Healthcare', 'EdTech', 'Fintech', 
  'E-commerce', 'Real Estate', 'Gaming', 'Biotech', 'Cybersecurity', 'Mobile', 'Cloud', 
  'IoT', 'VR/AR', 'Social Media', 'Digital Marketing', 'Media & Content', 
  'Food & Agriculture', 'Transport', 'Manufacturing', 'Fashion', 'Travel', 'Sports', 
  'Music', 'Photography', 'Film', 'Publishing', 'Consulting', 'Legal', 'Financial', 
  'Insurance', 'Retail', 'Construction', 'Mining', 'Oil & Gas', 'Pharma', 'Aerospace', 'Others'
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customRole, setCustomRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [data, setData] = useState<OnboardingData>({
    email: '',
    name: '',
    phone: '',
    role: '',
    contributionTypes: [],
    primeExpectations: [],
    outcomeSharing: [],
    interestAreas: [],
    customContributionType: '',
    customOutcomeSharing: '',
  });

  // Timer for verification code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCodeSent && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timeLeft]);

  const sendVerificationCode = async () => {
    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setTimeLeft(60);
        toast.success('Verification code sent to your email');
      } else {
        toast.error('Failed to send verification code');
      }
    } catch (error) {
      toast.error('Failed to send verification code');
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: data.email, 
          code: verificationCode 
        }),
      });

      if (response.ok) {
        toast.success('Email verified successfully');
        setCurrentStep(3);
      } else {
        toast.error('Invalid or expired code');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
    setIsVerifying(false);
  };

  const resendCode = () => {
    setVerificationCode('');
    setIsCodeSent(false);
    setTimeLeft(60);
    sendVerificationCode();
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await sendVerificationCode();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      await verifyCode();
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and save to database
      setIsSubmitting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please log in to complete onboarding");
          return;
        }

        // Save profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: user.email || data.email,
            name: data.name,
            phone: data.phone,
            professional_role: data.role
          });

        if (profileError) {
          console.error('Error saving profile:', profileError);
          toast.error("Failed to save profile: " + profileError.message);
          return;
        }

        // Save all other data in parallel
        const promises = [];

        // Save contribution types
        if (data.contributionTypes.length > 0) {
          const contributionTypesToSave = data.contributionTypes.map(type => {
            const finalType = type === 'custom' ? data.customContributionType : type;
            return {
              user_id: user.id,
              contribution_type: finalType
            };
          });
          
          promises.push(
            supabase.from('user_contribution_types').insert(contributionTypesToSave)
          );
        }

        // Save expectations
        if (data.primeExpectations.length > 0) {
          const expectationData = data.primeExpectations.map(expectation => ({
            user_id: user.id,
            expectation
          }));
          
          promises.push(
            supabase.from('user_expectations').insert(expectationData)
          );
        }

        // Save outcome sharing
        if (data.outcomeSharing.length > 0) {
          const outcomeData = data.outcomeSharing.map(outcome => {
            const finalOutcome = outcome === 'Custom' ? data.customOutcomeSharing : outcome;
            return {
              user_id: user.id,
              outcome_type: finalOutcome
            };
          });
          
          promises.push(
            supabase.from('user_outcome_sharing').insert(outcomeData)
          );
        }

        // Save interests
        if (data.interestAreas.length > 0) {
          const interestData = data.interestAreas.map(interest => ({
            user_id: user.id,
            interest,
            category: 'General'
          }));
          
          promises.push(
            supabase.from('user_interest_areas').insert(interestData)
          );
        }

        await Promise.all(promises);

        toast.success('Welcome to ShonaCoin! Your profile has been created.');
        window.location.href = '/';
      } catch (error) {
        console.error('Error completing onboarding:', error);
        toast.error("Failed to complete onboarding: " + (error as Error).message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (value: string, field: 'contributionTypes' | 'primeExpectations' | 'outcomeSharing' | 'interestAreas') => {
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
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Welcome to ShonaCoin</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                The best tool that helps fulfill your prime timelines in any way possible. 
                Match with, invest, track, valuate and follow up with any prime timeline.
              </p>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
                className="text-center"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Enter Verification Code</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a 6-digit code to {data.email}
              </p>
            </div>
            
            <div className="space-y-4">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => setVerificationCode(value)}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12" />
                  <InputOTPSlot index={1} className="w-12 h-12" />
                  <InputOTPSlot index={2} className="w-12 h-12" />
                  <InputOTPSlot index={3} className="w-12 h-12" />
                  <InputOTPSlot index={4} className="w-12 h-12" />
                  <InputOTPSlot index={5} className="w-12 h-12" />
                </InputOTPGroup>
              </InputOTP>
              
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Code expires in {timeLeft} seconds
                </p>
              ) : (
                <Button variant="link" onClick={resendCode} className="text-sm">
                  Resend Code
                </Button>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Profile Setup</h2>
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
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Select Contribution Types</h2>
            <p className="text-sm text-muted-foreground text-center">Choose all that apply (multi-select)</p>
            <div className="grid grid-cols-1 gap-3">
              {contributionTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={data.contributionTypes.includes(type.id) ? "default" : "outline"}
                  className="justify-start h-auto p-4 text-left border-2 hover:border-primary"
                  onClick={() => toggleSelection(type.id, 'contributionTypes')}
                >
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            {data.contributionTypes.includes('custom') && (
              <div className="mt-3">
                <Input
                  placeholder="Enter your custom contribution type"
                  value={data.customContributionType}
                  onChange={(e) => setData({...data, customContributionType: e.target.value})}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Prime Expectations & Goals</h2>
            <p className="text-sm text-muted-foreground text-center">Select your main goals (multi-select)</p>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {primeExpectationGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <div className="border-l-4 border-primary pl-3">
                    <h4 className="font-medium text-sm">{group.title}</h4>
                    {group.subtitle && (
                      <p className="text-xs text-muted-foreground">{group.subtitle}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 ml-4">
                    {group.options.map((option) => (
                      <Button
                        key={option}
                        variant={data.primeExpectations.includes(option) ? "default" : "outline"}
                        className="justify-start h-auto p-2 text-xs border-2 hover:border-primary"
                        onClick={() => toggleSelection(option, 'primeExpectations')}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Outcome Sharing</h2>
            <p className="text-sm text-muted-foreground text-center">How would you like to share outcomes? (multi-select)</p>
            <div className="grid grid-cols-1 gap-2">
              {outcomeSharingOptions.map((option, index) => (
                <Button
                  key={option}
                  variant={data.outcomeSharing.includes(option) ? "default" : "outline"}
                  className="justify-start h-auto p-3 text-left border-2 hover:border-primary"
                  onClick={() => toggleSelection(option, 'outcomeSharing')}
                >
                  <span className="text-xs mr-2 text-muted-foreground">{String.fromCharCode(97 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>
            {data.outcomeSharing.includes('Custom') && (
              <div className="mt-3">
                <Input
                  placeholder="Enter your custom outcome sharing option"
                  value={data.customOutcomeSharing}
                  onChange={(e) => setData({...data, customOutcomeSharing: e.target.value})}
                />
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Areas of Interest</h2>
            <p className="text-sm text-muted-foreground text-center">Select your areas of interest (multi-select)</p>
            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {interestAreas.map((area) => (
                <Button
                  key={area}
                  variant={data.interestAreas.includes(area) ? "default" : "outline"}
                  className="justify-start h-auto p-2 text-xs border-2 hover:border-primary"
                  onClick={() => toggleSelection(area, 'interestAreas')}
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Setup Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your profile timeline has been created and you're ready to start using ShonaCoin.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Summary:</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• {data.contributionTypes.length} contribution type(s) selected</p>
                  <p>• {data.primeExpectations.length} prime expectation(s) chosen</p>
                  <p>• {data.outcomeSharing.length} outcome sharing option(s)</p>
                  <p>• {data.interestAreas.length} interest area(s) selected</p>
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
        return verificationCode.length === 6;
      case 3:
        return data.name && data.phone && data.role;
      case 4:
        if (data.contributionTypes.includes('custom')) {
          return data.contributionTypes.length > 0 && data.customContributionType.trim().length > 0;
        }
        return data.contributionTypes.length > 0;
      case 5:
        return data.primeExpectations.length > 0;
      case 6:
        if (data.outcomeSharing.includes('Custom')) {
          return data.outcomeSharing.length > 0 && data.customOutcomeSharing.trim().length > 0;
        }
        return data.outcomeSharing.length > 0;
      case 7:
        return data.interestAreas.length > 0;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (currentStep === 1) return 'Send Verification Code';
    if (currentStep === 2) return isVerifying ? 'Verifying...' : 'Verify Code';
    if (currentStep === steps.length) return isSubmitting ? 'Completing Setup...' : 'Complete Setup';
    return 'Next';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6 text-primary-foreground" />
              </div>
              {currentStep > 2 && (
                <>
                  <CardTitle className="text-xl sm:text-2xl">Setup Your Profile</CardTitle>
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
                </>
              )}
            </div>
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
              disabled={!canProceed() || isSubmitting || isVerifying}
              className="flex-1 sm:flex-none sm:min-w-[120px] touch-manipulation"
            >
              <span className="text-sm sm:text-base">{getButtonText()}</span>
              <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};