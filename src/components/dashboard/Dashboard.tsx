import { FC, useState } from 'react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { WeeklyPieChart } from './WeeklyPieChart';
import { DailyBreakdown } from './DailyBreakdown';
import { ViewToggle } from './ViewToggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TimePeriodSelector } from '../analytics/TimePeriodSelector';
import { ExportOptions } from '../analytics/ExportOptions';
import { StatementUpload } from '../statements/StatementUpload';
import { apiService } from '../../services/api';
import { UserGuide } from '../help/UserGuide';
import { MeterReadingPanel } from '../meter-reading/MeterReadingPanel';
import { MeterReadingsLog } from '../meter-reading/MeterReadingsLog';
import { useElectricityStore } from '../../store/useElectricityStore';
import { useEffect } from 'react';

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

        {/* Tab Navigation (shadcn Tabs) */}
        <div className="mb-6 lewis-animation-fade-in">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsContent value="overview">
            <div className="space-y-8 lewis-animation-fade-in">
              <SummaryCards timePeriod={timePeriod} viewMode={viewMode} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConsumptionChart />
                <MonthlyOverview />
              </div>
              <MeterReadingsLog />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-8 lewis-animation-fade-in">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyPieChart currentMonth={currentMonth} viewMode={viewMode} />
                <DailyBreakdown currentMonth={currentMonth} viewMode={viewMode} />
              </div>
              <ExportOptions />
            </div>
          </TabsContent>

          <TabsContent value="statements">
            <StatementsSection />
          </TabsContent>
        </Tabs>
      </main>

      <MeterReadingPanel
        isOpen={isMeterPanelOpen}
        onClose={() => toggleMeterPanel(false)}
      />
      
      <UserGuide />
    </div>
  );
};

const StatementsSection: FC = () => {
  const [files, setFiles] = useState<{ id: string; file: File; status: 'uploading' | 'success' | 'error'; error?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [serverFiles, setServerFiles] = useState<any[]>([]);

  const refresh = async () => {
    const res = await apiService.listStatements();
    if (res.success && res.data) setServerFiles(res.data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onFileUpload = async (incoming: File[]) => {
    const newItems = incoming.map(f => ({ id: crypto.randomUUID(), file: f, status: 'uploading' as const }));
    setFiles(prev => [...prev, ...newItems]);
    setIsUploading(true);
    try {
      const res = await apiService.uploadStatements(incoming);
      if (!res.success) throw new Error(res.error?.message || 'Upload failed');
      setFiles(prev => prev.map(p => ({ ...p, status: 'success' })));
      await refresh();
    } catch (e) {
      setFiles(prev => prev.map(p => ({ ...p, status: 'error', error: e instanceof Error ? e.message : 'Upload failed' })));
    } finally {
      setIsUploading(false);
    }
  };

  const onFileRemove = async (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="space-y-8 lewis-animation-fade-in">
      <StatementUpload
        onFileUpload={onFileUpload}
        onFileRemove={onFileRemove}
        uploadedFiles={files}
        isUploading={isUploading}
      />

      {serverFiles.length > 0 && (
        <div className="lewis-card lewis-shadow-glow p-4 rounded-lg border">
          <h3 className="text-md font-semibold mb-3">Processed Statements</h3>
          <ul className="space-y-2">
            {serverFiles.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{s.supplier}</span>
                  <span className="text-muted-foreground ml-2">{new Date(s.importedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {s.fileUrl && (
                    <a href={s.fileUrl} target="_blank" rel="noreferrer" className="text-electric-purple underline">View</a>
                  )}
                  <button
                    className="text-destructive"
                    onClick={async () => {
                      const res = await apiService.deleteStatement(s.id);
                      if (res.success) refresh();
                    }}
                  >Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};