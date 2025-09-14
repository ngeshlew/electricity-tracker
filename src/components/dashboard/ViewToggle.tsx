import React from 'react';
import { DollarSign, Bolt } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(v) => v && onViewModeChange(v as 'kwh' | 'cost')}
      className={className}
    >
      <ToggleGroupItem value="kwh" className="flex items-center space-x-2">
        <Bolt className="h-4 w-4" />
        <span>kWh</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="cost" className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4" />
        <span>Cost</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
