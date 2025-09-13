import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { Button } from '@/components/ui/button-simple';
import { 
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useElectricityStore } from '../../store/useElectricityStore';

interface ExportOptionsProps {
  className?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ className = '' }) => {
  const { readings, chartData, timeSeriesData } = useElectricityStore();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value instanceof Date) {
            return value.toISOString().split('T')[0];
          }
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

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

  const exportToJSON = async (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
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

  const handleExport = async (type: 'csv' | 'json', dataType: 'readings' | 'chart' | 'analytics') => {
    setIsExporting(true);
    
    try {
      let data: any[] = [];
      let filename = '';

      switch (dataType) {
        case 'readings':
          data = readings.map(reading => ({
            id: reading.id,
            meterId: reading.meterId,
            reading: reading.reading,
            date: reading.date.toISOString().split('T')[0],
            type: reading.type,
            notes: reading.notes || '',
            createdAt: reading.createdAt.toISOString(),
            updatedAt: reading.updatedAt.toISOString()
          }));
          filename = `meter-readings-${new Date().toISOString().split('T')[0]}`;
          break;
        
        case 'chart':
          data = chartData.map(point => ({
            date: point.date,
            kwh: point.kwh,
            cost: point.cost,
            label: point.label || ''
          }));
          filename = `consumption-chart-${new Date().toISOString().split('T')[0]}`;
          break;
        
        case 'analytics':
          data = timeSeriesData.map(point => ({
            period: point.period,
            totalKwh: point.totalKwh,
            totalCost: point.totalCost,
            averageDaily: point.averageDaily,
            trend: point.trend
          }));
          filename = `analytics-data-${new Date().toISOString().split('T')[0]}`;
          break;
      }

      if (type === 'csv') {
        await exportToCSV(data, `${filename}.csv`);
      } else {
        await exportToJSON(data, `${filename}.json`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      title: 'Meter Readings',
      description: 'Export all meter reading data',
      icon: <TableCellsIcon className="h-6 w-6" />,
      dataType: 'readings' as const,
      available: readings.length > 0
    },
    {
      title: 'Consumption Chart',
      description: 'Export consumption chart data',
      icon: <ChartBarIcon className="h-6 w-6" />,
      dataType: 'chart' as const,
      available: chartData.length > 0
    },
    {
      title: 'Analytics Data',
      description: 'Export time series analytics',
      icon: <CalendarIcon className="h-6 w-6" />,
      dataType: 'analytics' as const,
      available: timeSeriesData.length > 0
    }
  ];

  return (
    <Card className={`lewis-card lewis-shadow-glow lewis-animation-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient flex items-center space-x-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export Data</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Download your electricity data in various formats
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {exportOptions.map((option) => (
          <div
            key={option.title}
            className={`p-4 rounded-lg border ${
              option.available 
                ? 'bg-muted/20 border-border hover:border-electric-purple/50' 
                : 'bg-muted/10 border-muted-foreground/20 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-electric-purple mt-1">
                  {option.icon}
                </div>
                <div>
                  <h4 className="font-medium">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('csv', option.dataType)}
                  disabled={!option.available || isExporting}
                  className="lewis-card-hover"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExport('json', option.dataType)}
                  disabled={!option.available || isExporting}
                  className="lewis-card-hover"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  JSON
                </Button>
              </div>
            </div>
          </div>
        ))}

        {isExporting && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 border-2 border-electric-purple border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                Preparing download...
              </span>
            </div>
          </div>
        )}

        {exportOptions.every(option => !option.available) && (
          <div className="text-center py-8 text-muted-foreground">
            <ArrowDownTrayIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data available for export</p>
            <p className="text-sm">Add some meter readings to enable export options</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
