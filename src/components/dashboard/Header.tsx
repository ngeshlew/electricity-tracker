import { FC } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useElectricityStore } from '../../store/useElectricityStore';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const Header: FC = () => {
  const { toggleMeterPanel } = useElectricityStore();

  return (
    <header className="bg-card border-b border-border lewis-shadow-glow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 lewis-animation-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center lewis-shadow-glow">
              <span className="text-primary-foreground font-bold text-lg lewis-animation-pulse">⚡</span>
            </div>
            <h1 className="text-2xl font-bold lewis-text-gradient">
              Electricity Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="hidden md:inline-flex">⌘K</Button>
              </DialogTrigger>
              <DialogContent className="p-0 overflow-hidden max-w-lg">
                <Command>
                  <CommandInput placeholder="Search actions..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Actions">
                      <CommandItem onSelect={() => toggleMeterPanel(true)}>Add Reading</CommandItem>
                      <CommandItem onSelect={() => location.assign('/dashboard')}>Go to Overview</CommandItem>
                      <CommandItem onSelect={() => location.assign('/dashboard#analytics')}>Go to Analytics</CommandItem>
                      <CommandItem onSelect={() => location.assign('/dashboard#statements')}>Go to Statements</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => toggleMeterPanel(true)} 
              className="lewis-button-primary flex items-center space-x-2 lewis-animation-slide-up"
            >
              <Plus className="w-5 h-5" />
              <span>Add Reading</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};