import { FC } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button-simple';
import { useElectricityStore } from '../../store/useElectricityStore';

export const Header: FC = () => {
  const { toggleMeterPanel } = useElectricityStore();

  return (
    <header className="bg-card border-b border-border lewis-shadow-glow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 lewis-animation-fade-in">
            <div className="w-10 h-10 lewis-gradient-primary rounded-lg flex items-center justify-center lewis-shadow-glow">
              <span className="text-primary-foreground font-bold text-lg lewis-animation-pulse">⚡</span>
            </div>
            <h1 className="text-2xl font-bold lewis-text-gradient">
              Electricity Tracker
            </h1>
          </div>
          
          <Button 
            onClick={() => toggleMeterPanel(true)} 
            className="lewis-button-primary flex items-center space-x-2 lewis-animation-slide-up"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Reading</span>
          </Button>
        </div>
      </div>
    </header>
  );
};