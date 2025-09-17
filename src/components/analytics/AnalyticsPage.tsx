import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  Target,
  Zap,
  DollarSign
} from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';
import { ConsumptionChart } from '../dashboard/ConsumptionChart';
import { MonthlyOverview } from '../dashboard/MonthlyOverview';
import { ConsumptionBreakdown } from '../dashboard/ConsumptionBreakdown';
import { SeasonalAnalytics } from './SeasonalAnalytics';
import { TariffAnalytics } from './TariffAnalytics';

export const AnalyticsPage: React.FC = () => {
  const { readings, chartData, timeSeriesData, isLoading } = useElectricityStore();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedView, setSelectedView] = useState('consumption');

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (readings.length === 0) return null;

    const totalConsumption = readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0);
    const totalCost = readings.reduce((sum, reading) => sum + (reading.cost || 0), 0);
    const avgDailyConsumption = totalConsumption / readings.length;
    const avgDailyCost = totalCost / readings.length;

    // UK average data
    const ukAverageDaily = 8.5; // kWh
    const ukAverageCost = 2.55; // £
    
    const efficiencyRatio = avgDailyConsumption / ukAverageDaily;
    const costRatio = avgDailyCost / ukAverageCost;

    // Trend analysis
    const recentReadings = readings.slice(-7);
    const olderReadings = readings.slice(-14, -7);
    
    const recentAvg = recentReadings.reduce((sum, r) => sum + (r.consumption || 0), 0) / recentReadings.length;
    const olderAvg = olderReadings.length > 0 
      ? olderReadings.reduce((sum, r) => sum + (r.consumption || 0), 0) / olderReadings.length 
      : recentAvg;

    const trendPercentage = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    return {
      totalConsumption,
      totalCost,
      avgDailyConsumption,
      avgDailyCost,
      efficiencyRatio,
      costRatio,
      trendPercentage,
      ukAverageDaily,
      ukAverageCost
    };
  };

  const analytics = calculateAnalytics();

  // Get trend color and icon
  const getTrendData = (trend: number) => {
    if (trend > 5) {
      return { color: 'text-red-500', icon: TrendingUp, label: 'Increasing' };
    } else if (trend < -5) {
      return { color: 'text-green-500', icon: TrendingUp, label: 'Decreasing' };
    } else {
      return { color: 'text-yellow-500', icon: TrendingUp, label: 'Stable' };
    }
  };

  const trendData = analytics ? getTrendData(analytics.trendPercentage) : null;

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced analytics and insights into your electricity consumption patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalConsumption.toFixed(1)} kWh</div>
              <p className="text-xs text-muted-foreground">
                {analytics.avgDailyConsumption.toFixed(1)} kWh/day average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{analytics.totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                £{analytics.avgDailyCost.toFixed(2)}/day average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">vs UK Average</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.efficiencyRatio > 1 ? '+' : ''}
                {((analytics.efficiencyRatio - 1) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.efficiencyRatio > 1 ? 'Above' : 'Below'} average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend</CardTitle>
              {trendData && <trendData.icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${trendData?.color}`}>
                {analytics.trendPercentage > 0 ? '+' : ''}{analytics.trendPercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {trendData?.label} trend
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tabs */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="comparison">UK Comparison</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="tariff">Tariff</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-6">
          <ConsumptionChart />
          <MonthlyOverview />
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <ConsumptionBreakdown />
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of your electricity costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics && (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Average Daily Cost</span>
                      <span className="font-semibold">£{analytics.avgDailyCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cost per kWh</span>
                      <span className="font-semibold">£{(analytics.totalCost / analytics.totalConsumption).toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>vs UK Average Cost</span>
                      <span className={`font-semibold ${analytics.costRatio > 1 ? 'text-red-500' : 'text-green-500'}`}>
                        {analytics.costRatio > 1 ? '+' : ''}{((analytics.costRatio - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>UK Average Comparison</CardTitle>
              <CardDescription>
                How your consumption compares to UK household averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Daily Consumption</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Your Average</span>
                          <span className="font-semibold">{analytics.avgDailyConsumption.toFixed(1)} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>UK Average</span>
                          <span className="font-semibold">{analytics.ukAverageDaily} kWh</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (analytics.efficiencyRatio * 50))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Daily Cost</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Your Average</span>
                          <span className="font-semibold">£{analytics.avgDailyCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>UK Average</span>
                          <span className="font-semibold">£{analytics.ukAverageCost}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (analytics.costRatio * 50))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          <SeasonalAnalytics />
        </TabsContent>

        <TabsContent value="tariff" className="space-y-6">
          <TariffAnalytics />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Forecast</CardTitle>
              <CardDescription>
                AI-powered predictions based on your consumption patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Forecasting Coming Soon</h3>
                <p className="text-muted-foreground">
                  AI-powered consumption forecasting will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
