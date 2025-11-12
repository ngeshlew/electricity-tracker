import { MeterReading } from '../types';

/**
 * Export meter readings to CSV format
 */
export const exportToCSV = (readings: MeterReading[], filename: string = 'meter-readings.csv') => {
  // CSV header
  const headers = ['Date', 'Time', 'Reading (kWh)', 'Type', 'Notes', 'Created At', 'Updated At'];
  
  // Convert readings to CSV rows
  const rows = readings.map(reading => {
    const date = new Date(reading.date);
    const createdAt = new Date(reading.createdAt);
    const updatedAt = new Date(reading.updatedAt);
    
    return [
      date.toLocaleDateString('en-GB'),
      date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      reading.reading.toString(),
      reading.type,
      reading.notes || '',
      createdAt.toLocaleString('en-GB'),
      updatedAt.toLocaleString('en-GB'),
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
  });
  
  // Combine headers and rows
  const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export meter readings to JSON format
 */
export const exportToJSON = (readings: MeterReading[], filename: string = 'meter-readings.json') => {
  const jsonContent = JSON.stringify(readings, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Filter readings by date range
 */
export const filterReadingsByDateRange = (
  readings: MeterReading[],
  startDate: Date,
  endDate: Date
): MeterReading[] => {
  return readings.filter(reading => {
    const readingDate = new Date(reading.date);
    return readingDate >= startDate && readingDate <= endDate;
  });
};

