import React from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from "@/components/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Consolidated navigation: Insights and Analytics merged into Analytics
const navigationItems = [
  { name: 'Dashboard', url: '/', iconName: 'home-house' },
  { name: 'Analytics', url: '/analytics', iconName: 'bar-chart' },
  { name: 'Statements', url: '/statements', iconName: 'book-note-paper' },
  { name: 'Notifications', url: '/notifications', iconName: 'notification-bell-alarm' },
  { name: 'Settings', url: '/settings', iconName: 'adjust-settings-horizontal' },
];

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-12 shrink-0 items-center px-6">
          <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary">
            <Icon name="bolt" className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="ml-3 text-sm font-normal uppercase tracking-wide text-sidebar-foreground flex items-center gap-2">
            Tracker
            <Icon name="lightning-energy" className="h-4 w-4 text-sidebar-foreground" />
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url === '/analytics' && location.pathname === '/insights');
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} className="relative">
                      <a href={item.url}>
                        {isActive && (
                          <span 
                            className="absolute left-[-12px] text-lg"
                            style={{ color: 'var(--color-accent-red)' }}
                            aria-hidden="true"
                          >
                            •
                          </span>
                        )}
                        <Icon name={item.iconName as any} className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <p className="text-xs uppercase tracking-tight text-sidebar-muted-foreground truncate">
            user@example.com
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
