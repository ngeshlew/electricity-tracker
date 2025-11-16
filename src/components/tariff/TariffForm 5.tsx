import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon';
import { TariffInfo } from '@/services/ukElectricityApi';
import { format } from 'date-fns';

const tariffFormSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  tariffName: z.string().min(1, 'Tariff name is required'),
  productType: z.enum(['Fixed', 'Variable']),
  unitRate: z.number().positive('Unit rate must be positive'),
  standingCharge: z.number().positive('Standing charge must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  paymentMethod: z.enum(['Direct Debit', 'Non-Direct Debit']),
  earlyExitFee: z.number().min(0, 'Early exit fee cannot be negative'),
  accountNumber: z.string().optional(),
  meterNumber: z.string().optional(),
  estimatedAnnualUsage: z.number().positive('Estimated annual usage must be positive').optional(),
  estimatedAnnualCost: z.number().positive('Estimated annual cost must be positive').optional(),
}).refine((data) => {
  if (data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

type TariffFormValues = z.infer<typeof tariffFormSchema>;

interface TariffFormProps {
  tariff?: TariffInfo;
  onSubmit: (data: TariffFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TariffForm: React.FC<TariffFormProps> = ({
  tariff,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<TariffFormValues>({
    resolver: zodResolver(tariffFormSchema),
    defaultValues: tariff
      ? {
          provider: tariff.provider,
          tariffName: tariff.tariffName,
          productType: tariff.productType,
          unitRate: tariff.unitRate,
          standingCharge: tariff.standingCharge,
          startDate: format(new Date(tariff.startDate), 'yyyy-MM-dd'),
          endDate: tariff.endDate ? format(new Date(tariff.endDate), 'yyyy-MM-dd') : undefined,
          paymentMethod: tariff.paymentMethod,
          earlyExitFee: tariff.earlyExitFee,
          accountNumber: tariff.accountNumber || '',
          meterNumber: tariff.meterNumber || '',
          estimatedAnnualUsage: tariff.estimatedAnnualUsage,
          estimatedAnnualCost: tariff.estimatedAnnualCost,
        }
      : {
          provider: '',
          tariffName: '',
          productType: 'Variable',
          unitRate: 0,
          standingCharge: 0,
          startDate: format(new Date(), 'yyyy-MM-dd'),
          endDate: undefined,
          paymentMethod: 'Direct Debit',
          earlyExitFee: 0,
          accountNumber: '',
          meterNumber: '',
          estimatedAnnualUsage: 1180.1,
          estimatedAnnualCost: 0,
        },
  });

  const handleSubmit = (data: TariffFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Octopus Energy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tariffName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tariff Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Flexible Octopus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                    <SelectItem value="Non-Direct Debit">Non-Direct Debit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Unit Rate (p/kWh)
                  <Icon name="help-question-mark" className="h-3 w-3 ml-1 inline" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="25.16"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Price per kilowatt-hour in pence
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="standingCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Standing Charge (p/day)
                  <Icon name="help-question-mark" className="h-3 w-3 ml-1 inline" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="44.32"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Daily fixed charge in pence
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty if this is your current tariff
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="earlyExitFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Early Exit Fee (£)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedAnnualUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Annual Usage (kWh)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="1180.1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meterNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter Number</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icon name="loading-spinner" className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : tariff ? (
              'Update Tariff'
            ) : (
              'Add Tariff'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

