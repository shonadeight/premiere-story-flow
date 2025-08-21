import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleSendCode = () => {
    if (!email) {
      toast({ title: "Please enter your email address" });
      return;
    }
    setIsCodeSent(true);
    toast({ title: "Verification code sent to your email" });
  };

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      toast({ title: "Please enter the 6-digit code" });
      return;
    }
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authenticated', 'true');
      // Check if user needs onboarding
      const isNewUser = !localStorage.getItem('onboardingComplete');
      if (isNewUser) {
        window.location.href = '/onboarding';
      } else {
        window.location.href = '/';
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Welcome to PrimeTimelines</CardTitle>
          <p className="text-muted-foreground">
            {!isCodeSent 
              ? "Enter your email to get started" 
              : "Enter the verification code sent to your email"
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isCodeSent ? (
            <>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
                />
              </div>
              <Button 
                onClick={handleSendCode}
                className="w-full"
                size="lg"
              >
                Send Verification Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Code sent to: {email}
                </div>
                <Input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6))}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyCode}
                className="w-full"
                size="lg"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify & Continue
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsCodeSent(false)}
                className="w-full"
              >
                Use Different Email
              </Button>
            </>
          )}
          
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Badge variant="outline">Secure</Badge>
            <span>No passwords required</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};