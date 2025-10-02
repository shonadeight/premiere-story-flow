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
  Code,
  Building2,
  UserCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  MessageCircle,
  Rocket,
  LineChart,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

export const About = () => {
  const navigate = useNavigate();

  const whyShonaCoin = [
    {
      icon: Globe,
      title: 'Contribute & Receive Across All Capital Types',
      description: 'Share or attract financial support, ideas, skills, networks, and assets — all tracked in one dynamic timeline.'
    },
    {
      icon: Zap,
      title: 'One Unified Platform',
      description: 'Every contribution becomes part of your timeline, helping you measure value, share outcomes, and connect with aligned opportunities.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Assistant',
      description: 'Your personal ShonaCoin Assistant helps you negotiate, track, and discover new matches — so every action moves you closer to success.'
    },
    {
      icon: Users,
      title: 'Flexible & Human-Centered',
      description: "Contributions aren't just transactions. They're relationships — backed by insights, smart rules, and transparent valuation."
    }
  ];

  const capabilities = [
    'Create & grow your own Prime Timeline',
    'Receive investments or contributions in cash, knowledge, connections, or assets',
    "Contribute to others' journeys and share in their outcomes",
    'Negotiate, track, and rate contributions with built-in smart rules',
    'Trade timeline portions like shares — and earn returns',
    'Use the AI Assistant to simplify every decision'
  ];

  const targetUsers = [
    {
      icon: Rocket,
      title: 'Entrepreneurs & Startups',
      description: 'Raise contributions, track investors, share equity & profits.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: UserCircle,
      title: 'Students & Professionals',
      description: 'Get mentorship, resources, and network support for your growth.',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'Investors & Givers',
      description: 'Put your capital, time, or skills to work in timelines you believe in.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Building2,
      title: 'Organizations & Teams',
      description: 'Align members, projects, and resources under one shared outcome.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Code,
      title: 'Developers & Builders',
      description: 'Integrate APIs, build custom procedures, and create value through code.',
      gradient: 'from-indigo-500 to-violet-600'
    },
    {
      icon: Target,
      title: 'Project Owners & Companies',
      description: 'Match with contributors, generate revenues, and scale your impact.',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary-glow/5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0 shadow-glow">
            <Sparkles className="h-3 w-3 mr-1" />
            Invest in People, Not Just Projects
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent leading-tight">
            ShonaCoin
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
            Fulfill Your Prime Timelines with Contributions That Count
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            ShonaCoin is more than an app. It's a living network of timelines — where financial, intellectual, network, and asset contributions flow freely between people, teams, and organizations. Whether you're an entrepreneur, a creative, a student, or an investor — you can give, receive, match, and grow contributions that matter to your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-elegant text-lg px-8"
            >
              Join Early Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/assistant-modal')}
              className="text-lg px-8"
            >
              <Brain className="mr-2 h-5 w-5" />
              Talk to AI Assistant
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download App
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      {/* Why ShonaCoin Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why ShonaCoin?</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {whyShonaCoin.map((item, idx) => (
            <Card key={idx} className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mb-6 shadow-glow">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What You Can Do Section */}
      <div className="bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What You Can Do with ShonaCoin</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {capabilities.map((capability, idx) => (
              <div key={idx} className="flex items-start gap-3 p-5 bg-background rounded-lg border hover:shadow-elegant transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who Is It For Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Who Is It For?</h2>
        <p className="text-center text-muted-foreground mb-16 text-lg max-w-3xl mx-auto">
          For personal use and shared collaboration. Match with contributors and generate revenues together.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {targetUsers.map((user, idx) => (
            <Card key={idx} className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300 overflow-hidden group">
              <CardContent className="p-6">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${user.gradient} flex items-center justify-center mb-4 shadow-elegant group-hover:scale-110 transition-transform`}>
                  <user.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{user.title}</h3>
                <p className="text-muted-foreground">{user.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary-glow/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">ShonaCoin Vision</h2>
          <div className="max-w-4xl mx-auto space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p className="font-medium">
              We believe in a world where <span className="text-foreground font-bold">everyone is investable</span> — not just companies.
            </p>
            <p>
              Where contributions are flexible, trackable, and rewarding.
            </p>
            <p>
              Where timelines evolve together, and outcomes are shared by all who helped make them possible.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
            Don't Just Watch the Future Happen
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Help create it with ShonaCoin.
          </p>
          <p className="text-lg text-muted-foreground mb-12">
            Be an early contributor, early receiver, and early investor in the next evolution of contribution.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Button 
              size="lg"
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-elegant"
            >
              Get Early Access
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Download className="h-5 w-5" />
              Download Beta
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/assistant-modal')}
              className="gap-2"
            >
              <Brain className="h-5 w-5" />
              AI Assistant
            </Button>
          </div>
          
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ShonaCoin – Where Every Contribution Becomes a Timeline.
          </p>
        </div>
      </div>
    </div>
  );
};
