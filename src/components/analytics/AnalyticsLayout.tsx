import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { AnalyticsPage } from './AnalyticsPage';

export const AnalyticsLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Header />
        <AnalyticsPage />
      </main>
    </SidebarProvider>
  );
};
