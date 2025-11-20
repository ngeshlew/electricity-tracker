import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Icon } from "@/components/ui/icon";
import { getSeasonColor } from "@/utils/seasonalColors";
import { useElectricityStore } from '../../store/useElectricityStore';
import { useTariffStore } from '../../store/useTariffStore';

interface SeasonalData {
  season: string;
  consumption: number;
  cost: number;
  days: number;
  avgDailyConsumption: number;
  avgDailyCost: number;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export const SeasonalAnalytics: React.FC = () => {
  const { chartData } = useElectricityStore();
  const { getMonthlyTargets } = useTariffStore();

  // Calculate seasonal data
  const getSeasonalData = (): SeasonalData[] => {
    if (chartData.length === 0) return [];

    // monthlyTargets not needed in seasonal grouping
    
    // Group chart data by season
    const seasonalGroups: { [key: string]: any[] } = {
      'Winter': [],
      'Spring': [],
      'Summer': [],
      'Autumn': []
    };

    chartData.forEach(point => {
      const date = new Date(point.date);
      const month = date.getMonth() + 1; // 1-12
      
      let season: string;
      if (month >= 12 || month <= 2) season = 'Winter';
      else if (month >= 3 && month <= 5) season = 'Spring';
      else if (month >= 6 && month <= 8) season = 'Summer';
      else season = 'Autumn';

      seasonalGroups[season].push(point);
    });

    // Calculate seasonal metrics
    const seasons: SeasonalData[] = Object.entries(seasonalGroups).map(([season, dataPoints]) => {
      if (dataPoints.length === 0) {
        return {
          season,
          consumption: 0,
          cost: 0,
          days: 0,
          avgDailyConsumption: 0,
          avgDailyCost: 0,
          icon: getSeasonIconName(season),
          color: getSeasonColor(season),
          trend: 'stable' as const,
          trendPercentage: 0
        };
      }

      const totalConsumption = dataPoints.reduce((sum, point) => sum + point.kwh, 0);
      const totalCost = dataPoints.reduce((sum, point) => sum + point.cost, 0);
      const days = dataPoints.length;
      const avgDailyConsumption = totalConsumption / days;
      const avgDailyCost = totalCost / days;

      // Calculate trend (simplified - compare with previous season)
      const trend = calculateTrend(season, avgDailyConsumption, seasonalGroups);
      
      return {
        season,
        consumption: totalConsumption,
        cost: totalCost,
        days,
        avgDailyConsumption,
        avgDailyCost,
        icon: getSeasonIconName(season),
        color: getSeasonColor(season),
        trend: trend.trend,
        trendPercentage: trend.percentage
      };
    });

    return seasons.sort((a, b) => b.consumption - a.consumption);
  };

  const getSeasonIconName = (season: string): string => {
    switch (season) {
      case 'Winter': return 'info'; // Placeholder for snowflake
      case 'Spring': return 'flower-plant';
      case 'Summer': return 'sun-day';
      case 'Autumn': return 'droplet-rain-weather';
      default: return 'lightning-energy';
    }
  };

  const calculateTrend = (season: string, currentAvg: number, seasonalGroups: { [key: string]: any[] }) => {
    // Simple trend calculation - compare with other seasons
    const otherSeasons = Object.entries(seasonalGroups)
      .filter(([s]) => s !== season)
      .map(([, dataPoints]) => dataPoints);
    
    if (otherSeasons.length === 0) {
      return { trend: 'stable' as const, percentage: 0 };
    }

    const otherAvg = otherSeasons.reduce((sum, dataPoints) => {
      if (dataPoints.length === 0) return sum;
      const total = dataPoints.reduce((s, point) => s + point.kwh, 0);
      return sum + (total / dataPoints.length);
    }, 0) / otherSeasons.length;

    const percentage = ((currentAvg - otherAvg) / otherAvg) * 100;
    
    if (Math.abs(percentage) < 5) return { trend: 'stable' as const, percentage: 0 };
    return percentage > 0 
      ? { trend: 'up' as const, percentage: Math.abs(percentage) }
      : { trend: 'down' as const, percentage: Math.abs(percentage) };
  };

  const seasonalData = getSeasonalData();
  const monthlyTargets = getMonthlyTargets();

  // Calculate total consumption and cost
  const totalConsumption = seasonalData.reduce((sum, s) => sum + s.consumption, 0);
  const totalCost = seasonalData.reduce((sum, s) => sum + s.cost, 0);

  // Calculate annual progress
  const annualUsageProgress = (totalConsumption / (monthlyTargets.usage * 12)) * 100;
  const annualCostProgress = (totalCost / (monthlyTargets.cost * 12)) * 100;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Annual Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="target" className="h-5 w-5" />
              Annual Usage Progress
            </CardTitle>
            <CardDescription>
              {totalConsumption.toFixed(1)} kWh of {monthlyTargets.usage * 12} kWh target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{annualUsageProgress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(annualUsageProgress, 100)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: {(monthlyTargets.usage * 12).toFixed(1)} kWh</span>
                <span>
                  {annualUsageProgress > 100 ? 'Over target' : 'On track'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="lightning-energy" className="h-5 w-5" />
              Annual Cost Progress
            </CardTitle>
            <CardDescription>
              £{totalCost.toFixed(2)} of £{(monthlyTargets.cost * 12).toFixed(2)} target
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{annualCostProgress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(annualCostProgress, 100)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Target: £{(monthlyTargets.cost * 12).toFixed(2)}</span>
                <span>
                  {annualCostProgress > 100 ? 'Over budget' : 'On budget'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Consumption Comparison</CardTitle>
          <CardDescription>
            Compare your electricity usage across different seasons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="season" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [
                    `${Number(value).toFixed(1)} kWh`, 
                    'Consumption'
                  ]}
                  labelFormatter={(label) => `Season: ${label}`}
                />
                <Bar 
                  dataKey="consumption" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seasonalData.map((season) => {
          const trendIconName = season.trend === 'up' ? 'trending-up' : 
                               season.trend === 'down' ? 'trending-down' : 
                               'target';
          
          return (
            <Card key={season.season} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name={season.icon as any} className="h-5 w-5" style={{ color: season.color }} />
                    <CardTitle className="text-base">{season.season}</CardTitle>
                  </div>
                  <Badge 
                    variant={season.trend === 'up' ? 'destructive' : 
                            season.trend === 'down' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    <Icon name={trendIconName as any} className="h-3 w-3 mr-1" />
                    {season.trendPercentage > 0 && `${season.trendPercentage.toFixed(0)}%`}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{season.consumption.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Total kWh</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-semibold">£{season.cost.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Total Cost</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">{season.avgDailyConsumption.toFixed(1)} kWh/day</div>
                  <div className="text-xs text-muted-foreground">Daily Average</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">{season.days} days</div>
                  <div className="text-xs text-muted-foreground">Data Points</div>
                </div>
              </CardContent>
              
              {/* Color accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1" 
                style={{ backgroundColor: season.color }}
              />
            </Card>
          );
        })}
      </div>

      {/* Seasonal Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Distribution</CardTitle>
          <CardDescription>
            Percentage breakdown of your annual consumption by season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={seasonalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ season, percent }: any) => 
                    `${season}: ${(Number(percent) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="consumption"
                >
                  {seasonalData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [
                    `${Number(value).toFixed(1)} kWh`, 
                    'Consumption'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
