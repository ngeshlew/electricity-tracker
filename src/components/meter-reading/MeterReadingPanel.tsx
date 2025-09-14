import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto lewis-card lewis-shadow-glow">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold lewis-text-gradient">Add Meter Reading</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 lewis-card-hover"
              title="Close modal"
              aria-label="Close meter reading panel"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <MeterReadingForm onSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};