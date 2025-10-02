import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  DollarSign,
  Brain,
  Network,
  Package,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: DollarSign,
      title: 'Financial Contributions',
      description: 'Cash, debt, equity, revenue sharing, profit splits, and pledges - all in one platform.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Brain,
      title: 'Intellectual Contributions',
      description: 'Coaching, tutoring, project development, mentorship, consultation, research, and capacity building.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Network,
      title: 'Marketing & Networking',
      description: 'Lead onboarding, follow-ups, conversion tracking, and retention management across all channels.',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Package,
      title: 'Asset Contributions',
      description: 'Farm tools, land, livestock, construction machinery, digital assets, software, and more.',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const benefits = [
    'AI-powered timeline matching',
    'Flexible contribution procedures',
    'Outcome sharing & valuations',
    'Smart rules & automation',
    'Multi-channel integrations',
    'Custom ratings & insights',
    'Knots & knowledge linking',
    'Secure payment processing'
  ];

  const useCases = [
    {
      title: 'Entrepreneurs',
      description: 'Find investors, collaborators, and resources to fulfill your business Prime Timeline.'
    },
    {
      title: 'Investors',
      description: 'Discover promising projects and contribute financially, intellectually, or through networks.'
    },
    {
      title: 'Professionals',
      description: 'Offer your expertise and receive contributions aligned with your Prime Timeline expectations.'
    },
    {
      title: 'Organizations',
      description: 'Manage collaborative timelines, track outcomes, and share value across teams and partners.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered Timeline Collaboration
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
          Welcome to ShonaCoin
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The AI-powered platform that helps individuals and teams fulfill their Prime Timelines through structured contributions, intelligent matching, and outcome sharing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            Get Early Access
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/assistant-modal')}
          >
            <Brain className="mr-2 h-5 w-5" />
            Ask the Assistant
          </Button>
        </div>
      </div>

      {/* What is ShonaCoin Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What is ShonaCoin?</h2>
          <p className="text-lg text-muted-foreground">
            ShonaCoin is an AI-powered application that enables users to give and receive contributions in multiple forms—financial, intellectual, marketing, and assets. Users can share insights, follow-ups, custom ratings, smart rules, knowledge nodes (Knots), linked files, and match with others who have aligned Prime Timelines.
          </p>
        </div>

        {/* Contribution Types Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 p-4 bg-background rounded-lg border">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who is ShonaCoin For?</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, idx) => (
            <Card key={idx} className="hover:shadow-elegant transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: '1', title: 'Define Your Prime Timeline', description: 'Set up your goals, expectations, and the types of contributions you can give or receive.' },
              { step: '2', title: 'Configure Contributions', description: 'Use our flexible contribution setup for financial, intellectual, marketing, or asset contributions.' },
              { step: '3', title: 'AI-Powered Matching', description: 'Get matched with aligned timelines and contributors based on mutual expectations.' },
              { step: '4', title: 'Negotiate & Collaborate', description: 'Use the negotiation adder to align on valuations, follow-ups, insights, and smart rules.' },
              { step: '5', title: 'Track & Share Outcomes', description: 'Monitor progress, share outcomes, and distribute value according to agreed rules.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-background rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Fulfill Your Prime Timeline?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join ShonaCoin today and start collaborating with contributors aligned to your vision. Early access is now open!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate('/assistant-modal')}
          >
            <Brain className="mr-2 h-5 w-5" />
            Learn More with AI
          </Button>
        </div>
      </div>
    </div>
  );
};
