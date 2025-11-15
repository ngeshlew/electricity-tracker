import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "@/components/ui/toast-container";
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Dashboard } from './components/dashboard/Dashboard';
import { SettingsLayout } from './components/settings/SettingsLayout';
import { InsightsLayout } from './components/insights/InsightsLayout';
import { AnalyticsLayout } from './components/analytics/AnalyticsLayout';
import { StatementsLayout } from './components/statements/StatementsLayout';
import { NotificationsLayout } from './components/notifications/NotificationsLayout';
import { TariffLayout } from './components/tariff/TariffLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useElectricityStore } from './store/useElectricityStore';
import { clearOldCaches } from './utils/cacheManager';
import './index.css';

function App() {
  const { loadMeterReadings, setupRealtimeUpdates, cleanupRealtimeUpdates } = useElectricityStore();

  useEffect(() => {
    // Clear old caches on app initialization to ensure fresh content
    clearOldCaches().catch((error) => {
      console.warn('Failed to clear old caches:', error);
    });

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
            <div>
              <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><InsightsLayout /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsLayout /></ProtectedRoute>} />
              <Route path="/statements" element={<ProtectedRoute><StatementsLayout /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsLayout /></ProtectedRoute>} />
              <Route path="/tariff" element={<ProtectedRoute><TariffLayout /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
              </Routes>
            </div>
          </div>
        </Router>
        <PWAInstallPrompt />
        <Toaster />
        <ToastContainer />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;