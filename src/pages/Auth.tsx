import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (!email) {
      toast({ title: "Please enter your email address" });
      return;
    }
    
    setIsSending(true);
    try {
      // Use Supabase's built-in OTP functionality with shouldCreateUser: true to allow signups
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // Enable user creation for signups
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        if (error.message.includes('Signups not allowed')) {
          toast({ 
            title: "Signup Disabled", 
            description: "Please enable email signup in your Supabase dashboard under Authentication > Providers" 
          });
        } else {
          toast({ title: error.message || "Failed to send verification code" });
        }
      } else {
        setIsCodeSent(true);
        toast({ title: "Verification code sent to your email" });
      }
    } catch (error) {
      console.error('Error sending code:', error);
      toast({ title: "Failed to send verification code" });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast({ title: "Please enter the 6-digit code" });
      return;
    }
    
    setIsVerifying(true);
    try {
      // Use Supabase's built-in OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: 'email'
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        if (error.message.includes('expired')) {
          toast({ 
            title: "Code Expired", 
            description: "Your verification code has expired. Please request a new one." 
          });
        } else if (error.message.includes('invalid')) {
          toast({ 
            title: "Invalid Code", 
            description: "The verification code is incorrect. Please try again." 
          });
        } else {
          toast({ title: error.message || "Invalid verification code" });
        }
        setIsVerifying(false);
      } else if (data.user && data.session) {
        toast({ title: "Email verified successfully!" });
        
        // Check if user has completed onboarding by checking if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();
        
        if (profile && profile.name) {
          // User has completed onboarding
          window.location.href = '/';
        } else {
          // User needs to complete onboarding
          window.location.href = '/onboarding';
        }
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({ title: "Failed to verify code" });
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setCode('');
    await handleSendCode();
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
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
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
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isSending}
                  size="sm"
                >
                  {isSending ? "Sending..." : "Resend Code"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsCodeSent(false)}
                  size="sm"
                >
                  Change Email
                </Button>
              </div>
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