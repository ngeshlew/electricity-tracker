import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button-simple';
import { useElectricityStore } from '../../store/useElectricityStore';

const meterReadingSchema = z.object({
  reading: z
    .number({ message: 'Reading is required' })
    .min(0, 'Reading must be positive')
    .max(999999, 'Reading must be less than 999,999'),
  date: z
    .date({ message: 'Date is required' })
    .max(new Date(), 'Date cannot be in the future'),
  notes: z.string().optional(),
});

type MeterReadingFormData = z.infer<typeof meterReadingSchema>;

interface MeterReadingFormProps {
  onSuccess: () => void;
}

export const MeterReadingForm: React.FC<MeterReadingFormProps> = ({ onSuccess }) => {
  const { addReading, isLoading } = useElectricityStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MeterReadingFormData>({
    resolver: zodResolver(meterReadingSchema),
    defaultValues: {
      reading: 0,
      date: new Date(),
      notes: '',
    },
  });

  const onSubmit = async (data: MeterReadingFormData) => {
    try {
      await addReading({
        meterId: 'default-meter',
        reading: data.reading,
        date: data.date,
        type: 'MANUAL',
        notes: data.notes || '',
      });
      
      reset();
      onSuccess();
      
      // Show success message
      alert('Meter reading added successfully!');
    } catch (error) {
      console.error('Failed to add meter reading:', error);
      alert('Failed to add meter reading. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lewis-animation-fade-in">
      <div>
        <label htmlFor="reading" className="block text-sm font-medium text-foreground mb-3">
          Meter Reading (kWh)
        </label>
        <input
          id="reading"
          type="number"
          step="0.01"
          {...register('reading', { valueAsNumber: true })}
          className="lewis-input w-full"
          placeholder="Enter meter reading"
        />
        {errors.reading && (
          <p className="text-sm text-destructive mt-2 lewis-animation-slide-up">{errors.reading.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-foreground mb-3">
          Date
        </label>
        <input
          id="date"
          type="date"
          {...register('date', { valueAsDate: true })}
          className="lewis-input w-full"
        />
        {errors.date && (
          <p className="text-sm text-destructive mt-2 lewis-animation-slide-up">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-3">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="lewis-input w-full resize-none"
          placeholder="Add any notes about this reading"
        />
        {errors.notes && (
          <p className="text-sm text-destructive mt-2 lewis-animation-slide-up">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="flex-1 lewis-card-hover"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="lewis-button-primary flex-1"
        >
          {isSubmitting || isLoading ? 'Adding...' : 'Add Reading'}
        </Button>
      </div>
    </form>
  );
};