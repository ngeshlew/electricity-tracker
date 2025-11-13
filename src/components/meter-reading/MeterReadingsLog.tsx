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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eye, Pencil, Trash2, X, MoreHorizontal, Zap, Search, Filter, Plus, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useElectricityStore } from '../../store/useElectricityStore';
import { MeterReading } from '../../types';
import { exportToCSV, exportToJSON } from '../../utils/exportData';

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
          <CardTitle className="text-lg font-normal uppercase tracking-wide mb-4">Reading History</CardTitle>
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

  // Group readings by month
  const groupReadingsByMonth = (readings: MeterReading[]) => {
    const groups: { [key: string]: MeterReading[] } = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(reading);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .map(([key, readings]) => {
        const date = new Date(readings[0].date);
        const monthLabel = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase();
        return {
          key,
          label: monthLabel,
          readings: readings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key)); // Sort months newest first
  };

  const monthGroups = groupReadingsByMonth(sortedReadings);

  if (!isLoading && readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Reading History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-normal mb-2">No readings yet</h3>
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
          <CardTitle className="text-lg font-normal uppercase tracking-wide mb-4">Reading History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH READINGS..."
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
            <h3 className="text-lg font-normal mb-2">No readings found</h3>
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
    <Card role="region" aria-label="Meter reading history" className="bg-transparent w-full" style={{ padding: 'var(--space-md)' }}>
      <CardHeader className="mb-6" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4" style={{ marginBottom: 'var(--space-lg)' }}>
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Reading History</CardTitle>
          
          {/* Export Buttons */}
          <div className="flex gap-2" role="group" aria-label="Export options">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(sortedReadings)}
              className="h-9 text-xs uppercase tracking-normal font-mono"
              aria-label="Export readings as CSV"
            >
              <Download className="h-3 w-3 mr-2" aria-hidden="true" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToJSON(sortedReadings)}
              className="h-9 text-xs uppercase tracking-normal font-mono"
              aria-label="Export readings as JSON"
            >
              <Download className="h-3 w-3 mr-2" aria-hidden="true" />
              JSON
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH READINGS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-16 h-10 sm:h-9 text-sm"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 button__shortcut" aria-label="Keyboard shortcut: /">
              /
            </span>
          </div>
          
          {/* Type Filter */}
          <Select value={filterType} onValueChange={(value: 'ALL' | 'MANUAL' | 'ESTIMATED') => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
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
        {/* Mobile: Horizontal scroll wrapper */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <TableCaption className="text-xs text-muted-foreground mb-4">
              {sortedReadings.length} of {readings.length} {readings.length === 1 ? 'reading' : 'readings'}
              {searchQuery && ` matching "${searchQuery}"`}
            </TableCaption>
            
            {monthGroups.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No readings found
              </div>
            ) : (
              <Accordion type="multiple" defaultValue={monthGroups.map(g => g.key)} className="w-full">
                {monthGroups.map((group, groupIndex) => (
                    <AccordionItem key={group.key} value={group.key} className="border-none">
                    <AccordionTrigger className="py-3 hover:no-underline hover:opacity-70" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>
                      <h3 className="text-base uppercase tracking-wide font-mono">{group.label}</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4" style={{ paddingTop: 'var(--space-lg)' }}>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-dashed">
                              <TableHead style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Date</TableHead>
                              <TableHead style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Reading</TableHead>
                              <TableHead style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Consumption</TableHead>
                              <TableHead style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Cost</TableHead>
                              <TableHead style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Status</TableHead>
                              <TableHead className="text-right" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.readings.map((reading, index) => {
                              // For consumption calculation, we need the next reading (chronologically)
                              // Since we're sorted in descending order, the next reading is at index + 1
                              const nextReading = index < group.readings.length - 1 ? group.readings[index + 1] : undefined;
                              const consumption = calculateConsumption(reading, nextReading);
                              const cost = calculateCost(consumption);
                              
                              return (
                                <TableRow key={reading.id}>
                                  <TableCell style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>{formatDate(reading.date)}</TableCell>
                                  <TableCell style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>{Number(reading.reading).toFixed(2)} kWh</TableCell>
                                  <TableCell style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>{consumption > 0 ? `${consumption.toFixed(2)} kWh` : '-'}</TableCell>
                                  <TableCell style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>{consumption > 0 ? `£${cost.toFixed(2)}` : '-'}</TableCell>
                                  <TableCell style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>
                                    <span className="text-xs uppercase tracking-normal font-mono">
                                      {reading.type === "MANUAL" ? (
                                        <span className="text-foreground">■ MANUAL</span>
                                      ) : (
                                        <span className="text-muted-foreground">○ ESTIMATED</span>
                                      )}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right" style={{ paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)' }}>
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
                        {groupIndex < monthGroups.length - 1 && (
                          <div className="border-t border-dashed border-border my-6" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}></div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
        
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
