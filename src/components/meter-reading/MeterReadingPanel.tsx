import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MeterReadingForm } from './MeterReadingForm';
import { useElectricityStore } from '../../store/useElectricityStore';

interface MeterReadingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeterReadingPanel: React.FC<MeterReadingPanelProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { toggleMeterPanel } = useElectricityStore();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        toggleMeterPanel(false);
      }
    }}>
      <SheetContent side="right" className="w-full sm:max-w-sm flex flex-col p-0">
        <SheetHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <SheetTitle>Add Meter Reading</SheetTitle>
          <SheetDescription>
            Enter your electricity meter reading to track consumption.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <MeterReadingForm onSuccess={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
};