import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Calendar, Bolt, X, ArrowUpDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useElectricityStore } from '../../store/useElectricityStore';
import { MeterReading } from '../../types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';

interface MeterReadingsLogProps {
  onDelete?: (id: string) => void;
}

export const MeterReadingsLog: React.FC<MeterReadingsLogProps> = ({
  onDelete
}) => {
  const { readings, isLoading, deleteReading, toggleFirstReading, generateEstimatedReadings, removeEstimatedReading, updateReading } = useElectricityStore();
  const [selectedReading, setSelectedReading] = useState<MeterReading | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'MANUAL' | 'IMPORTED' | 'ESTIMATED'>('all');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<'date' | 'reading' | 'type'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [kwhMin, setKwhMin] = useState<number | undefined>();
  const [kwhMax, setKwhMax] = useState<number | undefined>();
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [announce, setAnnounce] = useState('');

  // persist table state
  useEffect(() => {
    const saved = localStorage.getItem('readings-table-state');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setFilterType(s.filterType ?? 'all');
        setQuery(s.query ?? '');
        setSortKey(s.sortKey ?? 'date');
        setSortAsc(Boolean(s.sortAsc));
        setDateFrom(s.dateFrom ? new Date(s.dateFrom) : undefined);
        setDateTo(s.dateTo ? new Date(s.dateTo) : undefined);
        setKwhMin(typeof s.kwhMin === 'number' ? s.kwhMin : undefined);
        setKwhMax(typeof s.kwhMax === 'number' ? s.kwhMax : undefined);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('readings-table-state', JSON.stringify({
      filterType, query, sortKey, sortAsc, dateFrom, dateTo, kwhMin, kwhMax,
    }));
  }, [filterType, query, sortKey, sortAsc, dateFrom, dateTo, kwhMin, kwhMax]);

  // debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

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

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      const reading = readings.find(r => r.id === pendingDeleteId);
      if (reading && reading.type === 'ESTIMATED') {
        await removeEstimatedReading(pendingDeleteId);
      } else {
        await deleteReading(pendingDeleteId);
        if (onDelete) onDelete(pendingDeleteId);
      }
    } catch (error) {
      console.error('Failed to delete reading:', error);
    } finally {
      setPendingDeleteId(null);
      setAnnounce('Reading deleted');
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
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
    if (filterType !== 'all' && reading.type !== filterType) return false;
    if (debouncedQuery.trim().length > 0) {
      const q = debouncedQuery.toLowerCase();
      return (
        String(reading.reading).toLowerCase().includes(q) ||
        (reading.notes || '').toLowerCase().includes(q) ||
        reading.type.toLowerCase().includes(q)
      );
    }
    if (dateFrom && reading.date < dateFrom) return false;
    if (dateTo && reading.date > dateTo) return false;
    if (typeof kwhMin === 'number' && reading.reading < kwhMin) return false;
    if (typeof kwhMax === 'number' && reading.reading > kwhMax) return false;
    return true;
  });
  
  const sortedReadings = [...filteredReadings].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    if (sortKey === 'reading') return (a.reading - b.reading) * dir;
    return a.type.localeCompare(b.type) * dir;
  });

  return (
    <Card className="lewis-card lewis-animation-fade-in">
      <span className="sr-only" aria-live="polite" role="status">{announce}</span>
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient">
          Meter Readings Log ({filteredReadings.length} readings)
        </CardTitle>
        <p className="text-sm text-muted-foreground">View and manage all your meter readings</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Search readings, notes or type" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="ESTIMATED">Estimated</SelectItem>
                <SelectItem value="IMPORTED">Imported</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Sort: Date</SelectItem>
                <SelectItem value="reading">Sort: Reading</SelectItem>
                <SelectItem value="type">Sort: Type</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">From: {dateFrom ? dateFrom.toLocaleDateString() : 'Any'}</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <CalendarPicker mode="single" selected={dateFrom} onSelect={(d) => setDateFrom(d || undefined)} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">To: {dateTo ? dateTo.toLocaleDateString() : 'Any'}</Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <CalendarPicker mode="single" selected={dateTo} onSelect={(d) => setDateTo(d || undefined)} />
              </PopoverContent>
            </Popover>
            <Input type="number" step="0.01" placeholder="Min kWh" value={kwhMin ?? ''} onChange={(e) => setKwhMin(e.target.value === '' ? undefined : Number(e.target.value))} />
            <Input type="number" step="0.01" placeholder="Max kWh" value={kwhMax ?? ''} onChange={(e) => setKwhMax(e.target.value === '' ? undefined : Number(e.target.value))} />
            <Button onClick={generateEstimatedReadings} size="sm" className="lewis-button-secondary">Generate Estimated Readings</Button>
            <Button onClick={() => setSortAsc((v) => !v)} variant="ghost" size="sm" className="ml-2"><ArrowUpDown className="h-4 w-4 mr-1" /> Toggle Sort</Button>
            <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); setKwhMin(undefined); setKwhMax(undefined); }}>Clear Filters</Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const rows = sortedReadings.map(r => ({ id: r.id, date: r.date.toISOString().split('T')[0], reading: r.reading, type: r.type, notes: r.notes || '' }));
                const headers = Object.keys(rows[0] || { id: '', date: '', reading: '', type: '', notes: '' });
                const csv = [headers.join(','), ...rows.map(row => headers.map(h => {
                  const v = (row as any)[h];
                  const s = typeof v === 'string' ? v : String(v);
                  return s.includes(',') ? `"${s.replace(/"/g, '""')}"` : s;
                }).join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `meter-readings-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
              }}
            >Export CSV</Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center">
                  <Checkbox
                    checked={sortedReadings.length > 0 && sortedReadings.every(r => selectedIds[r.id])}
                    onCheckedChange={(c) => {
                      const next: Record<string, boolean> = {};
                      if (c) sortedReadings.forEach(r => next[r.id] = true);
                      setSelectedIds(next);
                    }}
                    aria-label="Select all"
                  />
                  <span className="ml-2">Date</span>
                </div>
              </TableHead>
              <TableHead>
                <button className="inline-flex items-center" onClick={() => setSortKey('reading')}>
                  Reading {sortKey === 'reading' && (sortAsc ? '▲' : '▼')}
                </button>
              </TableHead>
              <TableHead>
                <button className="inline-flex items-center" onClick={() => setSortKey('type')}>
                  Type {sortKey === 'type' && (sortAsc ? '▲' : '▼')}
                </button>
              </TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReadings.map((reading, index) => {
              const previousReading = index > 0 ? sortedReadings[index - 1] : undefined;
              const consumption = calculateConsumption(reading, previousReading);
              const cost = calculateCost(consumption);
              return (
                <TableRow key={reading.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!selectedIds[reading.id]}
                      onCheckedChange={(c) => setSelectedIds(prev => ({ ...prev, [reading.id]: Boolean(c) }))}
                      aria-label={`Select reading ${formatDate(reading.date)}`}
                    />
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatDate(reading.date)}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(reading.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Bolt className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{Number(reading.reading).toFixed(2)} kWh</span>
                      {consumption > 0 && (
                        <span className="text-xs text-muted-foreground">(+{consumption.toFixed(2)} kWh, £{cost.toFixed(2)})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reading.type === 'MANUAL' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : reading.type === 'ESTIMATED'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {reading.type}{reading.type === 'ESTIMATED' && ' (Local)'}
                    </span>
                    {reading.isFirstReading && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">First Reading</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[240px]">
                    {editingId === reading.id ? (
                      <div className="flex items-center space-x-2">
                        <Input value={editingNotes} onChange={(e) => setEditingNotes(e.target.value)} className="h-8" />
                        <Button
                          size="sm"
                          onClick={async () => {
                            await updateReading(reading.id, { notes: editingNotes });
                            setEditingId(null); setEditingNotes(''); setAnnounce('Notes updated');
                          }}
                        >Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingId(null); setEditingNotes(''); }}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="truncate">{reading.notes || '-'}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReading(reading)} className="h-8 w-8 lewis-card-hover" title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFirstReading(reading.id)}
                        className={`h-8 w-8 lewis-card-hover ${reading.isFirstReading ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        title={reading.isFirstReading ? 'Unmark as first reading' : 'Mark as first reading'}
                      >
                        <Bolt className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingId(reading.id); setEditingNotes(reading.notes || ''); }}
                        className="h-8 w-8 lewis-card-hover"
                        title="Edit notes"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPendingDeleteId(reading.id)} className="h-8 w-8 lewis-card-hover text-destructive" aria-label="Delete reading">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {Object.values(selectedIds).some(Boolean) && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{Object.values(selectedIds).filter(Boolean).length} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                const ids = Object.entries(selectedIds).filter(([, v]) => v).map(([k]) => k);
                for (const id of ids) {
                  await deleteReading(id);
                }
                setSelectedIds({});
                setAnnounce('Selected readings deleted');
              }}
            >Delete Selected</Button>
          </div>
        )}
        
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
      <MeterReadingsLogDeleteDialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
};

// Delete confirmation dialog mounted at end to avoid layout shifts
export const MeterReadingsLogDeleteDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}> = ({ open, onOpenChange, onConfirm }) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete reading?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the meter reading.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="inline-flex items-center justify-center rounded-md bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
