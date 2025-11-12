import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon,
  BoltIcon,
  BellIcon
} from '@heroicons/react/24/outline';
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
  { name: 'Dashboard', url: '/', icon: HomeIcon },
  { name: 'Analytics', url: '/analytics', icon: ChartBarIcon },
  { name: 'Statements', url: '/statements', icon: DocumentTextIcon },
  { name: 'Notifications', url: '/notifications', icon: BellIcon },
  { name: 'Settings', url: '/settings', icon: Cog6ToothIcon },
];

export const AppSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-12 shrink-0 items-center px-6">
          <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary">
            <BoltIcon className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="ml-3 text-sm font-normal uppercase tracking-wide text-sidebar-foreground">
            Tracker
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
                        <item.icon className="h-5 w-5" />
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
