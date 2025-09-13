import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { MeterReadingProvider } from './hooks/useMeterReading';
import { AnalyticsProvider } from './hooks/useAnalytics';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-dark-50">
        <MeterReadingProvider>
          <AnalyticsProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </AnalyticsProvider>
        </MeterReadingProvider>
      </div>
    </Router>
  );
}

export default App;