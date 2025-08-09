import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Target, 
  DollarSign, 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Plus
} from 'lucide-react';

interface OnboardingData {
  name: string;
  phone: string;
  role: string;
  goals: string[];
  investmentRange: string;
  interests: string[];
  experience: string;
}

const steps = [
  { id: 1, title: 'Profile Setup', icon: User },
  { id: 2, title: 'Timeline Goals', icon: Target },
  { id: 3, title: 'Portfolio Preferences', icon: DollarSign },
  { id: 4, title: 'AI Training', icon: Brain },
];

const goalOptions = [
  'Generate passive income',
  'Build strategic partnerships',
  'Develop IP and intellectual property',
  'Network expansion',
  'Risk diversification',
  'Market research and insights'
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

const interestOptions = [
  'AI & Machine Learning', 'SaaS & Software', 'Blockchain & Crypto', 'Green Energy',
  'Healthcare Tech', 'EdTech', 'Fintech', 'E-commerce', 'Real Estate', 'Gaming & Entertainment',
  'Biotechnology', 'Renewable Energy', 'Cybersecurity', 'Mobile Apps', 'Cloud Computing',
  'IoT & Smart Devices', 'VR/AR Technology', 'Social Media', 'Digital Marketing', 'Media & Content',
  'Food & Agriculture', 'Transportation', 'Manufacturing', 'Fashion & Lifestyle', 'Travel & Tourism',
  'Sports & Fitness', 'Music & Arts', 'Photography', 'Film & Video', 'Publishing',
  'Consulting Services', 'Legal Services', 'Financial Services', 'Insurance', 'Retail',
  'Construction', 'Mining', 'Oil & Gas', 'Pharmaceuticals', 'Aerospace'
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customRole, setCustomRole] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [data, setData] = useState<OnboardingData>({
    name: '',
    phone: '',
    role: '',
    goals: [],
    investmentRange: '',
    interests: [],
    experience: ''
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and create user timeline
      localStorage.setItem('onboardingComplete', 'true');
      localStorage.setItem('userProfile', JSON.stringify(data));
      // Create user as timeline entity
      const userTimeline = {
        id: 'user-' + Date.now(),
        title: `${data.name} - Personal Timeline`,
        type: 'contact',
        description: `Professional ${data.role} focused on ${data.goals.join(', ')}`,
        value: 0,
        currency: 'USD',
        change: 0,
        changePercent: 0,
        invested: false,
        subtimelines: 0,
        rating: 5.0,
        views: 1,
        investedMembers: 0,
        matchedTimelines: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'self',
        tags: [data.role, ...data.interests.slice(0, 3)],
        customMetrics: {
          investmentRange: data.investmentRange,
          experience: data.experience,
          goals: data.goals,
          interests: data.interests
        }
      };
      localStorage.setItem('userTimeline', JSON.stringify(userTimeline));
      window.location.href = '/';
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (value: string, field: 'goals' | 'interests') => {
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

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">What are your main timeline goals?</label>
              <div className="grid grid-cols-1 gap-2">
                {goalOptions.map((goal) => (
                  <Button
                    key={goal}
                    variant={data.goals.includes(goal) ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => toggleSelection(goal, 'goals')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    {goal}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Range</label>
              <Select value={data.investmentRange} onValueChange={(value) => setData({...data, investmentRange: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1k-10k">$1K - $10K</SelectItem>
                  <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                  <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                  <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                  <SelectItem value="500k+">$500K+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">Areas of Interest</label>
              <div className="h-48 overflow-y-auto border rounded-lg p-2">
                <div className="grid grid-cols-3 gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      variant={data.interests.includes(interest) ? "default" : "outline"}
                      className="justify-start h-auto p-2 text-xs"
                      onClick={() => toggleSelection(interest, 'interests')}
                    >
                      <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{interest}</span>
                    </Button>
                  ))}
                  <Button
                    variant={data.interests.includes('custom') ? "default" : "outline"}
                    className="justify-start h-auto p-2 text-xs"
                    onClick={() => {
                      if (data.interests.includes('custom')) {
                        setData(prev => ({
                          ...prev,
                          interests: prev.interests.filter(i => i !== 'custom')
                        }));
                      } else {
                        setData(prev => ({
                          ...prev,
                          interests: [...prev.interests, 'custom']
                        }));
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Others</span>
                  </Button>
                </div>
              </div>
              {data.interests.includes('custom') && (
                <div className="mt-3">
                  <Input
                    placeholder="Enter custom interest (press Enter to add)"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customInterest.trim()) {
                        const newInterest = customInterest.trim();
                        if (!data.interests.includes(newInterest)) {
                          setData(prev => ({
                            ...prev,
                            interests: [...prev.interests.filter(i => i !== 'custom'), newInterest, 'custom']
                          }));
                        }
                        setCustomInterest('');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Experience</label>
              <Select value={data.experience} onValueChange={(value) => setData({...data, experience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                  <SelectItem value="expert">Expert (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Assistant Setup</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your preferences, we'll customize your AI assistant to provide personalized recommendations, 
                risk assessments, and investment opportunities that match your goals.
              </p>
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
        return data.name && data.phone && data.role;
      case 2:
        return data.goals.length > 0;
      case 3:
        return data.investmentRange && data.interests.length > 0;
      case 4:
        return data.experience;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Setup Your Profile</CardTitle>
                <p className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</p>
              </div>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length ? 'Complete Setup' : 'Next Step'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};