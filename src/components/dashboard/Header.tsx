import { FC, useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../../store/useAuthStore';
import { Icon } from "@/components/ui/icon";
import { useElectricityStore } from '../../store/useElectricityStore';
import { KeyboardShortcutsPopover } from '@/components/ui/keyboard-shortcuts-dialog';
import { HelpPopover } from '@/components/ui/help-popover';

export const Header: FC = () => {
  const { toggleMeterPanel, chartData } = useElectricityStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Calculate average comparison message
  const averageMessage = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const totalConsumption = chartData.reduce((sum, point) => sum + point.kwh, 0);
    const days = chartData.length > 0 ? chartData.length : 1;
    const userAverageDaily = totalConsumption / days;
    const ukAverageDaily = 8.5; // UK average
    const comparisonToAverage = ((userAverageDaily - ukAverageDaily) / ukAverageDaily) * 100;
    
    if (Math.abs(comparisonToAverage) <= 1) return null;
    
    return comparisonToAverage < 0 
      ? `YOU'RE USING ${Math.abs(comparisonToAverage).toFixed(0)}% LESS THAN AVERAGE`
      : `YOU'RE USING ${comparisonToAverage.toFixed(0)}% MORE THAN AVERAGE`;
  }, [chartData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // 'A' key to open Add Reading panel
      if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleMeterPanel(true);
      }
      
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMeterPanel]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Sidebar Trigger */}
          <div className="flex items-center flex-shrink-0">
            <SidebarTrigger />
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-end">
            {/* Average Comparison Message */}
            {averageMessage && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-dotted border-border rounded-full">
                <Icon 
                  name={averageMessage.includes('LESS') ? "arrow-down" : "arrow-up"} 
                  className="h-4 w-4 text-muted-foreground" 
                />
                <span className="text-xs uppercase tracking-normal text-muted-foreground font-mono">
                  {averageMessage}
                </span>
              </div>
            )}
            
            {/* Help Button */}
            <HelpPopover>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 sm:h-12 px-3 flex-shrink-0"
                aria-label="Help and user guide"
                title="Help"
              >
                <Icon name="help-question-mark" className="h-4 w-4" />
              </Button>
            </HelpPopover>
            
            {/* Keyboard Shortcuts Button */}
            <KeyboardShortcutsPopover>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 sm:h-12 px-3 flex-shrink-0"
                aria-label="Keyboard shortcuts"
                title="Keyboard Shortcuts"
              >
                <Icon name="info" className="h-4 w-4" />
              </Button>
            </KeyboardShortcutsPopover>
            
            {/* Primary Action: Add Reading - Responsive sizing */}
            <Button 
              onClick={() => toggleMeterPanel(true)} 
              size="lg"
              className="flex items-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-base font-normal min-w-[100px] sm:min-w-[160px] flex-shrink-0"
            >
              <Icon name="add-new-plus" className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Reading</span>
              <span className="sm:hidden">Add</span>
            </Button>
            
            {/* Notifications */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}
            
            {/* Authentication */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-3 sm:px-4 flex-shrink-0"
              >
                <Icon name="enter-log-in-arrow" className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
      
    </header>
  );
};
