import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  BoltIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useElectricityStore } from '../../store/useElectricityStore';

interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
  badge?: string;
}

const navigationItems: MobileNavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Insights', href: '/insights', icon: BoltIcon, current: false },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Statements', href: '/statements', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
              <BoltIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Electricity Tracker</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add Reading Button - Only on Dashboard */}
            {isDashboard && (
              <Button
                onClick={() => toggleMeterPanel(true)}
                size="sm"
                className="h-9 px-3"
                aria-label="Add meter reading"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Add</span>
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  aria-label="Open mobile menu"
                >
                  <Bars3Icon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex h-full flex-col">
                {/* Mobile Menu Header */}
                <div className="flex h-14 items-center justify-between border-b px-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <BoltIcon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold">Menu</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-1 p-4">
                  {updatedNavigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`
                          group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-colors
                          ${item.current
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }
                        `}
                      >
                        <IconComponent
                          className={`
                            mr-3 h-5 w-5 flex-shrink-0
                            ${item.current ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                          `}
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    );
                  })}
                </nav>

                {/* Mobile Menu Footer */}
                <div className="border-t p-4">
                  <div className="text-xs text-muted-foreground">
                    Electricity Tracker v1.0
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Alternative) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {updatedNavigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center space-y-1 px-2 py-2 text-xs font-medium
                  transition-colors touch-manipulation
                  ${item.current
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <IconComponent
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
