import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button-simple';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
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
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 lewis-animation-fade-in">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto lewis-card lewis-shadow-glow lewis-animation-slide-up">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold lewis-text-gradient">
            Add Meter Reading
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClose();
              toggleMeterPanel(false);
            }}
            className="h-10 w-10 lewis-card-hover"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <MeterReadingForm onSuccess={onClose} />
        </CardContent>
      </Card>
    </div>
  );
};