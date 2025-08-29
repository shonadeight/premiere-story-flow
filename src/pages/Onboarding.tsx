import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
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
  Timer,
  ChevronDown,
  ChevronUp,
  Plus,
  Gift,
  Lock
} from 'lucide-react';

interface OnboardingData {
  email: string;
  name: string;
  phone: string;
  role: string;
  contributionTypes: {[key: string]: string[]};
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
  { 
    id: 'financial', 
    label: '💰 Financial', 
    subOptions: ['Cash', 'Debt', 'Pledges']
  },
  { 
    id: 'intellectual', 
    label: '🧠 Intellectual', 
    subOptions: ['Advisory', 'Research', 'Design']
  },
  { 
    id: 'network', 
    label: '🌍 Network & Marketing', 
    subOptions: ['Referrals', 'Events', 'Campaigns']
  },
  { 
    id: 'assets', 
    label: '🏢 Assets', 
    subOptions: ['Land', 'Office space', 'Equipment']
  },
  { 
    id: 'followup', 
    label: '📋 Follow-up', 
    subOptions: ['Onboarding', 'Progress tracking']
  },
  { 
    id: 'custom', 
    label: '📊 Custom', 
    subOptions: []
  },
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
  const navigate = useNavigate();
  // Always start from step 1 to ensure proper onboarding flow
  const [currentStep, setCurrentStep] = useState(1);
  const [customRole, setCustomRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  const [newCustomOptions, setNewCustomOptions] = useState<{[key: string]: string}>({});
  const [data, setData] = useState<OnboardingData>({
    email: '',
    name: '',
    phone: '',
    role: '',
    contributionTypes: {},
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

  // Navigate to step 2 when verification code is sent successfully
  useEffect(() => {
    if (isCodeSent && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [isCodeSent, currentStep]);

  const sendVerificationCode = async () => {
    if (!data.email || !data.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    setError('');
    
    try {
      const { data: response, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email: data.email }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setError('Failed to send verification code. Please try again.');
        toast.error('Failed to send verification code');
        return;
      }

      if (response?.success) {
        setIsCodeSent(true);
        setTimeLeft(60);
        toast.success('Verification code sent to your email');
      } else {
        setError('Failed to send verification code. Please try again.');
        toast.error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
      toast.error('Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    try {
      const { data: response, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          email: data.email, 
          code: verificationCode 
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setError('Invalid or expired verification code');
        toast.error('Invalid or expired verification code');
        return;
      }

      if (response?.success) {
        toast.success('Email verified successfully');
        
        // Check if user is already onboarded
        if (response.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('user_id', response.user.id)
            .single();
          
          if (profile?.onboarding_completed) {
            // User is already onboarded, go straight to dashboard
            toast.success('Welcome back!');
            window.location.href = '/portfolio';
            return;
          }
        }
        
        // New user or incomplete onboarding, continue to profile setup
        setCurrentStep(3);
      } else {
        setError('Invalid or expired verification code');
        toast.error('Invalid or expired verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Verification failed. Please try again.');
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    setVerificationCode('');
    setError('');
    setTimeLeft(60);
    await sendVerificationCode();
  };

  const changeEmail = () => {
    setVerificationCode('');
    setIsCodeSent(false);
    setError('');
    setTimeLeft(60);
    setCurrentStep(1);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      await sendVerificationCode();
      // Navigate to step 2 if code was sent successfully (isCodeSent will be true)
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

        // Check if profile exists and update or insert accordingly
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        let profileError;
        if (existingProfile) {
          // Update existing profile
          const { error } = await supabase
            .from('profiles')
            .update({
              email: user.email || data.email,
              name: data.name,
              phone: data.phone,
              professional_role: data.role,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
          profileError = error;
        } else {
          // Insert new profile
          const { error } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              email: user.email || data.email,
              name: data.name,
              phone: data.phone,
              professional_role: data.role
            });
          profileError = error;
        }

        if (profileError) {
          console.error('Error saving profile:', profileError);
          toast.error("Failed to save profile: " + profileError.message);
          return;
        }

        // Delete existing data first, then insert new data (UPSERT behavior)
        const deletePromises = [
          supabase.from('user_contribution_types').delete().eq('user_id', user.id),
          supabase.from('user_expectations').delete().eq('user_id', user.id),
          supabase.from('user_outcome_sharing').delete().eq('user_id', user.id),
          supabase.from('user_interest_areas').delete().eq('user_id', user.id)
        ];

        await Promise.all(deletePromises);

        // Now insert all new data in parallel
        const insertPromises = [];

        // Save contribution types
        const allContributionTypes = Object.entries(data.contributionTypes)
          .flatMap(([category, options]) => options.map(option => `${category}: ${option}`));
        
        if (allContributionTypes.length > 0) {
          const contributionTypesToSave = allContributionTypes.map(type => ({
            user_id: user.id,
            contribution_type: type
          }));
          
          insertPromises.push(
            supabase.from('user_contribution_types').insert(contributionTypesToSave)
          );
        }

        // Save expectations
        if (data.primeExpectations.length > 0) {
          const expectationData = data.primeExpectations.map(expectation => ({
            user_id: user.id,
            expectation
          }));
          
          insertPromises.push(
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
          
          insertPromises.push(
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
          
          insertPromises.push(
            supabase.from('user_interest_areas').insert(interestData)
          );
        }

        await Promise.all(insertPromises);

        // Mark onboarding as completed
        await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        toast.success('Welcome to ShonaCoin! Your profile has been created.');
        // Force refresh to main app
        window.location.href = '/portfolio';
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

  const toggleSelection = (value: string, field: 'primeExpectations' | 'outcomeSharing' | 'interestAreas') => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleContributionSubOption = (categoryId: string, subOption: string) => {
    setData(prev => {
      const currentSelections = prev.contributionTypes[categoryId] || [];
      const isSelected = currentSelections.includes(subOption);
      
      return {
        ...prev,
        contributionTypes: {
          ...prev.contributionTypes,
          [categoryId]: isSelected
            ? currentSelections.filter(item => item !== subOption)
            : [...currentSelections, subOption]
        }
      };
    });
  };

  const addCustomSubOption = (categoryId: string) => {
    const customValue = newCustomOptions[categoryId]?.trim();
    if (customValue) {
      toggleContributionSubOption(categoryId, customValue);
      setNewCustomOptions(prev => ({
        ...prev,
        [categoryId]: ''
      }));
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-md mx-auto">
            <Card className="border border-border bg-card shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground mb-3">
                  Welcome to ShonaCoin
                </CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  The best tool that helps fulfill your prime timelines in any way possible. Match with, invest, track, valuate and follow up with any prime timeline.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="w-full"
                    disabled={isCodeSent}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
                  <Lock className="h-3 w-3 mr-1 text-orange-500" />
                  <span>Secure / No passwords required</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Timer className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Email Verification
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  We've sent a 6-digit code to {data.email}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Error display */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {/* OTP Input */}
                <div className="space-y-4 text-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                    disabled={timeLeft === 0}
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
                      Code expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive font-medium">Code expired</p>
                      <div className="flex gap-2 justify-center">
                         <Button 
                           variant="secondary" 
                           onClick={resendCode} 
                           disabled={isSendingCode}
                           className="text-sm hover:bg-secondary hover:text-secondary-foreground"
                         >
                           {isSendingCode ? 'Sending...' : 'Resend Code'}
                         </Button>
                         <Button 
                           variant="ghost" 
                           onClick={changeEmail} 
                           className="text-sm hover:bg-accent hover:text-accent-foreground"
                         >
                          Change Email
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Profile Setup
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Tell us about yourself to complete your profile
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      placeholder="Alex Johnson"
                      value={data.name}
                      onChange={(e) => setData({...data, name: e.target.value})}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={data.phone}
                      onChange={(e) => setData({...data, phone: e.target.value})}
                      className="h-11"
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
                      <SelectTrigger className="h-11">
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
                        className="h-11"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Contribution Types
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  What types of contributions would you leverage or give?
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {contributionTypes.map((type) => {
                    const isExpanded = expandedCategories[type.id];
                    const selectedOptions = data.contributionTypes[type.id] || [];
                    const hasSelections = selectedOptions.length > 0;
                    
                    return (
                      <div key={type.id} className="space-y-2">
                          <Button
                           variant={hasSelections ? "secondary" : "outline"}
                           className={`w-full justify-between h-auto p-5 text-left ${hasSelections ? 'hover:bg-secondary hover:text-secondary-foreground' : 'hover:bg-background hover:text-foreground'}`}
                           onClick={() => toggleCategoryExpansion(type.id)}
                         >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.label}</span>
                            {hasSelections && (
                              <Badge variant="secondary" className="text-xs">
                                {selectedOptions.length}
                              </Badge>
                            )}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {isExpanded && (
                          <div className="ml-4 space-y-2 p-4 border border-border rounded-lg bg-muted/10">
                            {/* Predefined sub-options */}
                            {type.subOptions.map((subOption) => (
                              <div key={subOption} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${type.id}-${subOption}`}
                                  checked={selectedOptions.includes(subOption)}
                                  onCheckedChange={() => toggleContributionSubOption(type.id, subOption)}
                                />
                                <label
                                  htmlFor={`${type.id}-${subOption}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {subOption}
                                </label>
                              </div>
                            ))}
                            
                            {/* Custom sub-options that were added */}
                            {selectedOptions
                              .filter(option => !type.subOptions.includes(option))
                              .map((customOption) => (
                                <div key={customOption} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${type.id}-${customOption}`}
                                    checked={true}
                                    onCheckedChange={() => toggleContributionSubOption(type.id, customOption)}
                                  />
                                  <label
                                    htmlFor={`${type.id}-${customOption}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer italic"
                                  >
                                    {customOption}
                                  </label>
                                </div>
                              ))
                            }
                            
                            {/* Add custom option */}
                            <div className="flex items-center space-x-2 pt-2 border-t border-border">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder={type.id === 'custom' ? "Add anything else that adds value" : "Add more"}
                                value={newCustomOptions[type.id] || ''}
                                onChange={(e) => setNewCustomOptions(prev => ({
                                  ...prev,
                                  [type.id]: e.target.value
                                }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addCustomSubOption(type.id);
                                  }
                                }}
                                className="text-sm"
                              />
                               <Button
                                 size="sm"
                                 variant="secondary"
                                 onClick={() => addCustomSubOption(type.id)}
                                 disabled={!newCustomOptions[type.id]?.trim()}
                                 className="hover:bg-secondary hover:text-secondary-foreground"
                               >
                                 Add
                               </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Prime Expectations & Goals
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Select your main goals for using ShonaCoin
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

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
                            variant={data.primeExpectations.includes(option) ? "secondary" : "outline"}
                            className={`justify-start h-auto p-3 text-xs ${data.primeExpectations.includes(option) ? 'hover:bg-secondary hover:text-secondary-foreground' : 'hover:bg-background hover:text-foreground'}`}
                            onClick={() => toggleSelection(option, 'primeExpectations')}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Outcome Sharing
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  How would you like to share outcomes?
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {outcomeSharingOptions.map((option, index) => (
                      <Button
                        key={option}
                        variant={data.outcomeSharing.includes(option) ? "secondary" : "outline"}
                        className={`justify-start h-auto p-4 text-left ${data.outcomeSharing.includes(option) ? 'hover:bg-secondary hover:text-secondary-foreground' : 'hover:bg-background hover:text-foreground'}`}
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
                      className="h-11"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Areas of Interest
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Select your areas of interest
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {interestAreas.map((area) => (
                      <Button
                        key={area}
                        variant={data.interestAreas.includes(area) ? "secondary" : "outline"}
                        className={`justify-start h-auto p-3 text-xs ${data.interestAreas.includes(area) ? 'hover:bg-secondary hover:text-secondary-foreground' : 'hover:bg-background hover:text-foreground'}`}
                        onClick={() => toggleSelection(area, 'interestAreas')}
                      >
                      {area}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 8:
        return (
          <div className="max-w-lg mx-auto">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Setup Complete!
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Your profile timeline has been created and you're ready to start using ShonaCoin
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of {steps.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-3">Summary:</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>• {Object.values(data.contributionTypes).flat().length} contribution type(s) selected</p>
                    <p>• {data.primeExpectations.length} prime expectation(s) chosen</p>
                    <p>• {data.outcomeSharing.length} outcome sharing option(s)</p>
                    <p>• {data.interestAreas.length} interest area(s) selected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        return Object.values(data.contributionTypes).some(options => options.length > 0);
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
    if (currentStep === 1) return isSendingCode ? 'Sending...' : 'Send Verification Code';
    if (currentStep === 2) return isVerifying ? 'Verifying...' : 'Verify Code';
    if (currentStep === steps.length) return isSubmitting ? 'Completing Setup...' : 'Complete Setup';
    return 'Next';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        {renderStep()}
      </div>

      {/* Footer with Navigation Buttons - Fixed at bottom */}
      <div className="mt-8 p-4 bg-background/95 backdrop-blur-sm border-t sticky bottom-0">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-between gap-3">
             <Button 
               variant="secondary" 
               onClick={handlePrevious}
               disabled={currentStep === 1}
               className="flex-1 sm:flex-none sm:min-w-[120px] touch-manipulation hover:bg-secondary hover:text-secondary-foreground"
             >
               <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
               <span className="text-sm sm:text-base">Previous</span>
             </Button>
             
             <Button 
               onClick={handleNext}
               disabled={!canProceed() || isSubmitting || isVerifying || isSendingCode}
               variant="secondary"
               className="flex-1 sm:flex-none sm:min-w-[120px] touch-manipulation hover:bg-secondary hover:text-secondary-foreground"
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