import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { MeterReadingForm as MeterReadingFormType } from '../../types';

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

interface MeterReadingFormProps {
  onSuccess: () => void;
}

export const MeterReadingForm: React.FC<MeterReadingFormProps> = ({
  onSuccess
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<MeterReadingFormType>({
    resolver: zodResolver(meterReadingSchema),
    defaultValues: {
      reading: 0,
      date: new Date(),
      notes: ''
    }
  });

  const onSubmit = async (data: MeterReadingFormType) => {
    try {
      // TODO: Implement actual API call
      console.log('Submitting meter reading:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close panel
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting meter reading:', error);
    }
  };

  const selectedDate = watch('date');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = selectedDate && 
    selectedDate.toDateString() === today.toDateString();
  const isYesterday = selectedDate && 
    selectedDate.toDateString() === yesterday.toDateString();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Date
        </label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                // This would need to be implemented with react-hook-form's setValue
              }}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                isToday
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-dark-700 text-dark-200 border-dark-600 hover:bg-dark-600'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(0, 0, 0, 0);
                // This would need to be implemented with react-hook-form's setValue
              }}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                isYesterday
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-dark-700 text-dark-200 border-dark-600 hover:bg-dark-600'
              }`}
            >
              Yesterday
            </button>
          </div>
          <input
            type="date"
            {...register('date', { valueAsDate: true })}
            className={`input w-full ${errors.date ? 'border-red-500' : ''}`}
            max={today.toISOString().split('T')[0]}
          />
          {errors.date && (
            <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>
      </div>

      {/* Meter Reading */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Meter Reading (kWh)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="999999"
          {...register('reading', { valueAsNumber: true })}
          className={`input w-full ${errors.reading ? 'border-red-500' : ''}`}
          placeholder="Enter meter reading"
        />
        {errors.reading && (
          <p className="text-red-400 text-sm mt-1">{errors.reading.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="input w-full resize-none"
          placeholder="Add any notes about this reading..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onSuccess}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Adding...
            </>
          ) : (
            'Add Reading'
          )}
        </button>
      </div>
    </form>
  );
};
