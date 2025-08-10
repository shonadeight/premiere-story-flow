import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  SortAsc,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Star,
  Target,
  Zap,
  Filter
} from 'lucide-react';
import { TimelineType } from '@/types/timeline';

interface SortOptionsProps {
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  onFilterChange: (filters: {
    type?: TimelineType;
    riskLevel?: 'low' | 'medium' | 'high';
    status?: string;
    customField?: string;
  }) => void;
  currentSort?: string;
  currentFilters?: any;
}

export const SortOptions: React.FC<SortOptionsProps> = ({
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilters = {}
}) => {
  const sortOptions = [
    {
      id: 'performance',
      label: 'Top Performance',
      icon: TrendingUp,
      field: 'changePercent',
      order: 'desc' as const
    },
    {
      id: 'value',
      label: 'Highest Value',
      icon: DollarSign,
      field: 'value',
      order: 'desc' as const
    },
    {
      id: 'rating',
      label: 'Best Rated',
      icon: Star,
      field: 'rating',
      order: 'desc' as const
    },
    {
      id: 'recent',
      label: 'Most Recent',
      icon: Calendar,
      field: 'createdAt',
      order: 'desc' as const
    },
    {
      id: 'oldest',
      label: 'Oldest First',
      icon: Calendar,
      field: 'createdAt',
      order: 'asc' as const
    },
    {
      id: 'members',
      label: 'Most Members',
      icon: Target,
      field: 'investedMembers',
      order: 'desc' as const
    },
    {
      id: 'views',
      label: 'Most Viewed',
      icon: BarChart3,
      field: 'views',
      order: 'desc' as const
    }
  ];

  const timelineTypes = [
    { value: 'project', label: 'Project Timeline', emoji: '🚀' },
    { value: 'profile', label: 'Profile Timeline', emoji: '👤' },
    { value: 'financial', label: 'Financial Contribution', emoji: '💰' },
    { value: 'followup', label: 'Follow-up Timeline', emoji: '💬' },
    { value: 'intellectual', label: 'Intellectual Contribution', emoji: '🧠' },
    { value: 'network', label: 'Network & Marketing', emoji: '🌐' },
    { value: 'assets', label: 'Assets Contribution', emoji: '📦' }
  ];

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Risk', color: 'text-yellow-600' },
    { value: 'high', label: 'High Risk', color: 'text-red-600' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'seeking-investment', label: 'Seeking Investment', color: 'bg-blue-500' },
    { value: 'completed', label: 'Completed', color: 'bg-purple-500' },
    { value: 'paused', label: 'Paused', color: 'bg-orange-500' }
  ];

  return (
    <div className="flex gap-2">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
            {currentSort && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {sortOptions.find(opt => opt.id === currentSort)?.label}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => onSortChange(option.field, option.order)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {option.label}
                {currentSort === option.id && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {Object.keys(currentFilters).length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {Object.keys(currentFilters).length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {timelineTypes.map((type) => (
            <DropdownMenuItem
              key={type.value}
              onClick={() => onFilterChange({ 
                ...currentFilters, 
                type: currentFilters.type === type.value ? undefined : type.value as TimelineType 
              })}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{type.emoji}</span>
              {type.label}
              {currentFilters.type === type.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Risk Level</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {riskLevels.map((risk) => (
            <DropdownMenuItem
              key={risk.value}
              onClick={() => onFilterChange({ 
                ...currentFilters, 
                riskLevel: currentFilters.riskLevel === risk.value ? undefined : risk.value as any
              })}
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${risk.color.replace('text-', 'bg-')}`} />
              {risk.label}
              {currentFilters.riskLevel === risk.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((status) => (
            <DropdownMenuItem
              key={status.value}
              onClick={() => onFilterChange({ 
                ...currentFilters, 
                status: currentFilters.status === status.value ? undefined : status.value
              })}
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              {status.label}
              {currentFilters.status === status.value && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          
          {Object.keys(currentFilters).length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onFilterChange({})}
                className="text-red-600 flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Clear All Filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};