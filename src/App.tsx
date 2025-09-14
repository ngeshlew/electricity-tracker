import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useElectricityStore } from './store/useElectricityStore';
import './index.css';

function App() {
  const { loadMeterReadings, setupRealtimeUpdates, cleanupRealtimeUpdates } = useElectricityStore();

  useEffect(() => {
    // Load initial data and set up real-time updates
    loadMeterReadings();
    setupRealtimeUpdates();

    // Cleanup on unmount
    return () => {
      cleanupRealtimeUpdates();
    };
  }, [loadMeterReadings, setupRealtimeUpdates, cleanupRealtimeUpdates]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;