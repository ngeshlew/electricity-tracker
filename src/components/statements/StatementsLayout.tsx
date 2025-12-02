import React from 'react';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { StatementsPage } from './StatementsPage';

export const StatementsLayout: React.FC = () => {
  return (
    <div className="lg:flex w-screen">
      {/* Sidebar - Desktop only */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      
      <main className="flex-1 lg:ml-0">
        <Header />
        <StatementsPage />
      </main>
    </div>
  );
};
