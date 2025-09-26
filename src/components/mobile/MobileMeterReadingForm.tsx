import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  Calculator, 
  Zap, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { useElectricityStore } from '../../store/useElectricityStore';
import { useTariffStore } from '../../store/useTariffStore';

interface MobileMeterReadingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMeterReadingForm: React.FC<MobileMeterReadingFormProps> = ({
  isOpen,
  onClose
}) => {
  const { addReading, readings, error } = useElectricityStore();
  const { currentTariff } = useTariffStore();
  
  const [formData, setFormData] = useState<{
    reading: string;
    date: Date;
    type: 'MANUAL' | 'ESTIMATED';
    notes: string;
  }>({
    reading: '',
    date: new Date(),
    type: 'MANUAL',
    notes: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated cost
  const calculateCost = (reading: number) => {
    if (!reading || reading <= 0) return 0;
    
    const lastReading = readings
      .filter(r => r.type === 'MANUAL')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!lastReading) return 0;
    
    const consumption = reading - lastReading.reading;
    if (consumption <= 0) return 0;
    
    // Calculate cost based on current tariff
    const unitRate = currentTariff.unitRate / 100; // Convert pence to pounds
    const standingCharge = currentTariff.standingCharge / 100; // Convert pence to pounds
    const days = Math.ceil((new Date().getTime() - new Date(lastReading.date).getTime()) / (1000 * 60 * 60 * 24));
    
    return (consumption * unitRate) + (days * standingCharge);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reading || isNaN(Number(formData.reading))) return;

    setIsSubmitting(true);
    try {
      await addReading({
        meterId: 'default',
        reading: Number(formData.reading),
        date: formData.date,
        type: formData.type,
        notes: formData.notes || undefined
      });
      
      // Reset form
      setFormData({
        reading: '',
        date: new Date(),
        type: 'MANUAL',
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to add reading:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedCost = calculateCost(Number(formData.reading));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background lg:hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-9 w-9 p-0"
        >
          ×
        </Button>
        <h2 className="text-lg font-semibold">Add Meter Reading</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reading Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Meter Reading
              </CardTitle>
              <CardDescription>
                Enter your current meter reading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reading">Reading (kWh)</Label>
                <Input
                  id="reading"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.reading}
                  onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
                  placeholder="Enter reading"
                  className="text-lg h-12"
                  autoFocus
                />
              </div>

              {/* Cost Estimation */}
              {formData.reading && !isNaN(Number(formData.reading)) && (
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estimated Cost</span>
                    <span className="text-lg font-bold">£{estimatedCost.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on current tariff: {currentTariff.unitRate}p/kWh
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Reading Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, date: new Date(date) });
                        setShowCalendar(false);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      return date > today || date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Reading Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Reading Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.type}
                onValueChange={(value: 'MANUAL' | 'ESTIMATED') => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANUAL">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Manual Reading
                    </div>
                  </SelectItem>
                  <SelectItem value="ESTIMATED">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Estimated Reading
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about this reading"
                className="h-12"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={!formData.reading || isNaN(Number(formData.reading)) || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Reading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Add Reading
                </div>
              )}
            </Button>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
