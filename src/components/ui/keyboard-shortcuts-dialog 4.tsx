import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icon } from '@/components/ui/icon';

interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
}

const shortcuts: KeyboardShortcut[] = [
  { key: 'A', description: 'Add Reading', category: 'Actions' },
  { key: '/', description: 'Focus Search', category: 'Navigation' },
  { key: 'Esc', description: 'Close Modal/Panel', category: 'Navigation' },
  { key: '?', description: 'Show Keyboard Shortcuts', category: 'Help' },
];

interface KeyboardShortcutsPopoverProps {
  children: React.ReactNode;
}

export const KeyboardShortcutsPopover: React.FC<KeyboardShortcutsPopoverProps> = ({
  children,
}) => {
  const [open, setOpen] = React.useState(false);
  
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="bg-background border border-dotted border-border rounded-lg p-6 w-80 shadow-none"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-dotted border-border">
            <h3 className="text-lg font-normal uppercase tracking-wide">
              Keyboard Shortcuts
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="h-6 w-6 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <Icon name="x-close-delete" className="h-4 w-4" />
            </button>
          </div>
          
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 border-b border-dotted border-border last:border-0"
                  >
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded-full text-xs font-mono uppercase tracking-wide">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

