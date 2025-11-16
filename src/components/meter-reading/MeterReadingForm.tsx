import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Icon } from "@/components/ui/icon";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useElectricityStore } from '../../store/useElectricityStore';
import { cn } from '@/lib/utils';

/**
 * MeterReadingForm Component
 * 
 * A form component for adding new meter readings to the electricity tracker.
 * Features:
 * - Form validation using Zod schema
 * - First reading checkbox (one-time only)
 * - Success/error feedback
 * - Responsive design with Lewis-Linear styling
 * 
 * Uses Shadcn UI: Button component
 * Custom styling: Lewis-Linear design system
 */

// Zod validation schema for meter reading form data
const meterReadingSchema = z.object({
  reading: z
    .number({ message: 'Reading is required' })
    .min(0, 'Reading must be positive')
    .max(999999, 'Reading must be less than 999,999'),
  date: z
    .date({ message: 'Date is required' })
    .refine((date) => {
      // Compare dates at start of day to allow today's date
      // Normalize both dates to start of day in local timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      selectedDate.setMinutes(0);
      selectedDate.setSeconds(0);
      selectedDate.setMilliseconds(0);
      
      // Compare dates - allow today and past dates
      return selectedDate.getTime() <= today.getTime();
    }, {
      message: 'Date cannot be in the future'
    }),
  notes: z.string().optional(),
});

type MeterReadingFormData = z.infer<typeof meterReadingSchema>;

interface MeterReadingFormProps {
  onSuccess: () => void;
}

export const MeterReadingForm: React.FC<MeterReadingFormProps> = ({ onSuccess }) => {
  const { addReading, isLoading, readings } = useElectricityStore();
  
  // State for first reading checkbox - only show if no first reading exists
  const [showFirstReadingCheckbox, setShowFirstReadingCheckbox] = useState(false);
  const [isFirstReading, setIsFirstReading] = useState(false);
  
  // Calculate previous reading and estimate
  const getPreviousReadingAndEstimate = React.useCallback(() => {
    if (readings.length === 0) return { previousReading: 0, estimate: 0 };
    
    // Sort readings by date (most recent first)
    const sortedReadings = [...readings]
      .filter(r => !r.isFirstReading && r.type !== 'ESTIMATED')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedReadings.length === 0) return { previousReading: 0, estimate: 0 };
    
    const lastReading = sortedReadings[0];
    const previousReading = lastReading.reading;
    
    // Calculate estimate based on average daily consumption
    let estimate = previousReading;
    if (sortedReadings.length >= 2) {
      const secondLastReading = sortedReadings[1];
      const daysDiff = Math.ceil(
        (new Date(lastReading.date).getTime() - new Date(secondLastReading.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > 0) {
        const consumption = lastReading.reading - secondLastReading.reading;
        const dailyAverage = consumption / daysDiff;
        // Estimate for today (1 day since last reading)
        estimate = previousReading + dailyAverage;
      }
    }
    
    return { previousReading, estimate: Math.round(estimate * 100) / 100 };
  }, [readings]);

  // React Hook Form setup with validation
  const { previousReading, estimate } = getPreviousReadingAndEstimate();
  const form = useForm<MeterReadingFormData>({
    resolver: zodResolver(meterReadingSchema),
    defaultValues: {
      reading: estimate > previousReading ? estimate : previousReading,
      date: (() => {
        // Normalize default date to start of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
      notes: '',
    },
  });

  // Check if there's already a first reading in the system
  useEffect(() => {
    const hasFirstReading = readings.some(reading => reading.isFirstReading);
    setShowFirstReadingCheckbox(!hasFirstReading);
  }, [readings]);

  // Update form value when readings change
  useEffect(() => {
    const { previousReading, estimate } = getPreviousReadingAndEstimate();
    const newValue = estimate > previousReading ? estimate : previousReading;
    if (newValue > 0) {
      form.setValue('reading', newValue);
    }
  }, [readings, form, getPreviousReadingAndEstimate]);

  // Form submission handler
  const onSubmit = async (data: MeterReadingFormData) => {
    try {
      await addReading({
        meterId: 'default-meter',
        reading: data.reading,
        date: data.date,
        type: 'MANUAL',
        notes: data.notes || '',
        isFirstReading: isFirstReading, // Include first reading flag
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Failed to add meter reading:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meter Reading (kWh)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={previousReading > 0 ? `Previous: ${previousReading.toFixed(2)} | Estimate: ${estimate.toFixed(2)}` : "Enter meter reading"}
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              {previousReading > 0 && (
                <p className="text-xs text-muted-foreground">
                  Previous reading: {previousReading.toFixed(2)} kWh | Estimated: {estimate.toFixed(2)} kWh
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Icon name="calendar-date-appointment" className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        // Normalize date to start of day in local timezone
                        const normalizedDate = new Date(date);
                        normalizedDate.setHours(0, 0, 0, 0);
                        field.onChange(normalizedDate);
                      } else {
                        field.onChange(date);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(23, 59, 59, 999); // End of today
                      return date > today || date < new Date("1900-01-01");
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about this reading"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Reading Checkbox - Only shown if no first reading exists */}
        {showFirstReadingCheckbox && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFirstReading"
              checked={isFirstReading}
              onCheckedChange={(checked) => setIsFirstReading(checked as boolean)}
            />
            <Label htmlFor="isFirstReading">
              This is my first meter reading (move-in reading)
            </Label>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex space-x-4 pt-6 pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isLoading}
            className="flex-1 h-11"
          >
            {form.formState.isSubmitting || isLoading ? 'Adding...' : 'Add Reading'}
          </Button>
        </div>
      </form>
    </Form>
  );
};