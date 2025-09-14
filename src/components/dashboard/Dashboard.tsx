import { FC, useState } from 'react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { WeeklyPieChart } from './WeeklyPieChart';
import { DailyBreakdown } from './DailyBreakdown';
import { ViewToggle } from './ViewToggle';
import { TimePeriodSelector } from '../analytics/TimePeriodSelector';
import { ExportOptions } from '../analytics/ExportOptions';
import { StatementUpload } from '../statements/StatementUpload';
import { UserGuide } from '../help/UserGuide';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { MeterReadingsLog } from '../meter-reading/MeterReadingsLog';
import { useElectricityStore } from '../../store/useElectricityStore';

export const Dashboard: FC = () => {
  const { isMeterPanelOpen, toggleMeterPanel, loadMeterReadings } = useElectricityStore();
  const [currentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'kwh' | 'cost'>('kwh');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'statements'>('overview');

  const handleRefresh = () => {
    loadMeterReadings();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 lewis-animation-fade-in">
          <h1 className="text-4xl font-bold lewis-text-gradient mb-3">
            Electricity Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your electricity consumption and costs in real-time
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 lewis-animation-fade-in">
          <div className="flex space-x-1 bg-muted/20 rounded-lg p-1 w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'statements', label: 'Statements' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'lewis-button-primary shadow-md'
                    : 'lewis-card-hover text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 lewis-animation-fade-in">
            <SummaryCards timePeriod={timePeriod} viewMode={viewMode} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConsumptionChart />
              <MonthlyOverview />
            </div>
            
            <MeterReadingsLog />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 lewis-animation-fade-in">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TimePeriodSelector
                selectedPeriod={timePeriod}
                onPeriodChange={setTimePeriod}
                onRefresh={handleRefresh}
              />
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyPieChart
                currentMonth={currentMonth}
                viewMode={viewMode}
              />
              <DailyBreakdown
                currentMonth={currentMonth}
                viewMode={viewMode}
              />
            </div>

            {/* Export Options */}
            <ExportOptions />
          </div>
        )}

        {/* Statements Tab */}
        {activeTab === 'statements' && (
          <div className="space-y-8 lewis-animation-fade-in">
            <StatementUpload
              onFileUpload={async (files) => {
                console.log('Files uploaded:', files);
                // TODO: Implement file processing
              }}
              onFileRemove={(fileId) => {
                console.log('File removed:', fileId);
                // TODO: Implement file removal
              }}
              uploadedFiles={[]}
              isUploading={false}
            />
          </div>
        )}
      </main>

      <MeterReadingPanel
        isOpen={isMeterPanelOpen}
        onClose={() => toggleMeterPanel(false)}
      />
      
      <UserGuide />
    </div>
  );
};