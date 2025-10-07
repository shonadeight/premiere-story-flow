-- Phase 5: Payment Processing Database Schema

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('mpesa', 'card', 'bank_transfer')),
  provider TEXT, -- 'mpesa', 'stripe', 'paypal', 'kcb', 'equity', 'ncba'
  account_details JSONB NOT NULL, -- Encrypted account info
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(method_type);

-- Financial Transactions Table
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID REFERENCES contributions(id) ON DELETE SET NULL,
  payer_user_id UUID NOT NULL,
  payee_user_id UUID NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'escrow_hold', 'escrow_release', 'payout', 'subscription')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  external_transaction_id TEXT, -- From payment provider
  metadata JSONB, -- Additional transaction data
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_contribution ON financial_transactions(contribution_id);
CREATE INDEX idx_transactions_payer ON financial_transactions(payer_user_id);
CREATE INDEX idx_transactions_payee ON financial_transactions(payee_user_id);
CREATE INDEX idx_transactions_status ON financial_transactions(status);
CREATE INDEX idx_transactions_type ON financial_transactions(transaction_type);

-- Escrow Holds Table
CREATE TABLE IF NOT EXISTS escrow_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES financial_transactions(id) ON DELETE CASCADE,
  contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  holder_user_id UUID NOT NULL,
  beneficiary_user_id UUID NOT NULL,
  release_condition JSONB, -- Conditions for release
  status TEXT NOT NULL CHECK (status IN ('held', 'released', 'refunded', 'cancelled')),
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_escrow_contribution ON escrow_holds(contribution_id);
CREATE INDEX idx_escrow_status ON escrow_holds(status);

-- Wallet Balances Table
CREATE TABLE IF NOT EXISTS wallet_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  available_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  escrowed_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_wallet_user ON wallet_balances(user_id);

-- Payout Requests Table
CREATE TABLE IF NOT EXISTS payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  external_transaction_id TEXT,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payout_user ON payout_requests(user_id);
CREATE INDEX idx_payout_status ON payout_requests(status);

-- RLS Policies

-- Payment Methods
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods"
ON payment_methods FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
ON payment_methods FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
ON payment_methods FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
ON payment_methods FOR DELETE
USING (auth.uid() = user_id);

-- Financial Transactions
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON financial_transactions FOR SELECT
USING (auth.uid() = payer_user_id OR auth.uid() = payee_user_id);

CREATE POLICY "Users can create transactions"
ON financial_transactions FOR INSERT
WITH CHECK (auth.uid() = payer_user_id);

CREATE POLICY "System can update transactions"
ON financial_transactions FOR UPDATE
USING (auth.uid() = payer_user_id OR auth.uid() = payee_user_id);

-- Escrow Holds
ALTER TABLE escrow_holds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own escrows"
ON escrow_holds FOR SELECT
USING (auth.uid() = holder_user_id OR auth.uid() = beneficiary_user_id);

CREATE POLICY "Users can create escrows"
ON escrow_holds FOR INSERT
WITH CHECK (auth.uid() = holder_user_id);

CREATE POLICY "Users can update escrows"
ON escrow_holds FOR UPDATE
USING (auth.uid() = holder_user_id OR auth.uid() = beneficiary_user_id);

-- Wallet Balances
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
ON wallet_balances FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallet"
ON wallet_balances FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
ON wallet_balances FOR UPDATE
USING (auth.uid() = user_id);

-- Payout Requests
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payouts"
ON payout_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create payout requests"
ON payout_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payouts"
ON payout_requests FOR UPDATE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at
BEFORE UPDATE ON payment_methods
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON financial_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escrow_holds_updated_at
BEFORE UPDATE ON escrow_holds
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_balances_updated_at
BEFORE UPDATE ON wallet_balances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payout_requests_updated_at
BEFORE UPDATE ON payout_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();