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
import { MobileDashboard } from '../mobile/MobileDashboard';
import { AIChatbot } from '../ai/AIChatbot';
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
      
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <Header />
            <div className="p-6">
            <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
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
          <AIChatbot />
        </main>
      </SidebarProvider>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileDashboard />
        <MeterReadingPanel
          isOpen={isMeterPanelOpen}
          onClose={() => toggleMeterPanel(false)}
        />
      </div>
    </>
  );
};
