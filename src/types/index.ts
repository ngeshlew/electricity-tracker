// Core data types for the Electricity Tracker application

export interface MeterReading {
  id: string;
  meterId: string;
  reading: number;
  date: Date;
  type: 'MANUAL' | 'IMPORTED';
  notes?: string;
  isFirstReading?: boolean; // Flag to mark the initial move-in reading
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyStatement {
  id: string;
  supplier: string;
  periodStart: Date;
  periodEnd: Date;
  totalKwh: number;
  totalCost: number;
  unitRate: number;
  standingCharge: number;
  fileUrl?: string;
  importedAt: Date;
}

export interface ConsumptionData {
  period: 'daily' | 'weekly' | 'monthly';
  date: Date;
  kwh: number;
  cost: number;
  averageDailyUsage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'dark' | 'light';
  currency: 'GBP' | 'USD' | 'EUR';
  unitRate: number;
  standingCharge: number;
  notifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  entityType: 'meter_reading' | 'energy_statement' | 'user_preferences';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, unknown>;
  userId: string;
  timestamp: Date;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  kwh: number;
  cost: number;
  label?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface TimeSeriesData {
  period: string;
  data: ChartDataPoint[];
  totalKwh: number;
  totalCost: number;
  averageDaily: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Form types
export interface MeterReadingForm {
  reading: number;
  date: Date;
  notes?: string;
}

export interface EnergyStatementForm {
  supplier: string;
  periodStart: Date;
  periodEnd: Date;
  totalKwh: number;
  totalCost: number;
  unitRate: number;
  standingCharge: number;
  file?: File;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// UI state types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface DashboardState {
  currentMonth: TimeSeriesData;
  previousMonth: TimeSeriesData;
  totalKwh: number;
  totalCost: number;
  averageDaily: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface MeterReadingState {
  readings: MeterReading[];
  isLoading: boolean;
  error: string | null;
  selectedReading: MeterReading | null;
  isPanelOpen: boolean;
}

export interface AnalyticsState {
  timeSeriesData: TimeSeriesData[];
  pieChartData: PieChartData[];
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  selectedDateRange: {
    start: Date;
    end: Date;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event types
export interface MeterReadingEvent {
  type: 'reading_added' | 'reading_updated' | 'reading_deleted';
  reading: MeterReading;
  timestamp: Date;
}

export interface AnalyticsEvent {
  type: 'period_changed' | 'chart_interacted' | 'data_exported';
  data: unknown;
  timestamp: Date;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    realTimeUpdates: boolean;
    dataExport: boolean;
    analytics: boolean;
    notifications: boolean;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Constants
export const METER_READING_TYPES = {
  MANUAL: 'manual',
  IMPORTED: 'imported',
} as const;

export const CONSUMPTION_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const TREND_TYPES = {
  INCREASING: 'increasing',
  DECREASING: 'decreasing',
  STABLE: 'stable',
} as const;

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export const CURRENCIES = {
  GBP: 'GBP',
  USD: 'USD',
  EUR: 'EUR',
} as const;
