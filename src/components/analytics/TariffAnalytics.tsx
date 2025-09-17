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

  Area,
  AreaChart
} from 'recharts';
import { 
CreditCard, 
TrendingUp,
AlertTriangle,
Clock,
DollarSign,
Zap,
Building2,
FileText,
Target
} from "lucide-react";
import { useTariffStore } from '../../store/useTariffStore';
import { useElectricityStore } from '../../store/useElectricityStore';
import { ukElectricityApiService, DNO_REGIONS } from '../../services/ukElectricityApi';

interface TariffComparison {
  period: string;
  currentTariff: number;
  previousTariff: number;
  savings: number;
  savingsPercentage: number;
}

export const TariffAnalytics: React.FC = () => {
  const { 
    currentTariff, 
    historicalTariffs, 
    getTariffForDate, 
    calculateCostForPeriod,
    getAnnualTargets 
  } = useTariffStore();
  const { readings } = useElectricityStore();
  const [ukPrices, setUkPrices] = useState<any[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [selectedDNO, setSelectedDNO] = useState('12'); // Default to London
  const [priceComparison, setPriceComparison] = useState<TariffComparison[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // removed unused totalCost

  // Fetch UK electricity prices
  useEffect(() => {
    const fetchUKPrices = async () => {
      setIsLoadingPrices(true);
      try {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        const response = await ukElectricityApiService.getElectricityPrices(
          selectedDNO,
          'LV',
          ukElectricityApiService['formatDate'](lastMonth),
          ukElectricityApiService['formatDate'](today)
        );
        
        if (response.status === 'success') {
          setUkPrices(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch UK prices:', error);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchUKPrices();
  }, [selectedDNO]);

  // Calculate tariff comparisons
  useEffect(() => {
    if (readings.length === 0) return;

    const comparisons: TariffComparison[] = [];
    const monthlyGroups = readings.reduce((groups, reading) => {
      const date = new Date(reading.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(reading);
      
      return groups;
    }, {} as { [key: string]: any[] });

    Object.entries(monthlyGroups).forEach(([month, monthReadings]) => {
      const totalConsumption = monthReadings.reduce((sum, r) => sum + (r.consumption || 0), 0);
      // const totalCost = monthReadings.reduce((sum, r) => sum + (r.cost || 0), 0);
      
      // Get tariff for this month
      const tariff = getTariffForDate(new Date(month + '-01'));
      if (!tariff) return;

      // Calculate what it would cost with current tariff
      const currentCost = calculateCostForPeriod(
        new Date(month + '-01'),
        new Date(month + '-31'),
        totalConsumption
      );

      // Calculate what it would cost with previous tariff (if available)
      const previousTariff = historicalTariffs.find(t => 
        new Date(t.startDate) <= new Date(month + '-01') && 
        new Date(t.endDate || '9999-12-31') >= new Date(month + '-01')
      );

      if (previousTariff) {
        const previousCost = calculateCostForPeriod(
          new Date(month + '-01'),
          new Date(month + '-31'),
          totalConsumption
        );

        const savings = previousCost - currentCost;
        const savingsPercentage = (savings / previousCost) * 100;

        comparisons.push({
          period: month,
          currentTariff: currentCost,
          previousTariff: previousCost,
          savings,
          savingsPercentage
        });
      }
    });

    setPriceComparison(comparisons.sort((a, b) => a.period.localeCompare(b.period)));
  }, [readings, currentTariff, historicalTariffs, getTariffForDate, calculateCostForPeriod]);

  // Calculate cost impact of tariff changes
  const calculateTariffImpact = () => {
    if (priceComparison.length === 0) return { totalSavings: 0, averageSavings: 0 };
    
    const totalSavings = priceComparison.reduce((sum, comp) => sum + comp.savings, 0);
    const averageSavings = totalSavings / priceComparison.length;
    
    return { totalSavings, averageSavings };
  };

  const impact = calculateTariffImpact();
  const annualTargets = getAnnualTargets();

  // Calculate current year progress
  const currentYear = new Date().getFullYear();
  const yearReadings = readings.filter(r => new Date(r.date).getFullYear() === currentYear);
  const yearConsumption = yearReadings.reduce((sum, r) => sum + (r.consumption || 0), 0);
  const yearCost = yearReadings.reduce((sum, r) => sum + (r.cost || 0), 0);

  const usageProgress = (yearConsumption / annualTargets.usage) * 100;
  const costProgress = (yearCost / annualTargets.cost) * 100;

  // Prepare chart data
  const chartData = priceComparison.map(comp => ({
    period: comp.period,
    current: comp.currentTariff,
    previous: comp.previousTariff,
    savings: comp.savings
  }));

  return (
    <div className="space-y-6">
      {/* Current Tariff Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
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
                <Building2 className="h-4 w-4" />
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
                <Zap className="h-4 w-4" />
                <span className="font-semibold">{currentTariff.unitRate}p/kWh</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Standing Charge</div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
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

      {/* Annual Target Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Annual Usage Target
            </CardTitle>
            <CardDescription>
              {yearConsumption.toFixed(1)} kWh of {annualTargets.usage.toFixed(1)} kWh target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{usageProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usageProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {annualTargets.usage.toFixed(1)} kWh</span>
                <span>
                  {usageProgress > 100 ? 'Over target' : 'On track'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Annual Cost Target
            </CardTitle>
            <CardDescription>
              £{yearCost.toFixed(2)} of £{annualTargets.cost.toFixed(2)} target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{costProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(costProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: £{annualTargets.cost.toFixed(2)}</span>
                <span>
                  {costProgress > 100 ? 'Over budget' : 'On budget'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tariff Impact Analysis */}
      {priceComparison.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tariff Change Impact
            </CardTitle>
            <CardDescription>
              Cost savings from your recent tariff changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  £{impact.totalSavings.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  £{impact.averageSavings.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Average Monthly Savings</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {priceComparison.length}
                </div>
                <div className="text-sm text-muted-foreground">Months Analyzed</div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Cost (£)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `£${Number(value).toFixed(2)}`, 
                      name === 'current' ? 'Current Tariff' : 
                      name === 'previous' ? 'Previous Tariff' : 'Savings'
                    ]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    name="previous"
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="current"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* UK Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No UK price data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
