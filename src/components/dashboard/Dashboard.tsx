import { FC, useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from './Header';
import { AppSidebar } from './AppSidebar';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { ConsumptionBreakdown } from './ConsumptionBreakdown';
import { MonthSelector } from './MonthSelector';
import { UserGuide } from '../help/UserGuide';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { MeterReadingsLog } from '../meter-reading/MeterReadingsLog';
import { MobileNavigation } from '../mobile/MobileNavigation';
import { useElectricityStore } from '../../store/useElectricityStore';

export const Dashboard: FC = () => {
  const { isMeterPanelOpen, toggleMeterPanel, loadMeterReadings } = useElectricityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Load meter readings when component mounts
  useEffect(() => {
    loadMeterReadings();
  }, [loadMeterReadings]);

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Responsive Layout */}
      <SidebarProvider>
        <div className="lg:flex">
          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block">
            <AppSidebar />
          </div>
          
          <main className="flex-1 lg:ml-0">
            {/* Header - Desktop only */}
            <div className="hidden lg:block">
              <Header />
            </div>
            
            {/* Dashboard Content - Responsive */}
            <div className="p-4 sm:p-6 pt-14 lg:pt-6 pb-20 lg:pb-6">
              <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight uppercase">Dashboard</h1>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Track your electricity usage
                      </p>
                    </div>
                    <MonthSelector
                      currentMonth={currentMonth}
                      onMonthChange={setCurrentMonth}
                    />
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="mb-6">
                  <SummaryCards currentMonth={currentMonth} />
                </div>

                {/* Main Content Grid */}
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <ConsumptionBreakdown
                      currentMonth={currentMonth}
                      viewMode="kwh"
                    />
                    <MonthlyOverview
                      currentMonth={currentMonth}
                    />
                  </div>
                  
                  <ConsumptionChart />
                </div>

                {/* Recent Readings */}
                <div className="mt-8">
                  <MeterReadingsLog />
                </div>
              </div>
            </div>

            <MeterReadingPanel
              isOpen={isMeterPanelOpen}
              onClose={() => toggleMeterPanel(false)}
            />
            <UserGuide />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};
