import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Building, Star, Trash2 } from 'lucide-react';
import type { PaymentMethod } from '@/hooks/usePaymentMethods';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PaymentMethodCard = ({ method, onSetPrimary, onDelete }: PaymentMethodCardProps) => {
  const getIcon = () => {
    switch (method.method_type) {
      case 'mpesa':
        return <Smartphone className="h-5 w-5" />;
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getDisplayName = () => {
    switch (method.method_type) {
      case 'mpesa':
        return `M-Pesa ${method.account_details?.phone || ''}`;
      case 'card':
        return `${method.provider} •••• ${method.account_details?.last4 || ''}`;
      case 'bank_transfer':
        return `${method.provider} - ${method.account_details?.account_number || ''}`;
      default:
        return method.provider;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-sm font-medium">
            {getDisplayName()}
          </CardTitle>
        </div>
        {method.is_primary && (
          <Badge variant="default" className="gap-1">
            <Star className="h-3 w-3" />
            Primary
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {!method.is_primary && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetPrimary(method.id)}
            >
              Set as Primary
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(method.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
