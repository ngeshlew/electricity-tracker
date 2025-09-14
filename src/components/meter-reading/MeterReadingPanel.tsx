import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { MeterReadingForm } from './MeterReadingForm';
import { useElectricityStore } from '../../store/useElectricityStore';

/**
 * MeterReadingPanel Component
 * 
 * A modal overlay component that displays the meter reading form.
 * Features:
 * - Modal overlay with backdrop blur
 * - Close button in top-right corner
 * - Responsive design (mobile-first)
 * - Smooth animations using Lewis-Linear design system
 * 
 * Uses Shadcn UI: Button, Card, CardContent, CardHeader, CardTitle components
 * Uses Heroicons: XMarkIcon for close button
 * Custom styling: Lewis-Linear design system
 */

interface MeterReadingPanelProps {
  isOpen: boolean;    // Controls modal visibility
  onClose: () => void; // Callback to close the modal
}

export const MeterReadingPanel: React.FC<MeterReadingPanelProps> = ({ isOpen, onClose }) => {
  const { toggleMeterPanel } = useElectricityStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      toggleMeterPanel(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="lewis-card lewis-shadow-glow">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold lewis-text-gradient">Add Meter Reading</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Close meter reading panel">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="mt-4">
          <MeterReadingForm onSuccess={() => handleOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};