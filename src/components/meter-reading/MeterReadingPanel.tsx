import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button-simple';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
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

export const MeterReadingPanel: React.FC<MeterReadingPanelProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { toggleMeterPanel } = useElectricityStore();
  
  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    // Modal Overlay - Full screen backdrop with blur effect
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 lewis-animation-fade-in">
      {/* Modal Card - Centered with responsive positioning */}
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto lewis-card lewis-shadow-glow lewis-animation-slide-up">
        {/* Modal Header - Contains title and close button */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {/* Modal Title with gradient text */}
          <CardTitle className="text-xl font-semibold lewis-text-gradient">
            Add Meter Reading
          </CardTitle>
          {/* Close Button - Top right corner with X icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClose();
              toggleMeterPanel(false);
            }}
            className="h-10 w-10 lewis-card-hover"
            title="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </CardHeader>
        {/* Modal Content - Contains the meter reading form */}
        <CardContent>
          <MeterReadingForm onSuccess={onClose} />
        </CardContent>
      </Card>
    </div>
  );
};