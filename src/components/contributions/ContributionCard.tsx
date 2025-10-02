import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContributionStatusBadge } from './ContributionStatusBadge';
import { ContributionCategory, ContributionStatus } from '@/types/contribution';
import { 
  DollarSign, 
  Brain, 
  TrendingUp, 
  Package, 
  Calendar,
  Eye,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContributionCardProps {
  contribution: {
    id: string;
    title: string | null;
    description: string | null;
    category: ContributionCategory;
    status: ContributionStatus;
    is_timeline: boolean;
    created_at: string;
    updated_at: string;
  };
}

const categoryIcons = {
  financial: DollarSign,
  intellectual: Brain,
  marketing: TrendingUp,
  assets: Package,
};

const categoryColors = {
  financial: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  intellectual: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  marketing: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  assets: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
};

export const ContributionCard = ({ contribution }: ContributionCardProps) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[contribution.category];

  const handleView = () => {
    navigate(`/contributions/${contribution.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${categoryColors[contribution.category]} border`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base line-clamp-1">
                {contribution.title || 'Untitled Contribution'}
              </CardTitle>
              <p className="text-xs text-muted-foreground capitalize">
                {contribution.category}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {contribution.description || 'No description provided'}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <ContributionStatusBadge status={contribution.status} />
          {contribution.is_timeline && (
            <Badge variant="outline" className="text-xs">
              Timeline
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleView}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
