import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useMeterReading } from '../../hooks/useMeterReadingContext';

export const Header: React.FC = () => {
  const { togglePanel } = useMeterReading();

  return (
    <header className="bg-dark-800 border-b border-dark-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h1 className="text-xl font-bold text-dark-50">
              Electricity Tracker
            </h1>
          </div>
          
          <button
            onClick={() => togglePanel(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>
    </header>
  );
};
