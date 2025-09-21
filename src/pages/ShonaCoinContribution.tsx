// Temporary backup - simple working version
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ShonaCoinContribution() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Contribution Flow</h1>
        <p className="text-muted-foreground mb-6">
          Feature temporarily simplified to fix syntax error
        </p>
        <Button onClick={() => navigate('/portfolio')}>
          Return to Portfolio
        </Button>
      </div>
    </div>
  );
}

export default ShonaCoinContribution;