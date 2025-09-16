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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Meter Reading</SheetTitle>
          <SheetDescription>
            Enter your electricity meter reading to track consumption.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <MeterReadingForm onSuccess={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
};