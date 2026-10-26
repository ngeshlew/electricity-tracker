// UK Electricity Costs API Service
// Based on: https://electricitycosts.org.uk/api-documentation/

export interface UKElectricityPrice {
  Overall: number; // Price in p/kWh
  unixTimestamp: number;
  Timestamp: string; // Format: "HH:MM DD-MM-YYYY"
}

export interface UKElectricityResponse {
  status: 'success' | 'error';
  data: {
    dnoRegion: string;
    voltageLevel: string;
    data: UKElectricityPrice[];
  };
}

export interface DNORegion {
  code: string;
  name: string;
  description: string;
}

export interface TariffInfo {
  id: string;
  provider: string;
  tariffName: string;
  productType: 'Fixed' | 'Variable';
  unitRate: number; // p/kWh
  standingCharge: number; // p/day
  startDate: string;
  endDate?: string;
  paymentMethod: 'Direct Debit' | 'Non-Direct Debit';
  earlyExitFee: number;
  estimatedAnnualUsage: number; // kWh
  estimatedAnnualCost: number; // £
  accountNumber?: string;
  meterNumber?: string;
}

// DNO Regions mapping
export const DNO_REGIONS: DNORegion[] = [
  { code: '10', name: 'Eastern England', description: 'Eastern England region' },
  { code: '11', name: 'East Midlands', description: 'East Midlands region' },
  { code: '12', name: 'London', description: 'London region' },
  { code: '13', name: 'Merseyside and North Wales', description: 'Merseyside and North Wales region' },
  { code: '14', name: 'West Midlands', description: 'West Midlands region' },
  { code: '15', name: 'North East England', description: 'North East England region' },
  { code: '16', name: 'North West England', description: 'North West England region' },
  { code: '17', name: 'Northern Scotland', description: 'Northern Scotland region' },
  { code: '18', name: 'Southern Scotland', description: 'Southern Scotland region' },
  { code: '19', name: 'South East England', description: 'South East England region' },
  { code: '20', name: 'Southern England', description: 'Southern England region' },
  { code: '21', name: 'South Wales', description: 'South Wales region' },
  { code: '22', name: 'South West England', description: 'South West England region' },
  { code: '23', name: 'Yorkshire', description: 'Yorkshire region' },
];

export class UKElectricityApiService {
  private baseUrl = 'https://odegdcpnma.execute-api.eu-west-2.amazonaws.com/development/prices';

  /**
   * Fetch electricity prices for a specific DNO region and voltage level
   * @param dno DNO region code (10-23)
   * @param voltage Voltage level ('HV', 'LV', 'LV-Sub')
   * @param startDate Start date in DD-MM-YYYY format
   * @param endDate End date in DD-MM-YYYY format
   */
  async getElectricityPrices(
    dno: string,
    voltage: 'HV' | 'LV' | 'LV-Sub',
    startDate: string,
    endDate: string
  ): Promise<UKElectricityResponse> {
    const url = `${this.baseUrl}?dno=${dno}&voltage=${voltage}&start=${startDate}&end=${endDate}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UKElectricityResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching UK electricity prices:', error);
      throw error;
    }
  }

  /**
   * Get current electricity price for a specific DNO region
   * @param dno DNO region code
   * @param voltage Voltage level
   */
  async getCurrentPrice(dno: string, voltage: 'HV' | 'LV' | 'LV-Sub'): Promise<UKElectricityPrice | null> {
    const today = new Date();
    const startDate = this.formatDate(today);
    const endDate = this.formatDate(today);

    try {
      const response = await this.getElectricityPrices(dno, voltage, startDate, endDate);
      
      if (response.status === 'success' && response.data.data.length > 0) {
        // Get the most recent price
        return response.data.data[response.data.data.length - 1];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching current price:', error);
      return null;
    }
  }

  /**
   * Get average price for a date range
   * @param dno DNO region code
   * @param voltage Voltage level
   * @param startDate Start date
   * @param endDate End date
   */
  async getAveragePrice(
    dno: string,
    voltage: 'HV' | 'LV' | 'LV-Sub',
    startDate: Date,
    endDate: Date
  ): Promise<number | null> {
    try {
      const response = await this.getElectricityPrices(
        dno,
        voltage,
        this.formatDate(startDate),
        this.formatDate(endDate)
      );

      if (response.status === 'success' && response.data.data.length > 0) {
        const prices = response.data.data.map(item => item.Overall);
        const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        return average;
      }

      return null;
    } catch (error) {
      console.error('Error fetching average price:', error);
      return null;
    }
  }

  /**
   * Format date to DD-MM-YYYY format
   */
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Get DNO region by code
   */
  getDNOByCode(code: string): DNORegion | undefined {
    return DNO_REGIONS.find(region => region.code === code);
  }

  /**
   * Get all DNO regions
   */
  getAllDNORegions(): DNORegion[] {
    return DNO_REGIONS;
  }
}

// Calculate estimated annual cost based on unit rate, standing charge, and annual usage
const calculateAnnualCost = (unitRate: number, standingCharge: number, annualUsage: number): number => {
  const unitCost = (annualUsage * unitRate) / 100; // Convert pence to pounds
  const standingCost = (365 * standingCharge) / 100; // Convert pence to pounds
  return Math.round((unitCost + standingCost) * 100) / 100; // Round to 2 decimal places
};

// Default tariff information based on user's Octopus Energy details
// Source: Octopus statement 447574137 (9 Aug 2026)
export const DEFAULT_TARIFF: TariffInfo = {
  id: 'octopus-12m-fixed-lsc-jul-2026-v5',
  provider: 'Octopus Energy',
  tariffName: 'Octopus 12M Fixed Low Standing Charge July 2026 v5',
  productType: 'Fixed',
  unitRate: 29.23, // p/kWh
  standingCharge: 31.76, // p/day
  startDate: '2026-08-07',
  endDate: '2027-08-07',
  paymentMethod: 'Direct Debit',
  earlyExitFee: 50,
  estimatedAnnualUsage: 1216.4, // kWh
  estimatedAnnualCost: calculateAnnualCost(29.23, 31.76, 1216.4), // Calculated: ~471.47
  accountNumber: 'A-9F8AC8B3',
  meterNumber: 'E17UP00823',
};

// Domestic electricity VAT, most recent first.
// 5% to 0% from 1 Oct 2026 (temporary UK Government cut). Source: Octopus statement 457363936
const VAT_RATES: { from: string; rate: number }[] = [
  { from: '2026-10-01', rate: 0 },
  { from: '1970-01-01', rate: 0.05 },
];

export const getVatRateForDate = (date: Date): number => {
  const match = VAT_RATES.find(({ from }) => date >= new Date(from));
  return match ? match.rate : 0.05;
};

// Seed ids from earlier versions, replaced on store migration
export const LEGACY_SEED_TARIFF_IDS = ['octopus-12m-fixed-aug-2025-v3'];

// Historical tariff information
export const HISTORICAL_TARIFFS: TariffInfo[] = [
  {
    id: 'octopus-12m-fixed-aug-2025-v3-pre-apr-2026',
    provider: 'Octopus Energy',
    tariffName: 'Octopus 12M Fixed August 2025 v3',
    productType: 'Fixed',
    unitRate: 23.96, // p/kWh
    standingCharge: 42.21, // p/day
    startDate: '2025-08-08',
    endDate: '2026-03-31',
    paymentMethod: 'Direct Debit',
    earlyExitFee: 0,
    estimatedAnnualUsage: 1180.1,
    estimatedAnnualCost: calculateAnnualCost(23.96, 42.21, 1180.1), // Calculated: ~436.82
    accountNumber: 'A-9F8AC8B3',
    meterNumber: 'E17UP00823',
  },
  {
    // Same contract, unit rate cut from 1 April 2026 (UK Budget 2025 bill discount).
    // Source: Octopus statements 434390252 to 447574137 (Jun to Aug 2026)
    id: 'octopus-12m-fixed-aug-2025-v3-from-apr-2026',
    provider: 'Octopus Energy',
    tariffName: 'Octopus 12M Fixed August 2025 v3',
    productType: 'Fixed',
    unitRate: 20.62, // p/kWh
    standingCharge: 42.21, // p/day
    startDate: '2026-04-01',
    endDate: '2026-08-06',
    paymentMethod: 'Direct Debit',
    earlyExitFee: 0,
    estimatedAnnualUsage: 1216.4,
    estimatedAnnualCost: calculateAnnualCost(20.62, 42.21, 1216.4), // Calculated: ~404.89
    accountNumber: 'A-9F8AC8B3',
    meterNumber: 'E17UP00823',
  },
  {
    id: 'octopus-flexible-1',
    provider: 'Octopus Energy',
    tariffName: 'Flexible Octopus',
    productType: 'Variable',
    unitRate: 25.95, // p/kWh
    standingCharge: 48.27, // p/day
    startDate: '2025-07-21',
    endDate: '2025-08-01',
    paymentMethod: 'Non-Direct Debit',
    earlyExitFee: 0,
    estimatedAnnualUsage: 1180.1,
    estimatedAnnualCost: calculateAnnualCost(25.95, 48.27, 1180.1), // Calculated: ~482.42
  },
  {
    id: 'octopus-flexible-2',
    provider: 'Octopus Energy',
    tariffName: 'Flexible Octopus',
    productType: 'Variable',
    unitRate: 25.13, // p/kWh
    standingCharge: 42.21, // p/day
    startDate: '2025-08-02',
    endDate: '2025-08-07',
    paymentMethod: 'Direct Debit',
    earlyExitFee: 0,
    estimatedAnnualUsage: 1180.1,
    estimatedAnnualCost: calculateAnnualCost(25.13, 42.21, 1180.1), // Calculated: ~450.63
  },
];

export const ukElectricityApiService = new UKElectricityApiService();
