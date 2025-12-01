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
import { UserGuide } from '../help/UserGuide';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { MeterReadingsLog } from '../meter-reading/MeterReadingsLog';
import { MobileNavigation } from '../mobile/MobileNavigation';
import { useElectricityStore } from '../../store/useElectricityStore';
import { CurrentTariffInfo } from '../tariff/CurrentTariffInfo';
import { TariffHistoryTable } from '../tariff/TariffHistoryTable';
import { UKPriceComparison } from '../tariff/UKPriceComparison';
import { TariffFormDialog } from '../tariff/TariffFormDialog';

export const Dashboard: FC = () => {
  const { isMeterPanelOpen, toggleMeterPanel, loadMeterReadings } = useElectricityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isTariffDialogOpen, setIsTariffDialogOpen] = useState(false);

  // Load meter readings when component mounts
  useEffect(() => {
    loadMeterReadings();
  }, [loadMeterReadings]);

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
            {/* Header - Desktop only */}
            <div className="hidden lg:block">
              <Header />
            </div>
            
            {/* Dashboard Content - Responsive */}
            <div className="px-4 sm:px-6 pt-14 lg:pt-6 pb-20 lg:pb-6">
              <div className="mx-auto max-w-7xl w-full">
                {/* Page Header - Reduced spacing (2x less) */}
                <div className="mb-8" style={{ marginBottom: 'var(--space-xl)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-normal tracking-tight uppercase">Dashboard</h1>
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
                <div className="mb-8" style={{ marginBottom: 'var(--space-xl)' }}>
                  <SummaryCards currentMonth={currentMonth} />
                </div>

                {/* Main Content - Reduced spacing (2x less) */}
                <div className="space-y-8 w-full" style={{ gap: 'var(--space-xl)' }}>
                  {/* Consumption Breakdown - Full width row */}
                  <ConsumptionBreakdown
                    currentMonth={currentMonth}
                    viewMode="kwh"
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

                  {/* Tariff Section */}
                  <section className="space-y-6">
                    <div className="border-t border-dotted pt-6" style={{ borderColor: 'var(--color-accent-red)' }}>
                      <h2 className="text-2xl font-normal tracking-tight uppercase">Tariff</h2>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Manage your energy tariff and track cost savings
                      </p>
                    </div>

                    <CurrentTariffInfo />

                    <TariffHistoryTable onAddTariff={() => setIsTariffDialogOpen(true)} />

                    <UKPriceComparison />
                  </section>
                </div>

                {/* Recent Readings - Reduced spacing (2x less) */}
                <div className="mt-8" style={{ marginTop: 'var(--space-xl)' }}>
                  <MeterReadingsLog />
                </div>
              </div>
            </div>

            <MeterReadingPanel
              isOpen={isMeterPanelOpen}
              onClose={() => toggleMeterPanel(false)}
            />
            <TariffFormDialog
              open={isTariffDialogOpen}
              onOpenChange={setIsTariffDialogOpen}
            />
            <UserGuide />
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};
