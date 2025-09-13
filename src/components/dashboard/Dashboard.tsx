import { FC } from 'react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { useElectricityStore } from '../../store/useElectricityStore';

export const Dashboard: FC = () => {
  const { isMeterPanelOpen, toggleMeterPanel } = useElectricityStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 lewis-animation-fade-in">
          <h1 className="text-4xl font-bold lewis-text-gradient mb-3">
            Electricity Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your electricity consumption and costs in real-time
          </p>
        </div>

        <div className="lewis-animation-fade-in">
          <SummaryCards />
        </div>
        
        <div className="mt-8 lewis-animation-fade-in">
          <ConsumptionChart />
        </div>
      </main>

      <MeterReadingPanel 
        isOpen={isMeterPanelOpen} 
        onClose={() => toggleMeterPanel(false)} 
      />
    </div>
  );
};