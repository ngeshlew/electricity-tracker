import { EnergyStatement } from '@/types';
import { TariffInfo } from '@/services/ukElectricityApi';
import { useTariffStore } from '@/store/useTariffStore';

/**
 * Convert an EnergyStatement to TariffInfo
 */
export const convertStatementToTariff = (statement: EnergyStatement): TariffInfo => {
  return {
    id: `tariff-statement-${statement.id}`,
    provider: statement.supplier,
    tariffName: `${statement.supplier} Statement Tariff`,
    productType: 'Variable',
    unitRate: statement.unitRate,
    standingCharge: statement.standingCharge,
    startDate: statement.periodStart.toISOString().split('T')[0],
    endDate: statement.periodEnd.toISOString().split('T')[0],
    paymentMethod: 'Direct Debit',
    earlyExitFee: 0,
    estimatedAnnualUsage: 1180.1,
    estimatedAnnualCost: 0,
  };
};

/**
 * Create tariff from statement and add to tariff store
 */
export const createTariffFromStatement = (statement: EnergyStatement): void => {
  const tariffStore = useTariffStore.getState();
  const tariff = convertStatementToTariff(statement);

  // Check if this is current or historical
  const today = new Date();
  if (new Date(statement.periodEnd) >= today) {
    tariffStore.setCurrentTariff(tariff);
  } else {
    tariffStore.addHistoricalTariff(tariff);
  }
};

/**
 * Check if statement period overlaps with existing tariffs
 */
export const checkStatementOverlap = (statement: EnergyStatement): boolean => {
  const tariffStore = useTariffStore.getState();
  const startDate = statement.periodStart.toISOString().split('T')[0];
  const endDate = statement.periodEnd.toISOString().split('T')[0];
  
  return tariffStore.checkDateOverlap(startDate, endDate);
};

