import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "@/components/ui/toast-container";
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Dashboard } from './components/dashboard/Dashboard';
import { TwoColumnLoginPage } from './components/auth/TwoColumnLoginPage';
import { useNavigate } from 'react-router-dom';
import { SettingsLayout } from './components/settings/SettingsLayout';
import { InsightsLayout } from './components/insights/InsightsLayout';
import { AnalyticsLayout } from './components/analytics/AnalyticsLayout';
import { StatementsLayout } from './components/statements/StatementsLayout';
import { NotificationsLayout } from './components/notifications/NotificationsLayout';
import { TariffLayout } from './components/tariff/TariffLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
        
        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
            });
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
              {/* Small wrapper to satisfy TwoColumnLoginPage required callbacks */}
              {/*
                These handlers keep the UX simple for now:
                - Back to Home goes to dashboard (guarded; will redirect to /login if not authed)
                - Switch/Register and Forgot just keep user on /login (could open modals later)
              */}
              {/* eslint-disable-next-line react/no-unstable-nested-components */}
              const LoginRoute = () => {
                const navigate = useNavigate();
                return (
                  <TwoColumnLoginPage
                    onSwitchToRegister={() => navigate('/login')}
                    onForgotPassword={() => navigate('/login')}
                    onBackToHome={() => navigate('/')}
                  />
                );
              };
              <Routes>
              <Route path="/login" element={<LoginRoute />} />
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