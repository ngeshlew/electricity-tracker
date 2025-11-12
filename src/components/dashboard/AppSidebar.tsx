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
          <span className="ml-3 text-sm font-semibold uppercase tracking-wide text-sidebar-foreground">
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
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url}>
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
        <div className="flex items-center p-4 cursor-pointer hover:bg-sidebar-accent/50 transition-colors rounded-md">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-sidebar-accent flex items-center justify-center rounded-full">
              <span className="text-xs font-medium text-sidebar-accent-foreground">U</span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">User</p>
            <p className="text-xs text-sidebar-muted-foreground truncate">user@example.com</p>
          </div>
          <svg className="h-4 w-4 text-sidebar-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
