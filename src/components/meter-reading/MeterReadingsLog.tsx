import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, X, MoreHorizontal, Zap } from "lucide-react";
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
          <CardTitle>Meter Readings Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent  animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading readings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (readings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meter Readings Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No meter readings found</p>
            <p className="text-xs text-muted-foreground mt-2">
              Add your first reading to start tracking your electricity consumption
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedReadings = [...readings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading History</CardTitle>
        <CardDescription>
          View and manage all your meter readings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableCaption>Your meter reading history</TableCaption>
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
                    <Badge variant={reading.type === "MANUAL" ? "default" : "secondary"}>
                      {reading.type === "MANUAL" ? "Manual" : "Estimated"}
                    </Badge>
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
