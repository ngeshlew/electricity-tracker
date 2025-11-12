import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Activity,
  BarChart3,
  Eye
} from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';
import { useTariffStore } from '../../store/useTariffStore';
import { MobileChart } from './MobileChart';

export const MobileDashboard: React.FC = () => {
  const { 
    readings, 
    chartData, 
    isLoading, 
    error
  } = useElectricityStore();
  const { getMonthlyTargets } = useTariffStore();
  
  const [currentPeriod, setCurrentPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate analytics
  const calculateAnalytics = () => {
    if (readings.length === 0) return null;

    const totalConsumption = readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0);
    const totalCost = readings.reduce((sum, reading) => sum + (reading.cost || 0), 0);
    const avgDailyConsumption = totalConsumption / readings.length;
    const avgDailyCost = totalCost / readings.length;

    // Recent trend (last 7 days vs previous 7 days)
    const recentReadings = readings.slice(-7);
    const previousReadings = readings.slice(-14, -7);
    
    const recentAvg = recentReadings.reduce((sum, r) => sum + (r.consumption || 0), 0) / recentReadings.length;
    const previousAvg = previousReadings.length > 0 
      ? previousReadings.reduce((sum, r) => sum + (r.consumption || 0), 0) / previousReadings.length 
      : recentAvg;

    const trendPercentage = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    return {
      totalConsumption,
      totalCost,
      avgDailyConsumption,
      avgDailyCost,
      trendPercentage,
      recentAvg,
      previousAvg
    };
  };

  const analytics = calculateAnalytics();
  const monthlyTargets = getMonthlyTargets();

  // Filter data based on current period
  const getFilteredData = () => {
    const days = currentPeriod === '7d' ? 7 : currentPeriod === '30d' ? 30 : 90;
    return chartData.slice(-days);
  };

  const filteredData = getFilteredData();

  // Period navigation
  const handlePreviousPeriod = () => {
    // This would typically load previous period data
    console.log('Previous period');
  };

  const handleNextPeriod = () => {
    // This would typically load next period data
    console.log('Next period');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pt-14 pb-20">
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14 pb-20">
      {/* Period Selector - Sticky below MobileNavigation */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <Button
              key={period}
              variant={currentPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPeriod(period)}
              className="h-8 text-xs"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Usage</p>
                    <p className="text-lg font-bold">{analytics.totalConsumption.toFixed(1)} kWh</p>
                  </div>
                  <Zap className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <p className="text-lg font-bold">£{analytics.totalCost.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Avg</p>
                    <p className="text-lg font-bold">{analytics.avgDailyConsumption.toFixed(1)} kWh</p>
                  </div>
                  <Activity className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Trend</p>
                    <div className="flex items-center gap-1">
                      {analytics.trendPercentage > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-bold">
                        {Math.abs(analytics.trendPercentage).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monthly Target Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly Target Progress</CardTitle>
            <CardDescription>Track your progress against annual targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage Progress</span>
                <span>
                  {analytics ? ((analytics.totalConsumption / monthlyTargets.usage) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, analytics ? (analytics.totalConsumption / monthlyTargets.usage) * 100 : 0)}%` 
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cost Progress</span>
                <span>
                  {analytics ? ((analytics.totalCost / monthlyTargets.cost) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, analytics ? (analytics.totalCost / monthlyTargets.cost) * 100 : 0)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumption Chart */}
        <MobileChart
          data={filteredData}
          title="Consumption Trend"
          description={`${currentPeriod} consumption overview`}
          type="area"
          dataKey="consumption"
          height={250}
          showNavigation={true}
          onPrevious={handlePreviousPeriod}
          onNext={handleNextPeriod}
          onRefresh={handleRefresh}
        />

        {/* Recent Readings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Readings</CardTitle>
            <CardDescription>Your latest meter readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readings.slice(-5).reverse().map((reading) => (
                <div key={reading.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(reading.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reading.type === 'MANUAL' ? 'Manual' : 'Estimated'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{reading.reading} kWh</p>
                    <p className="text-xs text-muted-foreground">
                      {reading.consumption ? `+${reading.consumption.toFixed(1)} kWh` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-sm text-destructive mt-1">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
};
