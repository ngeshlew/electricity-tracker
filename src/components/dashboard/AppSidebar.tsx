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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navigationItems = [
  { name: 'Dashboard', url: '/', icon: HomeIcon },
  { name: 'Insights', url: '/insights', icon: BoltIcon },
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
        <div className="flex h-16 shrink-0 items-center px-6">
          <div className="flex h-8 w-8 items-center justify-center bg-sidebar-primary">
            <BoltIcon className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="ml-3 text-lg text-sidebar-foreground">
            Electricity Tracker
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
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
        <div className="flex items-center p-4">
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
      </SidebarFooter>
    </Sidebar>
  );
};
