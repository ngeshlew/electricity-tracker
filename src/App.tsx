import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ResponsiveTestBanner } from './components/ResponsiveTestBanner';
import { Dashboard } from './components/dashboard/Dashboard';
import { SettingsLayout } from './components/settings/SettingsLayout';
import { InsightsLayout } from './components/insights/InsightsLayout';
import { AnalyticsLayout } from './components/analytics/AnalyticsLayout';
import { StatementsLayout } from './components/statements/StatementsLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useElectricityStore } from './store/useElectricityStore';
import './index.css';

function App() {
  const { loadMeterReadings, setupRealtimeUpdates, cleanupRealtimeUpdates } = useElectricityStore();

  useEffect(() => {
    // Load initial data and set up real-time updates
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        await loadMeterReadings();
        console.log('Data loaded, setting up real-time updates...');
        
        // Try to set up real-time updates, but don't fail if it doesn't work
        try {
          setupRealtimeUpdates();
          console.log('Real-time updates set up successfully');
        } catch (socketError) {
          console.warn('Failed to set up real-time updates (this is OK):', socketError);
        }
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();

    // Cleanup on unmount
    return () => {
      try {
        cleanupRealtimeUpdates();
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    };
  }, [loadMeterReadings, setupRealtimeUpdates, cleanupRealtimeUpdates]);

  return (
    <ThemeProvider defaultTheme="mono" storageKey="electricity-tracker-theme">
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <ResponsiveTestBanner />
            <div className="pt-10">
              <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/insights" element={<InsightsLayout />} />
              <Route path="/analytics" element={<AnalyticsLayout />} />
              <Route path="/statements" element={<StatementsLayout />} />
              <Route path="/settings" element={<SettingsLayout />} />
              </Routes>
            </div>
          </div>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;