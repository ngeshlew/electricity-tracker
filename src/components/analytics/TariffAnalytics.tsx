import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Icon } from "@/components/ui/icon";
import { useTariffStore } from '../../store/useTariffStore';
import { ukElectricityApiService, DNO_REGIONS } from '../../services/ukElectricityApi';

export const TariffAnalytics: React.FC = () => {
  const { currentTariff } = useTariffStore();
  const [ukPrices, setUkPrices] = useState<any[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [selectedDNO, setSelectedDNO] = useState('12'); // Default to London

  // Fetch UK electricity prices
  useEffect(() => {
    const fetchUKPrices = async () => {
      setIsLoadingPrices(true);
      try {
        const today = new Date();
        // Use a wider date range to ensure we get data
        const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        
        const startDateStr = ukElectricityApiService.formatDate(startDate);
        const endDateStr = ukElectricityApiService.formatDate(today);
        
        console.log('Fetching UK prices:', { selectedDNO, startDateStr, endDateStr });
        
        const response = await ukElectricityApiService.getElectricityPrices(
          selectedDNO,
          'LV',
          startDateStr,
          endDateStr
        );
        
        console.log('UK prices API response:', response);
        
        if (response.status === 'success' && response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setUkPrices(response.data.data);
        } else {
          console.warn('UK prices API returned unsuccessful response or empty data:', response);
          setUkPrices([]);
        }
      } catch (error) {
        console.error('Failed to fetch UK prices:', error);
        setUkPrices([]);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchUKPrices();
  }, [selectedDNO]);

  return (
    <div className="space-y-6">
      {/* Current Tariff Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="dollar-currency" className="h-5 w-5" />
            Current Tariff Information
          </CardTitle>
          <CardDescription>
            Your active energy tariff and account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Provider</div>
              <div className="flex items-center gap-2">
                <Icon name="info" className="h-4 w-4" />
                <span className="font-semibold">{currentTariff.provider}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Tariff Name</div>
              <div className="font-semibold">{currentTariff.tariffName}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Unit Rate</div>
              <div className="flex items-center gap-1">
                <Icon name="lightning-energy" className="h-4 w-4" />
                <span className="font-semibold">{currentTariff.unitRate}p/kWh</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Standing Charge</div>
              <div className="flex items-center gap-1">
                <Icon name="clock-time" className="h-4 w-4" />
                <span className="font-semibold">{currentTariff.standingCharge}p/day</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                <div className="font-mono text-sm">{currentTariff.accountNumber || 'Not set'}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Meter Number</div>
                <div className="font-mono text-sm">{currentTariff.meterNumber || 'Not set'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UK Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="book-note-paper" className="h-5 w-5" />
            UK Electricity Price Comparison
          </CardTitle>
          <CardDescription>
            Compare your tariff with UK average prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">DNO Region:</label>
              <select
                value={selectedDNO}
                onChange={(e) => setSelectedDNO(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {DNO_REGIONS.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.code} - {region.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingPrices ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading UK prices...</p>
              </div>
            ) : ukPrices.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {ukPrices[ukPrices.length - 1]?.Overall.toFixed(2)}p
                    </div>
                    <div className="text-sm text-muted-foreground">Current UK Price</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {currentTariff.unitRate.toFixed(2)}p
                    </div>
                    <div className="text-sm text-muted-foreground">Your Unit Rate</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      currentTariff.unitRate < ukPrices[ukPrices.length - 1]?.Overall 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {((currentTariff.unitRate - ukPrices[ukPrices.length - 1]?.Overall) / ukPrices[ukPrices.length - 1]?.Overall * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentTariff.unitRate < ukPrices[ukPrices.length - 1]?.Overall 
                        ? 'Below UK Average' 
                        : 'Above UK Average'}
                    </div>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ukPrices.slice(-30)}> {/* Last 30 data points */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="Timestamp" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.split(' ')[0]} // Show only date
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Price (p/kWh)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}p/kWh`, 'UK Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Overall" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="alert-error" className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No UK price data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
