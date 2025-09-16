import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from "@/components/mode-toggle";
import { Zap, Plus } from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';

export const Header: FC = () => {
  const { toggleMeterPanel } = useElectricityStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center  bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg">
                Electricity Tracker
              </span>
            </a>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button 
              onClick={() => toggleMeterPanel(true)} 
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Reading</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
