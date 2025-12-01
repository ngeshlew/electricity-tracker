import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Icon } from "@/components/ui/icon";
import { getSeasonColor } from "@/utils/seasonalColors";
import { useFuelStore } from '@/store/useFuelStore';

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
  monthRange: string;
}

/**
 * SeasonalTracker Component
 * 
 * Displays seasonal consumption analysis with charts and breakdown cards.
 * Features:
 * - Seasonal consumption comparison bar chart
 * - Individual season cards with detailed metrics
 * - Seasonal distribution pie chart
 * 
 * Uses Recharts: BarChart, PieChart
 * Custom styling: Timezone-inspired design system
 */
export const SeasonalTracker: React.FC = () => {
  const { chartData, isLoading } = useFuelStore();

  // Calculate seasonal data
  const getSeasonalData = (): SeasonalData[] => {
    if (chartData.length === 0) return [];

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
          trendPercentage: 0,
          monthRange: getSeasonMonthRange(season)
        };
      }

      const totalConsumption = dataPoints.reduce((sum, point) => sum + point.litres, 0);
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
        trendPercentage: trend.percentage,
        monthRange: getSeasonMonthRange(season)
      };
    });

    return seasons.sort((a, b) => b.consumption - a.consumption);
  };

  const getSeasonIconName = (season: string): string => {
    switch (season) {
      case 'Winter': return 'snowflakes-weather-cold';
      case 'Spring': return 'flower-plant';
      case 'Summer': return 'sun-day';
      case 'Autumn': return 'droplet-rain-weather';
      default: return 'lightning-energy';
    }
  };

  const getSeasonMonthRange = (season: string): string => {
    switch (season) {
      case 'Winter': return 'Dec - Feb';
      case 'Spring': return 'Mar - May';
      case 'Summer': return 'Jun - Aug';
      case 'Autumn': return 'Sep - Nov';
      default: return '';
    }
  };

  // getSeasonColor is now imported from utils/seasonalColors

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
      const total = dataPoints.reduce((s, point) => s + point.litres, 0);
      return sum + (total / dataPoints.length);
    }, 0) / otherSeasons.length;

    const percentage = ((currentAvg - otherAvg) / otherAvg) * 100;
    
    if (Math.abs(percentage) < 5) return { trend: 'stable' as const, percentage: 0 };
    return percentage > 0 
      ? { trend: 'up' as const, percentage: Math.abs(percentage) }
      : { trend: 'down' as const, percentage: Math.abs(percentage) };
  };

  const seasonalData = getSeasonalData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = seasonalData.reduce((sum, s) => sum + s.consumption, 0);
      const percentage = total > 0 ? (data.consumption / total) * 100 : 0;
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg">
          <p className="">{data.season}</p>
          <p className="text-xs text-muted-foreground">
            {data.consumption.toFixed(1)} L
          </p>
          <p className="text-xs text-muted-foreground">
            {percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading && chartData.length === 0) {
    return (
      <div className="space-y-6 w-full">
        <Card className="bg-transparent border-dotted" style={{ padding: 'var(--space-md)' }}>
          <CardHeader>
            <CardTitle className="text-lg font-normal uppercase tracking-wide">Seasonal Consumption Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="space-y-6 w-full">
        <Card className="bg-transparent border-dotted" style={{ padding: 'var(--space-md)' }}>
          <CardHeader>
            <CardTitle className="text-lg font-normal uppercase tracking-wide">Seasonal Consumption Comparison</CardTitle>
            <CardDescription className="text-xs uppercase tracking-normal">
              Compare your fuel consumption across different seasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-xs uppercase tracking-normal text-muted-foreground">
                No seasonal data available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Seasonal Comparison Chart */}
      <Card className="bg-transparent border-dotted hover:border-[var(--color-border-strong)] transition-colors duration-200 w-full" style={{ padding: 'var(--space-md)' }}>
        <CardHeader className="px-0 pt-0 pb-0">
          <CardTitle className="text-lg font-normal uppercase tracking-wide mb-2">
            Seasonal Consumption Comparison
          </CardTitle>
          <CardDescription className="text-xs uppercase tracking-normal text-muted-foreground">
            Compare your fuel consumption across different seasons
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-6" style={{ paddingTop: 'var(--space-md)' }}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="4 4" stroke="oklch(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="season" 
                  tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  stroke="oklch(var(--foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}
                  stroke="oklch(var(--foreground))"
                  label={{ 
                    value: 'Consumption (L)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="consumption" 
                  radius={[4, 4, 0, 0]}
                  fill="oklch(var(--foreground))"
                >
                  {seasonalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seasonalData.map((season) => {
          const trendIconName = season.trend === 'up' ? 'trending-up' : 
                               season.trend === 'down' ? 'trending-down' : 
                               'target';
          
          return (
            <Card 
              key={season.season} 
              className="bg-transparent border-dotted hover:border-[var(--color-border-strong)] transition-colors duration-200 relative overflow-hidden"
              style={{ padding: 'var(--space-md)' }}
            >
              <CardHeader className="px-0 pt-0 pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name={season.icon as any} className="h-4 w-4" style={{ color: season.color }} />
                    <CardTitle className="text-xs font-normal uppercase tracking-wider">
                      {season.season}
                    </CardTitle>
                  </div>
                  {season.trendPercentage > 0 && (
                    <Badge 
                      variant="outline"
                      className="text-xs border-dotted"
                      title={`${season.trendPercentage.toFixed(0)}% ${season.trend === 'up' ? 'higher' : 'lower'} than other seasons`}
                    >
                      <Icon name={trendIconName as any} className="h-3 w-3 mr-1" />
                      {season.trendPercentage.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="text-xs uppercase tracking-normal text-muted-foreground mb-4">
                  {season.monthRange}
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-3">
                <div className="space-y-1">
                  <div className="text-2xl font-normal tabular-nums" style={{ fontSize: 'var(--text-2xl)', lineHeight: '1' }}>
                    {season.consumption.toFixed(1)}
                  </div>
                  <div className="text-xs uppercase tracking-normal text-muted-foreground">Total L</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-normal tabular-nums">£{season.cost.toFixed(2)}</div>
                  <div className="text-xs uppercase tracking-normal text-muted-foreground">Total Cost</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-normal tabular-nums">{season.avgDailyConsumption.toFixed(1)} L/day</div>
                  <div className="text-xs uppercase tracking-normal text-muted-foreground">Daily Average</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-normal tabular-nums">{season.days}</div>
                  <div className="text-xs uppercase tracking-normal text-muted-foreground">Data Points</div>
                </div>
              </CardContent>
              
              {/* Color accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-0.5" 
                style={{ backgroundColor: season.color }}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

