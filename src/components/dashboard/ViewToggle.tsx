import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DollarSign, Zap } from "lucide-react";

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
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewModeChange(value as 'kwh' | 'cost')} className={className}>
      <ToggleGroupItem value="kwh" aria-label="Toggle kWh view">
        <Zap className="h-4 w-4 mr-2" />
        kWh
      </ToggleGroupItem>
      <ToggleGroupItem value="cost" aria-label="Toggle cost view">
        <DollarSign className="h-4 w-4 mr-2" />
        Cost
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
