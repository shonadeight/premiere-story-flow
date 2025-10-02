import { Badge } from '@/components/ui/badge';
import { ContributionStatus } from '@/types/contribution';
import { 
  FileText, 
  Settings, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Activity, 
  CheckCheck, 
  XCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContributionStatusBadgeProps {
  status: ContributionStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  ContributionStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any; colorClass: string }
> = {
  draft: {
    label: 'Draft',
    variant: 'outline',
    icon: FileText,
    colorClass: 'border-muted-foreground/50 text-muted-foreground',
  },
  setup_incomplete: {
    label: 'Setup Incomplete',
    variant: 'secondary',
    icon: Settings,
    colorClass: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  },
  ready_to_receive: {
    label: 'Ready to Receive',
    variant: 'default',
    icon: CheckCircle2,
    colorClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  ready_to_give: {
    label: 'Ready to Give',
    variant: 'default',
    icon: Send,
    colorClass: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  },
  negotiating: {
    label: 'Negotiating',
    variant: 'secondary',
    icon: MessageSquare,
    colorClass: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  },
  active: {
    label: 'Active',
    variant: 'default',
    icon: Activity,
    colorClass: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  },
  completed: {
    label: 'Completed',
    variant: 'secondary',
    icon: CheckCheck,
    colorClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'destructive',
    icon: XCircle,
    colorClass: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  },
};

export const ContributionStatusBadge = ({
  status,
  className,
  showIcon = true,
}: ContributionStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'flex items-center gap-1.5 font-medium border',
        config.colorClass,
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
