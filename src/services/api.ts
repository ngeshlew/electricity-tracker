// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface MeterReading {
  id: string;
  meterId: string;
  reading: number;
  date: string;
  type: 'MANUAL' | 'IMPORTED' | 'ESTIMATED';
  notes?: string;
  isFirstReading?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumptionData {
  date: string;
  kwh: number;
  cost: number;
  readingId: string;
}

export interface AnalyticsSummary {
  totalConsumption: number;
  totalCost: number;
  dailyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  readingCount: number;
  period: {
    start: string | null;
    end: string | null;
  };
}

export interface TrendData {
  period: string;
  totalKwh: number;
  totalCost: number;
  averageDaily: number;
  dataCount: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      };
    }
  }

  // Meter Reading endpoints
  async getMeterReadings(): Promise<ApiResponse<MeterReading[]>> {
    return this.request<MeterReading[]>('/api/meter-readings');
  }

  async getMeterReading(id: string): Promise<ApiResponse<MeterReading>> {
    return this.request<MeterReading>(`/api/meter-readings/${id}`);
  }

  async createMeterReading(reading: Omit<MeterReading, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<MeterReading>> {
    return this.request<MeterReading>('/api/meter-readings', {
      method: 'POST',
      body: JSON.stringify(reading),
    });
  }

  async updateMeterReading(id: string, reading: Partial<MeterReading>): Promise<ApiResponse<MeterReading>> {
    return this.request<MeterReading>(`/api/meter-readings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reading),
    });
  }

  async deleteMeterReading(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/meter-readings/${id}`, {
      method: 'DELETE',
    });
  }

  async getConsumptionAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }): Promise<ApiResponse<ConsumptionData[]>> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.period) searchParams.append('period', params.period);

    const queryString = searchParams.toString();
    const endpoint = `/api/meter-readings/analytics/consumption${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ConsumptionData[]>(endpoint);
  }

  // Analytics endpoints
  async getAnalyticsSummary(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<AnalyticsSummary>> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const queryString = searchParams.toString();
    const endpoint = `/api/analytics/summary${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AnalyticsSummary>(endpoint);
  }

  async getTrendAnalytics(period: string = 'monthly'): Promise<ApiResponse<TrendData[]>> {
    return this.request<TrendData[]>(`/api/analytics/trends?period=${period}`);
  }

  async exportAnalytics(format: 'json' | 'csv' = 'json', params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<ConsumptionData[]> | Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append('format', format);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);

    const queryString = searchParams.toString();
    const endpoint = `/api/analytics/export?${queryString}`;
    
    if (format === 'csv') {
      // For CSV, return the blob directly
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      return response.blob();
    }
    
    return this.request<ConsumptionData[]>(endpoint);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
  }>> {
    return this.request('/health');
  }

  // Statements endpoints
  async uploadStatements(files: File[]): Promise<ApiResponse<any>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`${this.baseURL}/api/analytics/statements/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
      return data;
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  async listStatements(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/analytics/statements');
  }

  async deleteStatement(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/analytics/statements/${id}`, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
