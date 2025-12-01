import { FC, useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './Header';
import { AppSidebar } from './AppSidebar';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { ConsumptionBreakdown } from './ConsumptionBreakdown';
import { AnnualProgressCards } from './AnnualProgressCards';
import { SeasonalTracker } from './SeasonalTracker';
import { MonthSelector } from './MonthSelector';
import { FuelTopupPanel } from '../fuel-topup/FuelTopupPanel';
import { FuelTopupsLog } from '../fuel-topup/FuelTopupsLog';
import { MobileNavigation } from '../mobile/MobileNavigation';
import { useFuelStore } from '@/store/useFuelStore';
import { UKFuelPriceComparison } from './UKFuelPriceComparison';

import { FuelTopup } from '@/types';

export const Dashboard: FC = () => {
  const { isTopupPanelOpen, toggleTopupPanel, loadFuelTopups } = useFuelStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [topupToEdit, setTopupToEdit] = useState<FuelTopup | undefined>(undefined);

  // Load fuel topups when component mounts
  useEffect(() => {
    loadFuelTopups();
  }, [loadFuelTopups]);

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Responsive Layout */}
      <SidebarProvider defaultOpen={false}>
        <div className="lg:flex w-screen">
          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          
          <main className="flex-1 lg:ml-0">
            {/* Header - show on all sizes so top nav actions are visible */}
            <Header />
            
            {/* Dashboard Content - Responsive */}
            <div className="px-4 sm:px-6 pt-14 lg:pt-6 pb-20 lg:pb-6">
              <div className="mx-auto max-w-7xl w-full">
                {/* Page Header - Reduced spacing (2x less) */}
                <div className="mb-8" style={{ marginBottom: 'var(--space-xl)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-normal tracking-tight uppercase">Dashboard</h1>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Track your fuel consumption and costs
                      </p>
                    </div>
                    <MonthSelector
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                    />
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="mb-8" style={{ marginBottom: 'var(--space-xl)' }}>
                  <SummaryCards currentMonth={currentMonth} />
                </div>

                {/* Main Content - Reduced spacing (2x less) */}
                <div className="space-y-8 w-full" style={{ gap: 'var(--space-xl)' }}>
                  {/* Consumption Breakdown - Full width row */}
                  <ConsumptionBreakdown
                    currentMonth={currentMonth}
                    viewMode="litres"
                  />
                  
                  {/* Monthly Overview - Full width row */}
                  <MonthlyOverview
                    currentMonth={currentMonth}
                  />
                  <div className="border-t border-dotted pt-6 space-y-2" style={{ borderColor: 'var(--color-accent-red)' }}>
                    <h2 className="text-2xl font-normal tracking-tight uppercase">Performance</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Monitor long-term usage, weekly consumption, and seasonal trends
                    </p>
                  </div>
                  
                  {/* Annual Progress Cards */}
                  <div>
                    <AnnualProgressCards />
                  </div>
                  
                  {/* Consumption Chart */}
                  <ConsumptionChart />
                  
                  {/* Seasonal Tracker */}
                  <SeasonalTracker />

                  {/* UK Fuel Price Comparison */}
                  <UKFuelPriceComparison />
                </div>

                {/* Recent Topups - Reduced spacing (2x less) */}
                <div className="mt-8" style={{ marginTop: 'var(--space-xl)' }}>
                  <FuelTopupsLog 
                    onEdit={(topup) => {
                      setTopupToEdit(topup);
                      toggleTopupPanel(true);
                    }}
                  />
                </div>
              </div>
            </div>

            <FuelTopupPanel
              isOpen={isTopupPanelOpen}
              onClose={() => {
                toggleTopupPanel(false);
                setTopupToEdit(undefined);
              }}
              topupToEdit={topupToEdit}
            />
            
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};
