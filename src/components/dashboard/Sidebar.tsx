import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Statements', href: '/statements', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn(
      "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0",
      "bg-sidebar border-r border-sidebar-border",
      className
    )}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary">
          <BoltIcon className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="ml-3 text-lg text-sidebar-foreground">
          Electricity Tracker
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left",
              item.current 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex shrink-0 border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs text-sidebar-accent-foreground">U</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-sidebar-foreground">User</p>
            <p className="text-xs text-sidebar-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
