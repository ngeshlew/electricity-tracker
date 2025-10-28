import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { StatementsPage } from './StatementsPage';
import { MobileNavigation } from '../mobile/MobileNavigation';

export const StatementsLayout: React.FC = () => {
  return (
    <>
      <MobileNavigation />
      <SidebarProvider>
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <main className="flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0">
          <div className="hidden lg:block">
            <Header />
          </div>
          <StatementsPage />
        </main>
      </SidebarProvider>
    </>
  );
};
