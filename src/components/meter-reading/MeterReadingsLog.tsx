import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Calendar, Bolt, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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
  const { readings, isLoading, deleteReading, toggleFirstReading, generateEstimatedReadings, removeEstimatedReading } = useElectricityStore();
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'MANUAL' | 'IMPORTED' | 'ESTIMATED'>('all');

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
        // Check if it's an estimated reading (only exists in frontend state)
        const reading = readings.find(r => r.id === id);
        if (reading && reading.type === 'ESTIMATED') {
          // For estimated readings, remove them locally using removeEstimatedReading
          await removeEstimatedReading(id);
        } else {
          // For database readings, use the normal delete function
          await deleteReading(id);
          if (onDelete) onDelete(id);
        }
      } catch (error) {
        console.error('Failed to delete reading:', error);
        alert('Failed to delete reading. Please try again.');
      }
    }
  };

  const calculateConsumption = (current: MeterReading, previous?: MeterReading) => {
    if (!previous) return 0;
    // Skip consumption calculation if the current reading is marked as first reading
    if (current.isFirstReading) return 0;
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
            <Bolt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No meter readings found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first reading to start tracking your electricity consumption
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredReadings = readings.filter(reading => {
    if (filterType === 'all') return true;
    return reading.type === filterType;
  });
  
  const sortedReadings = [...filteredReadings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="lewis-card lewis-animation-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient">
          Meter Readings Log ({filteredReadings.length} readings)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all your meter readings
        </p>
        
        {/* Filter Tabs */}
        <div className="flex space-x-2 mt-4">
          <Button
            variant={filterType === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('all')}
            className="lewis-button-primary"
          >
            All
          </Button>
          <Button
            variant={filterType === 'MANUAL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('MANUAL')}
            className="lewis-button-primary"
          >
            Manual
          </Button>
          <Button
            variant={filterType === 'ESTIMATED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('ESTIMATED')}
            className="lewis-button-primary"
          >
            Estimated
          </Button>
          <Button
            variant={filterType === 'IMPORTED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilterType('IMPORTED')}
            className="lewis-button-primary"
          >
            Imported
          </Button>
        </div>
        
        {/* Generate Estimated Readings Button */}
        <div className="mt-4">
          <Button
            onClick={generateEstimatedReadings}
            className="lewis-button-secondary"
            size="sm"
          >
            Generate Estimated Readings
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {sortedReadings.map((reading, index) => {
            const previousReading = index > 0 ? sortedReadings[index - 1] : undefined;
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
                      <Bolt className="h-5 w-5 text-electric-purple" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(reading.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(reading.date)}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Bolt className="h-4 w-4 text-muted-foreground" />
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
                          : reading.type === 'ESTIMATED'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {reading.type}
                        {reading.type === 'ESTIMATED' && ' (Local)'}
                      </span>
                      {reading.isFirstReading && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          First Reading
                        </span>
                      )}
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
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFirstReading(reading.id)}
                    className={`h-8 w-8 lewis-card-hover ${
                      reading.isFirstReading 
                        ? 'text-purple-600 hover:text-purple-700' 
                        : 'text-muted-foreground hover:text-purple-600'
                    }`}
                    title={reading.isFirstReading ? "Unmark as first reading" : "Mark as first reading"}
                  >
                    <Bolt className="h-4 w-4" />
                  </Button>
                  
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(reading)}
                      className="h-8 w-8 lewis-card-hover"
                      title="Edit reading"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(reading.id)}
                    className="h-8 w-8 lewis-card-hover text-red-500 hover:text-red-700"
                    title="Delete reading"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Reading Details Modal */}
        <Dialog open={!!selectedReading} onOpenChange={(open) => !open && setSelectedReading(null)}>
          <DialogContent className="max-w-md w-full max-h-[80vh] overflow-y-auto lewis-card">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-lg font-semibold lewis-text-gradient">Reading Details</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 lewis-card-hover" title="Close">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogHeader>
            {selectedReading && (
              <div className="space-y-4">
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
