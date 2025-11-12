import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, LogIn } from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';

export const Header: FC = () => {
  const { toggleMeterPanel } = useElectricityStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Keyboard shortcut: 'A' to open Add Reading panel
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Sidebar Trigger */}
          <div className="flex items-center flex-shrink-0">
            <SidebarTrigger />
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-end">
            {/* Primary Action: Add Reading - Responsive sizing */}
            <Button 
              onClick={() => toggleMeterPanel(true)} 
              size="lg"
              className="flex items-center gap-1.5 sm:gap-2 h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-base font-semibold min-w-[100px] sm:min-w-[160px] flex-shrink-0"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Reading</span>
              <span className="sm:hidden">Add</span>
              <span className="button__shortcut hidden sm:inline" aria-label="Keyboard shortcut: A">
                A
              </span>
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
                <LogIn className="h-4 w-4" />
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
