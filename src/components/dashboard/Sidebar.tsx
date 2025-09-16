import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar-trigger';
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
  collapsible?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
  { name: 'Statements', href: '/statements', icon: DocumentTextIcon, current: false },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ className, collapsible = false, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  return (
    <div className={cn(
      "hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300",
      isCollapsed ? "md:w-16" : "md:w-64",
      "bg-sidebar border-r border-sidebar-border",
      className
    )}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary">
          <BoltIcon className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="ml-3 text-lg text-sidebar-foreground">
            Electricity Tracker
          </span>
        )}
        {collapsible && (
          <SidebarTrigger
            isCollapsed={isCollapsed}
            onToggle={toggleCollapse}
            className="ml-auto"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.name}
            variant={item.current ? "default" : "ghost"}
            className={cn(
              "w-full text-left transition-all duration-200",
              isCollapsed ? "justify-center px-2" : "justify-start",
              item.current 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && item.name}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex shrink-0 border-t border-sidebar-border p-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "")}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs text-sidebar-accent-foreground">U</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm text-sidebar-foreground">User</p>
              <p className="text-xs text-sidebar-muted-foreground">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
