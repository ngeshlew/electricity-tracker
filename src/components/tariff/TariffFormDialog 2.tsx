import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TariffForm } from './TariffForm';
import { TariffInfo } from '@/services/ukElectricityApi';
import { useTariffStore } from '@/store/useTariffStore';
import { useToastStore } from '@/store/useToastStore';

interface TariffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff?: TariffInfo;
}

export const TariffFormDialog: React.FC<TariffFormDialogProps> = ({
  open,
  onOpenChange,
  tariff,
}) => {
  const { addHistoricalTariff, setCurrentTariff, updateTariff } = useTariffStore();
  const { showToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    provider: string;
    tariffName: string;
    productType: 'Fixed' | 'Variable';
    unitRate: number;
    standingCharge: number;
    startDate: string;
    endDate?: string;
    paymentMethod: 'Direct Debit' | 'Non-Direct Debit';
    earlyExitFee: number;
    accountNumber?: string;
    meterNumber?: string;
    estimatedAnnualUsage?: number;
    estimatedAnnualCost?: number;
  }) => {
    setIsLoading(true);
    try {
      const tariffData: TariffInfo = {
        id: tariff?.id || `tariff-${Date.now()}`,
        provider: data.provider,
        tariffName: data.tariffName,
        productType: data.productType,
        unitRate: data.unitRate,
        standingCharge: data.standingCharge,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentMethod: data.paymentMethod,
        earlyExitFee: data.earlyExitFee,
        accountNumber: data.accountNumber,
        meterNumber: data.meterNumber,
        estimatedAnnualUsage: data.estimatedAnnualUsage || 1180.1,
        estimatedAnnualCost: data.estimatedAnnualCost || 0,
      };

      if (tariff) {
        // Update existing tariff
        updateTariff(tariff.id, tariffData);
        showToast('Tariff Updated: Your tariff has been updated successfully.');
      } else {
        // Add new tariff
        if (data.endDate) {
          // Historical tariff
          addHistoricalTariff(tariffData);
          showToast('Tariff Added: Historical tariff has been added successfully.');
        } else {
          // Current tariff - archive previous one
          setCurrentTariff(tariffData);
          showToast('Current Tariff Updated: Your current tariff has been updated. Previous tariff has been archived.');
        }
      }

      onOpenChange(false);
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Failed to save tariff.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tariff ? 'Edit Tariff' : 'Add New Tariff'}</DialogTitle>
          <DialogDescription>
            {tariff
              ? 'Update your tariff information below.'
              : 'Enter your tariff details to track your energy costs accurately.'}
          </DialogDescription>
        </DialogHeader>
        <TariffForm
          tariff={tariff}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

