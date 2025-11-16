import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icon } from '@/components/ui/icon';

interface HelpPopoverProps {
  children: React.ReactNode;
}

export const HelpPopover: React.FC<HelpPopoverProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="bg-background border border-dotted border-border rounded-lg p-6 w-[560px] max-w-[95vw] shadow-none"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-dotted border-border">
            <h3 className="text-lg font-normal uppercase tracking-wide">
              Help & User Guide
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <Icon name="x-close-delete" className="h-4 w-4" />
            </button>
          </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
              Getting Started
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Add your first reading via “Add Reading”.</li>
              <li>• Explore Analytics to view trends and costs.</li>
              <li>• Upload statements for automatic parsing.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
              Adding Readings
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Enter meter value, date, and optional notes.</li>
              <li>• Take readings at consistent times monthly.</li>
              <li>• Charts update immediately after saving.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
              Analytics Overview
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Monthly overview shows totals and averages.</li>
              <li>• Switch between kWh and Cost views.</li>
              <li>• Identify peak usage in weekly/daily charts.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
              Tips & Shortcuts
            </h4>
            <ul className="text-sm space-y-1">
              <li>• Press “A” to open Add Reading.</li>
              <li>• Use the keyboard button to view all shortcuts.</li>
              <li>• Set tariff info for accurate cost tracking.</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-dotted border-border flex gap-2">
            <button
              type="button"
              className="px-3 py-2 border border-dotted rounded-full text-sm hover:opacity-70"
            >
              Full Documentation
            </button>
            <button
              type="button"
              className="px-3 py-2 border border-dotted rounded-full text-sm hover:opacity-70"
            >
              Contact Support
            </button>
          </div>
        </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


