import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { Button } from '@/components/ui/button-simple';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  BoltIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/outline';
import { useElectricityStore } from '../../store/useElectricityStore';
import { MeterReading } from '../../types';

interface MeterReadingsLogProps {
  onEdit?: (reading: MeterReading) => void;
  onDelete?: (id: string) => void;
}

export const MeterReadingsLog: React.FC<MeterReadingsLogProps> = ({
  onEdit,
  onDelete
}) => {
  const { readings, isLoading, deleteReading } = useElectricityStore();
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      try {
        await deleteReading(id);
        if (onDelete) onDelete(id);
      } catch (error) {
        console.error('Failed to delete reading:', error);
      }
    }
  };

  const calculateConsumption = (current: MeterReading, previous?: MeterReading) => {
    if (!previous) return 0;
    return Number(current.reading) - Number(previous.reading);
  };

  const calculateCost = (kwh: number) => {
    const { preferences } = useElectricityStore.getState();
    return kwh * preferences.unitRate;
  };

  if (isLoading) {
    return (
      <Card className="lewis-card lewis-animation-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold lewis-text-gradient">
            Meter Readings Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-2 border-electric-purple border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading readings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (readings.length === 0) {
    return (
      <Card className="lewis-card lewis-animation-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-semibold lewis-text-gradient">
            Meter Readings Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BoltIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No meter readings found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first reading to start tracking your electricity consumption
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lewis-card lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient">
          Meter Readings Log ({readings.length} readings)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all your meter readings
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {readings.map((reading, index) => {
            const previousReading = index > 0 ? readings[index - 1] : undefined;
            const consumption = calculateConsumption(reading, previousReading);
            const cost = calculateCost(consumption);
            
            return (
              <div
                key={reading.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-electric-purple/20 rounded-full flex items-center justify-center">
                      <BoltIcon className="h-5 w-5 text-electric-purple" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(reading.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(reading.date)}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BoltIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {Number(reading.reading).toFixed(2)} kWh
                        </span>
                      </div>
                      
                      {consumption > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-muted-foreground">Usage:</span>
                          <span className="text-sm font-medium text-electric-purple">
                            {consumption.toFixed(2)} kWh
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (£{cost.toFixed(2)})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {reading.notes && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {reading.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reading.type === 'MANUAL' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {reading.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedReading(reading)}
                    className="h-8 w-8 lewis-card-hover"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(reading)}
                      className="h-8 w-8 lewis-card-hover"
                      title="Edit reading"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reading.id)}
                      className="h-8 w-8 lewis-card-hover text-red-500 hover:text-red-700"
                      title="Delete reading"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Reading Details Modal */}
        {selectedReading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="lewis-card max-w-md w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-lg font-semibold lewis-text-gradient">
                  Reading Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReading(null)}
                  className="absolute top-4 right-4 h-8 w-8"
                >
                  ×
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="text-sm">{formatDate(selectedReading.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Time</label>
                    <p className="text-sm">{formatTime(selectedReading.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reading</label>
                    <p className="text-sm font-medium">{Number(selectedReading.reading).toFixed(2)} kWh</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-sm">{selectedReading.type}</p>
                  </div>
                </div>
                
                {selectedReading.notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="text-sm">{selectedReading.notes}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="text-sm">
                      {formatDate(selectedReading.createdAt)} at {formatTime(selectedReading.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Updated:</span>
                    <span className="text-sm">
                      {formatDate(selectedReading.updatedAt)} at {formatTime(selectedReading.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
