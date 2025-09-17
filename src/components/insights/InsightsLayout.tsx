import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { InsightsPage } from './InsightsPage';
import { AIChatbot } from '../ai/AIChatbot';

export const InsightsLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Header />
        <InsightsPage />
        <AIChatbot />
      </main>
    </SidebarProvider>
  );
};
