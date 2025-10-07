import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: 'mpesa' | 'card' | 'bank_transfer';
  provider: string;
  account_details: any;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setPaymentMethods((data || []) as PaymentMethod[]);
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

  const addPaymentMethod = async (methodData: {
    method_type: 'mpesa' | 'card' | 'bank_transfer';
    provider: string;
    account_details: any;
    is_primary?: boolean;
  }): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // If setting as primary, unset other primary methods
      if (methodData.is_primary) {
        await supabase
          .from('payment_methods')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .insert([{
          user_id: user.id,
          ...methodData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment method added successfully'
      });

      await loadPaymentMethods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const setPrimaryMethod = async (methodId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Unset all primary methods
      await supabase
        .from('payment_methods')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Set new primary
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_primary: true })
        .eq('id', methodId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Primary payment method updated'
      });

      await loadPaymentMethods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const deletePaymentMethod = async (methodId: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false })
        .eq('id', methodId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment method removed'
      });

      await loadPaymentMethods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    setPrimaryMethod,
    deletePaymentMethod,
    reload: loadPaymentMethods
  };
};
