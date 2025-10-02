import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ContributionCategory, ContributionStatus, ContributionDirection } from '@/types/contribution';
import { Card } from '@/components/ui/card';

interface ContributionFiltersProps {
  selectedCategory: ContributionCategory | 'all';
  selectedStatus: ContributionStatus | 'all';
  selectedDirection: ContributionDirection | 'all';
  searchQuery: string;
  sortBy: 'date' | 'valuation' | 'status';
  onCategoryChange: (category: ContributionCategory | 'all') => void;
  onStatusChange: (status: ContributionStatus | 'all') => void;
  onDirectionChange: (direction: ContributionDirection | 'all') => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'date' | 'valuation' | 'status') => void;
}

export const ContributionFilters = ({
  selectedCategory,
  selectedStatus,
  selectedDirection,
  searchQuery,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onDirectionChange,
  onSearchChange,
  onSortChange,
}: ContributionFiltersProps) => {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contributions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={(v) => onCategoryChange(v as ContributionCategory | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="intellectual">Intellectual</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="assets">Assets</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={(v) => onStatusChange(v as ContributionStatus | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="setup_incomplete">Setup Incomplete</SelectItem>
            <SelectItem value="ready_to_receive">Ready to Receive</SelectItem>
            <SelectItem value="ready_to_give">Ready to Give</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Direction Filter */}
        <Select value={selectedDirection} onValueChange={(v) => onDirectionChange(v as ContributionDirection | 'all')}>
          <SelectTrigger>
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="to_give">To Give</SelectItem>
            <SelectItem value="to_receive">To Receive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort (mobile-friendly) */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as 'date' | 'valuation' | 'status')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Created</SelectItem>
            <SelectItem value="valuation">Valuation</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
