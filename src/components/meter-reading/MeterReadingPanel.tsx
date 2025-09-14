import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <Card className="w-full lewis-card lewis-shadow-glow">
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
                  title="Close modal"
                  aria-label="Close meter reading panel"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <MeterReadingForm onSuccess={onClose} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};