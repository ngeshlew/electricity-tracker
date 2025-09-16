import { FC, useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { ConsumptionBreakdown } from './ConsumptionBreakdown';
import { MonthSelector } from './MonthSelector';
import { UserGuide } from '../help/UserGuide';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { MeterReadingsLog } from '../meter-reading/MeterReadingsLog';
import { useElectricityStore } from '../../store/useElectricityStore';

export const Dashboard: FC = () => {
  const { isMeterPanelOpen, toggleMeterPanel, loadMeterReadings, clearCacheAndReload, readings, chartData, isLoading, error } = useElectricityStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load meter readings when component mounts
  useEffect(() => {
    loadMeterReadings();
  }, [loadMeterReadings]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsible={true}
        onCollapseChange={setIsSidebarCollapsed}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        <Header />
        <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor your electricity consumption and track your energy usage patterns
            </p>
            
            {/* Debug Info */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium mb-2">Debug Info:</h3>
              <p className="text-xs text-muted-foreground">
                Readings: {readings.length} | Chart Data: {chartData.length} | Loading: {isLoading ? 'Yes' : 'No'} | Error: {error || 'None'}
              </p>
              <button 
                onClick={clearCacheAndReload}
                className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>

                {/* Key Metrics Cards */}
                <div className="mb-6">
                  <SummaryCards currentMonth={currentMonth} />
                </div>

          {/* Main Content Grid */}
          <div className="space-y-6">
            <ConsumptionChart />
            
            {/* Month Selector */}
            <div className="flex justify-center">
              <MonthSelector
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
              />
            </div>
            
                   <div className="grid gap-6 md:grid-cols-3">
                     <ConsumptionBreakdown
                       currentMonth={currentMonth}
                       viewMode="kwh"
                     />
                     <MonthlyOverview
                       currentMonth={currentMonth}
                     />
                   </div>
          </div>

          {/* Recent Readings */}
          <div className="mt-8">
            <MeterReadingsLog />
          </div>
        </div>
        </main>

        <MeterReadingPanel
          isOpen={isMeterPanelOpen}
          onClose={() => toggleMeterPanel(false)}
        />
        <UserGuide />
      </div>
    </div>
  );
};
