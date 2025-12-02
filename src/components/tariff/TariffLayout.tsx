import React, { useState } from 'react';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { MobileNavigation } from '../mobile/MobileNavigation';
import { TariffHistoryTable } from './TariffHistoryTable';
import { TariffFormDialog } from './TariffFormDialog';
import { CurrentTariffInfo } from './CurrentTariffInfo';
import { UKPriceComparison } from './UKPriceComparison';

export const TariffLayout: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Responsive Layout */}
      <div className="lg:flex w-screen">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        <main className="flex-1 lg:ml-0">
          {/* Header - Desktop only */}
          <div className="hidden lg:block">
            <Header />
          </div>
            
            {/* Tariff Content - Responsive */}
            <div className="px-4 sm:px-6 pt-14 lg:pt-6 pb-20 lg:pb-6">
              <div className="mx-auto max-w-7xl w-full">
                {/* Page Header */}
                <div className="mb-8" style={{ marginBottom: 'var(--space-xl)' }}>
                  <h1 className="text-2xl font-normal tracking-tight uppercase">Tariff</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage your energy tariff and track cost savings
                  </p>
                </div>

                {/* Current Tariff Information */}
                <div className="mb-6">
                  <CurrentTariffInfo />
                </div>

                {/* Tariff History Table */}
                <div className="mb-6">
                  <TariffHistoryTable onAddTariff={() => setIsDialogOpen(true)} />
                </div>

                {/* UK Price Comparison */}
                <div className="mb-6">
                  <UKPriceComparison />
                </div>
              </div>
            </div>
          </main>
        </div>

      {/* Tariff Form Dialog */}
      <TariffFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

