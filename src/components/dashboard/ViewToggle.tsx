import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/ui/icon";

interface ViewToggleProps {
  viewMode: 'litres' | 'cost';
  onViewModeChange: (mode: 'litres' | 'cost') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ 
  viewMode, 
  onViewModeChange, 
  className = '' 
}) => {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'litres' | 'cost')} className={className}>
      <ToggleGroupItem value="litres" aria-label="Toggle litres view">
        <Icon name="lightning-energy" className="h-4 w-4 mr-2" />
        Litres
      </ToggleGroupItem>
      <ToggleGroupItem value="cost" aria-label="Toggle cost view">
        <Icon name="dollar-currency" className="h-4 w-4 mr-2" />
        Cost
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
