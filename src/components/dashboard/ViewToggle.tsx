import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign, Bolt } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'kwh' | 'cost';
  onViewModeChange: (mode: 'kwh' | 'cost') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ 
  viewMode, 
  onViewModeChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-1 bg-muted/20 rounded-lg p-1 ${className}`}>
      <Button
        variant={viewMode === 'kwh' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('kwh')}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          viewMode === 'kwh' 
            ? 'lewis-button-primary shadow-md' 
            : 'lewis-card-hover text-muted-foreground hover:text-foreground'
        }`}
      >
        <Bolt className="h-4 w-4" />
        <span>kWh</span>
      </Button>
      
      <Button
        variant={viewMode === 'cost' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cost')}
        className={`flex items-center space-x-2 transition-all duration-200 ${
          viewMode === 'cost' 
            ? 'lewis-button-primary shadow-md' 
            : 'lewis-card-hover text-muted-foreground hover:text-foreground'
        }`}
      >
        <DollarSign className="h-4 w-4" />
        <span>Cost</span>
      </Button>
    </div>
  );
};
