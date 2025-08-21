import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  TrendingUp,
  Plus,
  Heart,
  Building,
  ClipboardList,
  BarChart3
} from 'lucide-react';

interface OnboardingData {
  email: string;
  verificationCode: string;
  name: string;
  phone: string;
  role: string;
  contributionTypes: string[];
  primeExpectations: string[];
  outcomeSharing: string[];
  interestAreas: string[];
}

const steps = [
  { id: 1, title: 'Email Verification', icon: Mail },
  { id: 2, title: 'Verification Code', icon: CheckCircle },
  { id: 3, title: 'Profile Setup', icon: User },
  { id: 4, title: 'Contribution Types', icon: DollarSign },
  { id: 5, title: 'Prime Expectations', icon: Target },
  { id: 6, title: 'Outcome Sharing', icon: BarChart3 },
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

const primeExpectations = [
  'Manage and follow timelines (personal + aligned)',
  'Contribute & valuate contributions',
  'Expand skills, awareness & learning from others',
  'Share outcomes, match with investors/partners/leads',
  'Build networks & strategic partnerships',
  'Manage assets, investments & generate income',
  'Develop IP, research & innovation',
  'Risk diversification & market insights',
  'Teach, mentor & support others',
];

const outcomeSharingOptions = [
  'Equity',
  'Wages',
  'Credit/loan',
  'Revenue sharing',
  'Profit sharing',
  'Networks & intellectual outcomes',
  'Add extra options',
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

const interestCategories = {
  'Technology': ['AI/ML', 'SaaS', 'Blockchain', 'Cybersecurity', 'Cloud', 'Mobile Apps', 'IoT', 'VR/AR'],
  'Health & Science': ['Healthcare Tech', 'Biotech', 'Pharmaceuticals', 'Green/Renewable Energy'],
  'Business & Finance': ['Fintech', 'E-commerce', 'Financial Services', 'Insurance', 'Consulting', 'Legal'],
  'Creative & Media': ['Gaming', 'Entertainment', 'Social Media', 'Digital Marketing', 'Music', 'Arts', 'Film', 'Publishing', 'Photography'],
  'Industries & Infrastructure': ['Real Estate', 'Construction', 'Manufacturing', 'Mining', 'Oil & Gas', 'Aerospace', 'Transportation'],
  'Lifestyle & Services': ['Fashion', 'Retail', 'Travel', 'Tourism', 'Sports', 'Fitness', 'Food & Agriculture', 'Education (EdTech)', 'Others'],
};

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
    contributionTypes: [],
    primeExpectations: [],
    outcomeSharing: [],
    interestAreas: [],
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

        // Save profile
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

        // Save expectations
        if (data.primeExpectations.length > 0) {
          const expectationData = data.primeExpectations.map(expectation => ({
            user_id: user.id,
            expectation
          }));
          
          const { error: expectationError } = await supabase
            .from('user_expectations')
            .insert(expectationData);

          if (expectationError) {
            console.error('Error saving expectations:', expectationError);
          }
        }

        // Save outcome sharing preferences
        if (data.outcomeSharing.length > 0) {
          const outcomeData = data.outcomeSharing.map(outcome => ({
            user_id: user.id,
            outcome_type: outcome
          }));
          
          const { error: outcomeError } = await supabase
            .from('user_outcome_sharing')
            .insert(outcomeData);

          if (outcomeError) {
            console.error('Error saving outcome sharing:', outcomeError);
          }
        }

        // Save interest areas
        if (data.interestAreas.length > 0) {
          const interestData = data.interestAreas.map(interest => {
            // Find the category for this interest
            const category = Object.entries(interestCategories).find(([cat, items]) => 
              items.includes(interest)
            )?.[0] || 'Other';
            
            return {
              user_id: user.id,
              interest,
              category
            };
          });
          
          const { error: interestError } = await supabase
            .from('user_interest_areas')
            .insert(interestData);

          if (interestError) {
            console.error('Error saving interests:', interestError);
          }
        }

        toast.success('Welcome to ShonaCoin! Your profile has been created.');
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Verification Code</label>
              <Input
                placeholder="Enter 6-digit code"
                value={data.verificationCode}
                onChange={(e) => setData({...data, verificationCode: e.target.value})}
                maxLength={6}
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

      case 3:
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Select contribution types (multi-select):</label>
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

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Select prime expectations/goals (multi-select):</label>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {primeExpectations.map((expectation, index) => (
                  <Button
                    key={index}
                    variant={data.primeExpectations.includes(expectation) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left text-sm"
                    onClick={() => toggleSelection(expectation, 'primeExpectations')}
                  >
                    <span className="text-xs mr-2 text-muted-foreground">{index + 1})</span>
                    {expectation}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Outcome sharing (multi-select):</label>
              <div className="grid grid-cols-1 gap-2">
                {outcomeSharingOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant={data.outcomeSharing.includes(option) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => toggleSelection(option, 'outcomeSharing')}
                  >
                    <span className="text-xs mr-2 text-muted-foreground">{String.fromCharCode(97 + index)})</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Select areas of interest (multi-select by category):</label>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(interestCategories).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {items.map((item) => (
                        <Button
                          key={item}
                          variant={data.interestAreas.includes(item) ? "default" : "outline"}
                          className="justify-start h-auto p-2 text-xs"
                          onClick={() => toggleSelection(item, 'interestAreas')}
                        >
                          {item}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
        return data.verificationCode.length === 6;
      case 3:
        return data.name && data.phone && data.role;
      case 4:
        return data.contributionTypes.length > 0;
      case 5:
        return data.primeExpectations.length > 0;
      case 6:
        return data.outcomeSharing.length > 0;
      case 7:
        return data.interestAreas.length > 0;
      case 8:
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
              <CardTitle className="text-xl sm:text-2xl">Welcome to ShonaCoin</CardTitle>
              <p className="text-sm sm:text-base text-muted-foreground">
                The best tool that helps fulfill your prime timelines. Match, invest, track, valuate and follow up with any primetimeline.
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
                    {currentStep === steps.length ? 'Complete Setup' : 'Next'}
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