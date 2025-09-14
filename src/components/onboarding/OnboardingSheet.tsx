import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MeterReadingForm } from '@/components/meter-reading/MeterReadingForm';
import { useElectricityStore } from '../../store/useElectricityStore';

export const OnboardingSheet: React.FC = () => {
  const { readings } = useElectricityStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasFirst = readings.some(r => r.isFirstReading);
    if (!hasFirst) setOpen(true);
  }, [readings]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="lewis-card lewis-shadow-glow">
        <SheetHeader>
          <SheetTitle className="text-xl lewis-text-gradient">Welcome! Add your move-in reading</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <MeterReadingForm
            forceFirstReading
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

