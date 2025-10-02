import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ContributionsList } from '@/components/contributions/ContributionsList';
import { ContributionFilters } from '@/components/contributions/ContributionFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ContributionWizard } from '@/components/contributions/ContributionWizard';
import { ContributionCategory, ContributionStatus, ContributionDirection } from '@/types/contribution';

const Contributions = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ContributionCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ContributionStatus | 'all'>('all');
  const [selectedDirection, setSelectedDirection] = useState<ContributionDirection | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'valuation' | 'status'>('date');
  
  // Mock timeline ID - in real app, get from user's portfolio
  const timelineId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Contributions</h1>
            <p className="text-muted-foreground mt-1">
              Manage your contributions and collaborations
            </p>
          </div>
          <Button onClick={() => setWizardOpen(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Contribution
          </Button>
        </div>

        {/* Filters */}
        <ContributionFilters
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          selectedDirection={selectedDirection}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onDirectionChange={setSelectedDirection}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
        />

        {/* List */}
        <ContributionsList
          category={selectedCategory}
          status={selectedStatus}
          direction={selectedDirection}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
      </main>

      <BottomNav />
      
      <ContributionWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        timelineId={timelineId}
      />
    </div>
  );
};

export default Contributions;
