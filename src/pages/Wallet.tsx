import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus, Wallet as WalletIcon } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { PaymentMethodCard } from "@/components/wallet/PaymentMethodCard";
import { AddPaymentMethodModal } from "@/components/wallet/AddPaymentMethodModal";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { supabase } from "@/integrations/supabase/client";

const Wallet = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  
  const { balance, transactions, loading: walletLoading } = useWallet();
  const { 
    paymentMethods, 
    loading: methodsLoading, 
    addPaymentMethod, 
    setPrimaryMethod, 
    deletePaymentMethod 
  } = usePaymentMethods();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    loadUser();
  }, []);

  if (walletLoading || methodsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <p>Loading wallet...</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Wallet</h1>
          <Button onClick={() => setAddMethodOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Balance
              </CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balance?.currency} {balance?.available_balance.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready to use
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Balance
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balance?.currency} {balance?.pending_balance.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                In processing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Escrowed Balance
              </CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {balance?.currency} {balance?.escrowed_balance.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Held in escrow
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No payment methods added yet
                </p>
              ) : (
                paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onSetPrimary={setPrimaryMethod}
                    onDelete={deletePaymentMethod}
                  />
                ))
              )}
            </CardContent>
          </Card>

          <TransactionHistory 
            transactions={transactions} 
            currentUserId={currentUserId}
          />
        </div>
      </main>

      <AddPaymentMethodModal
        open={addMethodOpen}
        onOpenChange={setAddMethodOpen}
        onAdd={addPaymentMethod}
      />

      <BottomNav />
    </div>
  );
};

export default Wallet;
