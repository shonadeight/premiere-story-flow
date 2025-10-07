import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WalletBalance {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  escrowed_balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  contribution_id?: string;
  payer_user_id: string;
  payee_user_id: string;
  amount: number;
  currency: string;
  payment_method_id?: string;
  transaction_type: string;
  status: string;
  external_transaction_id?: string;
  metadata?: any;
  error_message?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useWallet = () => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load or create wallet balance
      let { data: walletData, error: walletError } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) throw walletError;

      // Create wallet if doesn't exist
      if (!walletData) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallet_balances')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        walletData = newWallet;
      }

      setBalance(walletData);

      // Load transactions
      const { data: txData, error: txError } = await supabase
        .from('financial_transactions')
        .select('*')
        .or(`payer_user_id.eq.${user.id},payee_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (txError) throw txError;
      setTransactions(txData || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async (amount: number, paymentMethodId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!balance || balance.available_balance < amount) {
        throw new Error('Insufficient balance');
      }

      const { data, error } = await supabase
        .from('payout_requests')
        .insert([{
          user_id: user.id,
          amount,
          currency: balance.currency,
          payment_method_id: paymentMethodId,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payout request submitted'
      });

      await loadWalletData();
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  return {
    balance,
    transactions,
    loading,
    requestPayout,
    reload: loadWalletData
  };
};
