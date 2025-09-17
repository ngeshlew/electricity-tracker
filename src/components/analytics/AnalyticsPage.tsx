import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Target,
  Zap,
  DollarSign,
  HelpCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useElectricityStore } from '../../store/useElectricityStore';
import { ConsumptionChart } from '../dashboard/ConsumptionChart';
import { MonthlyOverview } from '../dashboard/MonthlyOverview';
import { ConsumptionBreakdown } from '../dashboard/ConsumptionBreakdown';
import { SeasonalAnalytics } from './SeasonalAnalytics';
import { TariffAnalytics } from './TariffAnalytics';

export const AnalyticsPage: React.FC = () => {
  const { chartData } = useElectricityStore();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedView, setSelectedView] = useState('consumption');

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (chartData.length === 0) return null;

    const totalConsumption = chartData.reduce((sum, point) => sum + point.kwh, 0);
    const totalCost = chartData.reduce((sum, point) => sum + point.cost, 0);
    const avgDailyConsumption = totalConsumption / chartData.length;
    const avgDailyCost = totalCost / chartData.length;

    // UK average data
    const ukAverageDaily = 8.5; // kWh
    const ukAverageCost = 2.55; // £
    
    const efficiencyRatio = avgDailyConsumption / ukAverageDaily;
    const costRatio = avgDailyCost / ukAverageCost;

    // Trend analysis
    const recentData = chartData.slice(-7);
    const olderData = chartData.slice(-14, -7);
    
    const recentAvg = recentData.reduce((sum, point) => sum + point.kwh, 0) / recentData.length;
    const olderAvg = olderData.length > 0 
      ? olderData.reduce((sum, point) => sum + point.kwh, 0) / olderData.length 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
          <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
              <div className="flex items-center gap-1">
                <div className="text-muted-foreground text-xs">
                  Total Consumption
                </div>
                <Zap className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-lg tabular-nums">
                {analytics.totalConsumption.toFixed(1)} kWh
              </div>
            </CardHeader>
            <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
              <div className="text-muted-foreground text-xs">
                {analytics.avgDailyConsumption.toFixed(1)} kWh/day average
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
              <div className="flex items-center gap-1">
                <div className="text-muted-foreground text-xs">
                  Total Cost
                </div>
                <DollarSign className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-lg tabular-nums">
                £{analytics.totalCost.toFixed(2)}
              </div>
            </CardHeader>
            <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
              <div className="text-muted-foreground text-xs">
                £{analytics.avgDailyCost.toFixed(2)}/day average
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
              <div className="flex items-center gap-1">
                <div className="text-muted-foreground text-xs">
                  vs UK Average
                </div>
                <Target className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-lg tabular-nums">
                {analytics.efficiencyRatio > 1 ? '+' : ''}
                {((analytics.efficiencyRatio - 1) * 100).toFixed(0)}%
              </div>
            </CardHeader>
            <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
              <div className="text-muted-foreground text-xs">
                {analytics.efficiencyRatio > 1 ? 'Above' : 'Below'} average
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
              <div className="flex items-center gap-1">
                <div className="text-muted-foreground text-xs">
                  Trend
                </div>
                {trendData && <trendData.icon className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className={`text-lg tabular-nums ${trendData?.color}`}>
                {analytics.trendPercentage > 0 ? '+' : ''}{analytics.trendPercentage.toFixed(1)}%
              </div>
            </CardHeader>
            <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
              <div className="text-muted-foreground text-xs">
                {trendData?.label} trend
              </div>
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
          <MonthlyOverview currentMonth={new Date()} />
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <ConsumptionBreakdown currentMonth={new Date()} viewMode="cost" />
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
                <TooltipProvider>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          Daily Consumption
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>UK average data sourced from Ofgem's annual energy consumption statistics (8.5 kWh/day for average UK household)</p>
                            </TooltipContent>
                          </Tooltip>
                        </h4>
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
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          Daily Cost
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>UK average cost calculated using Ofgem's average unit rate (£0.30/kWh) × average consumption (8.5 kWh/day) = £2.55/day</p>
                            </TooltipContent>
                          </Tooltip>
                        </h4>
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
                </TooltipProvider>
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
