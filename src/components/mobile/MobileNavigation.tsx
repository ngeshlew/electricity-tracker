import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Icon } from "@/components/ui/icon";
import { HelpPopover } from '@/components/ui/help-popover';
import { useLocation, useNavigate } from 'react-router-dom';
import { useElectricityStore } from '../../store/useElectricityStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

interface MobileNavItem {
  name: string;
  href: string;
  iconName: string;
  current: boolean;
  badge?: string;
}

const navigationItems: MobileNavItem[] = [
  { name: 'Dashboard', href: '/', iconName: 'home-house', current: true },
  { name: 'Analytics', href: '/analytics', iconName: 'bar-chart', current: false },
  { name: 'Statements', href: '/statements', iconName: 'book-note-paper', current: false },
  { name: 'Notifications', href: '/notifications', iconName: 'notification-bell-alarm', current: false },
  { name: 'Settings', href: '/settings', iconName: 'adjust-settings-horizontal', current: false },
];

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleMeterPanel } = useElectricityStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotificationStore();
  
  // Check if we're on Dashboard page
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };
  
  const recentNotifications = notifications.slice(0, 5);
  
  const notificationIcons: Record<string, string> = {
    info: 'notification-bell-alarm',
    warning: 'notification-bell-alarm',
    error: 'alert-error',
    success: 'check-good',
    consumption: 'lightning-energy',
    cost: 'dollar-currency',
    system: 'adjust-settings-horizontal',
    reminder: 'calendar-date-appointment',
    alert: 'alert-error'
  };

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
            
            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  aria-label="Open mobile menu"
                >
                  <Icon name="menu-hambuger" className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 flex flex-col">
              <div className="flex h-full flex-col">
                {/* User Profile Header */}
                {isAuthenticated && user ? (
                  <div className="px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-normal truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <Icon name="bolt" className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-normal">Electricity Tracker</p>
                        <p className="text-xs text-muted-foreground">Guest</p>
                      </div>
                    </div>
                  </div>
                )}

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {/* Notifications Section */}
                    {isAuthenticated && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-normal text-muted-foreground uppercase tracking-wider">Notifications</p>
                          {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {unreadCount} unread
                            </Badge>
                          )}
                        </div>
                        {recentNotifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <Icon name="notification-bell-alarm" className="h-6 w-6 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">No notifications</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {recentNotifications.map((notification) => {
                              const iconName = notificationIcons[notification.type] || notificationIcons[notification.category] || 'notification-bell-alarm';
                              return (
                                <div
                                  key={notification.id}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    notification.read 
                                      ? 'hover:bg-muted/50' 
                                      : 'bg-primary/5 hover:bg-primary/10'
                                  }`}
                                  onClick={() => {
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <div className="flex items-start gap-3">
                                    <Icon name={iconName as any} className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <h4 className={`text-sm font-normal ${
                                            notification.read ? 'text-muted-foreground' : 'text-foreground'
                                          }`}>
                                            {notification.title}
                                          </h4>
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {notification.message}
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notification.id);
                                          }}
                                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                          <Icon name="x-close-delete" className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/notifications');
                          }}
                        >
                          <Icon name="adjust-settings-horizontal" className="h-4 w-4 mr-2" />
                          View all notifications
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* User Menu Items */}
                    {isAuthenticated && (
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                          }}
                        >
                          <Icon name="account-user-person" className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                          }}
                        >
                          <Icon name="adjust-settings-horizontal" className="h-4 w-4 mr-2" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/notifications');
                          }}
                        >
                          <Icon name="notification-bell-alarm" className="h-4 w-4 mr-2" />
                          Notifications
                          {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/security');
                          }}
                        >
                          <Icon name="info" className="h-4 w-4 mr-2" />
                          Security
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/activity');
                          }}
                        >
                          <Icon name="calendar-date-appointment" className="h-4 w-4 mr-2" />
                          Activity
                        </Button>
                        <Separator />
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <Icon name="logout-exit" className="h-4 w-4 mr-2" />
                          Sign out
                        </Button>
                      </div>
                    )}

                    {!isAuthenticated && (
                      <div className="space-y-2">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/');
                          }}
                        >
                          <Icon name="enter-log-in-arrow" className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t p-4">
                  <div className="text-xs text-muted-foreground text-center">
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
