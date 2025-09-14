import { FC, useState } from 'react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { ConsumptionChart } from './ConsumptionChart';
import { MonthlyOverview } from './MonthlyOverview';
import { WeeklyPieChart } from './WeeklyPieChart';
import { PreferencesPanel } from '../analytics/PreferencesPanel';
import { DailyBreakdown } from './DailyBreakdown';
import { ViewToggle } from './ViewToggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TimePeriodSelector } from '../analytics/TimePeriodSelector';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, ArrowUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

        {/* Breadcrumb */}
        <div className="mb-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {activeTab === 'overview' && <BreadcrumbPage>Overview</BreadcrumbPage>}
                {activeTab === 'analytics' && <BreadcrumbPage>Analytics</BreadcrumbPage>}
                {activeTab === 'statements' && <BreadcrumbPage>Statements</BreadcrumbPage>}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
              <PreferencesPanel />
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
  const [sortAsc, setSortAsc] = useState(false);

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold">Processed Statements</h3>
            <button
              className="inline-flex items-center text-sm hover:underline"
              onClick={() => setSortAsc((v) => !v)}
            >
              <ArrowUpDown className="h-4 w-4 mr-1" /> Sort by imported date
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Imported</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...serverFiles]
                .sort((a, b) => sortAsc ? new Date(a.importedAt).getTime() - new Date(b.importedAt).getTime() : new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())
                .map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.supplier}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(s.importedAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {s.fileUrl && (
                          <DropdownMenuItem asChild>
                            <a href={s.fileUrl} target="_blank" rel="noreferrer">View</a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={async () => {
                          const res = await apiService.deleteStatement(s.id);
                          if (res.success) refresh();
                        }}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};