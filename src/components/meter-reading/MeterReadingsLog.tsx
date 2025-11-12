import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, X, MoreHorizontal, Zap, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { readings, isLoading, deleteReading, removeEstimatedReading } = useElectricityStore();
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MANUAL' | 'ESTIMATED'>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields (except to allow '/' to focus search)
      const target = e.target as HTMLElement;
      if (
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
        target !== searchInputRef.current
      ) {
        return;
      }

      // '/' key to focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-GB', {
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

  const calculateConsumption = (current: MeterReading, next?: MeterReading) => {
    if (!next) return 0;
    // Skip consumption calculation if the current reading is marked as first reading
    if (current.isFirstReading) return 0;
    // Calculate consumption as current - next (since current is newer)
    return Number(current.reading) - Number(next.reading);
  };

  const calculateCost = (kwh: number) => {
    const { preferences } = useElectricityStore.getState();
    return kwh * preferences.unitRate;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide mb-4">Reading History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-full sm:w-[180px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter and search readings
  const filteredReadings = readings.filter(reading => {
    // Filter by type
    if (filterType !== 'ALL' && reading.type !== filterType) {
      return false;
    }
    
    // Search by date, reading value, or notes
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const dateStr = formatDate(reading.date).toLowerCase();
      const readingStr = reading.reading.toString();
      const notesStr = (reading.notes || '').toLowerCase();
      
      return dateStr.includes(query) || 
             readingStr.includes(query) || 
             notesStr.includes(query);
    }
    
    return true;
  });

  const sortedReadings = [...filteredReadings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!isLoading && readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No readings yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Start tracking your electricity usage by adding your first meter reading. 
              Readings help you monitor consumption and identify savings opportunities.
            </p>
            <Button 
              onClick={() => {
                // Trigger Add Reading panel via store
                const { toggleMeterPanel } = useElectricityStore.getState();
                toggleMeterPanel(true);
              }}
              size="lg"
              className="min-w-[200px]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Reading
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">A</kbd> to add a reading
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Empty search results
  if (!isLoading && readings.length > 0 && sortedReadings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide mb-4">Reading History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search by date, reading, or notes... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={(value: 'ALL' | 'MANUAL' | 'ESTIMATED') => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Readings</SelectItem>
                <SelectItem value="MANUAL">Manual Only</SelectItem>
                <SelectItem value="ESTIMATED">Estimated Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No readings found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No readings match your search "{searchQuery}"{filterType !== 'ALL' && ` and filter "${filterType}"`}
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterType('ALL');
              }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold uppercase tracking-wide mb-4">Reading History</CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search by date, reading, or notes... (Press / to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Type Filter */}
          <Select value={filterType} onValueChange={(value: 'ALL' | 'MANUAL' | 'ESTIMATED') => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Readings</SelectItem>
              <SelectItem value="MANUAL">Manual Only</SelectItem>
              <SelectItem value="ESTIMATED">Estimated Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableCaption className="text-xs text-muted-foreground">
            {sortedReadings.length} of {readings.length} {readings.length === 1 ? 'reading' : 'readings'}
            {searchQuery && ` matching "${searchQuery}"`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Consumption</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReadings.map((reading, index) => {
              // For consumption calculation, we need the next reading (chronologically)
              // Since we're sorted in descending order, the next reading is at index + 1
              const nextReading = index < sortedReadings.length - 1 ? sortedReadings[index + 1] : undefined;
              const consumption = calculateConsumption(reading, nextReading);
              const cost = calculateCost(consumption);
              
              return (
                <TableRow key={reading.id}>
                  <TableCell>{formatDate(reading.date)}</TableCell>
                  <TableCell className="">{Number(reading.reading).toFixed(2)} kWh</TableCell>
                  <TableCell>{consumption > 0 ? `${consumption.toFixed(2)} kWh` : '-'}</TableCell>
                  <TableCell>{consumption > 0 ? `£${cost.toFixed(2)}` : '-'}</TableCell>
                  <TableCell>
                    <span className="text-xs uppercase tracking-wide">
                      {reading.type === "MANUAL" ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-foreground"></span>
                          Manual
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <span className="inline-block w-2 h-2 rounded-full border border-current"></span>
                          Estimated
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedReading(reading)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(reading)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(reading.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {/* Reading Details Modal */}
        {selectedReading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="relative">
                <CardTitle className="text-base pr-10">
                  Reading Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReading(null)}
                  className="absolute top-4 right-4 h-8 w-8"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs  text-muted-foreground">Date</label>
                    <p className="text-xs">{formatDate(selectedReading.date)}</p>
                  </div>
                  <div>
                    <label className="text-xs  text-muted-foreground">Time</label>
                    <p className="text-xs">{formatTime(selectedReading.date)}</p>
                  </div>
                  <div>
                    <label className="text-xs  text-muted-foreground">Reading</label>
                    <p className="text-xs ">{Number(selectedReading.reading).toFixed(2)} kWh</p>
                  </div>
                  <div>
                    <label className="text-xs  text-muted-foreground">Type</label>
                    <p className="text-xs">{selectedReading.type}</p>
                  </div>
                </div>
                
                {selectedReading.notes && (
                  <div>
                    <label className="text-xs  text-muted-foreground">Notes</label>
                    <p className="text-xs">{selectedReading.notes}</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Created:</span>
                    <span className="text-xs">
                      {formatDate(selectedReading.createdAt)} at {formatTime(selectedReading.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Updated:</span>
                    <span className="text-xs">
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
