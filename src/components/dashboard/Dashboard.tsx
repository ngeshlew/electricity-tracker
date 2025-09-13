import React from 'react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { useMeterReading } from '../../hooks/useMeterReadingContext';

export const Dashboard: React.FC = () => {
  const { isPanelOpen, togglePanel } = useMeterReading();

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">
            Electricity Tracker
          </h1>
          <p className="text-dark-400">
            Monitor your electricity consumption and costs in real-time
          </p>
        </div>

        <SummaryCards />
        
        <div className="mt-8">
          <ConsumptionChart />
        </div>
      </main>

      <MeterReadingPanel 
        isOpen={isPanelOpen} 
        onClose={() => togglePanel(false)} 
      />
    </div>
  );
};
