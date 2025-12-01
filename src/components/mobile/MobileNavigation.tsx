import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from "@/components/ui/icon";
import { HelpPopover } from '@/components/ui/help-popover';
import { useLocation } from 'react-router-dom';
import { useElectricityStore } from '../../store/useElectricityStore';

interface MobileNavItem {
  name: string;
  href: string;
  iconName: string;
  current: boolean;
  badge?: string;
}

const navigationItems: MobileNavItem[] = [
  { name: 'Dashboard', href: '/', iconName: 'home-house', current: true },
  { name: 'Insights', href: '/insights', iconName: 'activity-graph', current: false },
  { name: 'Tariff', href: '/tariff', iconName: 'dollar-currency', current: false },
  { name: 'Settings', href: '/settings', iconName: 'adjust-settings-horizontal', current: false },
];

export const MobileNavigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { toggleMeterPanel } = useElectricityStore();

  // Check if we're on Dashboard page
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  // Update current page based on location
  const updatedNavigationItems = navigationItems.map(item => ({
    ...item,
    current: location.pathname === item.href || 
             (item.href === '/' && location.pathname === '/dashboard')
  }));

  // Handle scroll to add shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className={`
        fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b
        transition-shadow duration-200
        ${isScrolled ? 'shadow-sm' : 'shadow-none'}
        lg:hidden
      `}>
        <div className="flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="bolt" className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-normal">Tracker</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Help - always available */}
            <HelpPopover>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Help and user guide"
                title="Help"
              >
                <Icon name="help-question-mark" className="h-5 w-5" />
              </Button>
            </HelpPopover>

            {/* Add Reading Button - Only on Dashboard */}
            {isDashboard && (
              <Button
                onClick={() => toggleMeterPanel(true)}
                size="sm"
                className="h-9 px-3 flex items-center gap-1"
                aria-label="Add meter reading"
              >
                <Icon name="add-new-plus" className="h-4 w-4" />
                <span className="hidden xs:inline">Add</span>
                <span className="button__shortcut hidden xs:inline" aria-label="Keyboard shortcut: A">
                  A
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {updatedNavigationItems.map((item) => {
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center space-y-1 px-2 py-2 text-xs font-normal
                  transition-colors touch-manipulation
                  ${item.current
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon
                  name={item.iconName as any}
                  className={`
                    h-5 w-5
                    ${item.current ? 'text-primary' : 'text-muted-foreground'}
                  `}
                />
                <span className="truncate">{item.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};
