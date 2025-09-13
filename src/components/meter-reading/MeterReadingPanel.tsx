import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MeterReadingForm } from './MeterReadingForm';

interface MeterReadingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeterReadingPanel: React.FC<MeterReadingPanelProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-dark-800 border-l border-dark-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <h2 className="text-xl font-bold text-dark-50">
              Add Meter Reading
            </h2>
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-dark-200 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 p-6">
            <MeterReadingForm onSuccess={onClose} />
          </div>
        </div>
      </div>
    </>
  );
};
