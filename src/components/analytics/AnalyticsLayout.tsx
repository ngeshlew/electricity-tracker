import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { AnalyticsPage } from './AnalyticsPage';
import { MobileNavigation } from '../mobile/MobileNavigation';

export const AnalyticsLayout: React.FC = () => {
  return (
    <>
      {/* Mobile Navigation & Header */}
      <MobileNavigation />

      <SidebarProvider>
        {/* Sidebar visible on lg+ only */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>

        <main className="flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0">
          {/* Desktop header only */}
          <div className="hidden lg:block">
            <Header />
          </div>
          <AnalyticsPage />
        </main>
      </SidebarProvider>
    </>
  );
};
