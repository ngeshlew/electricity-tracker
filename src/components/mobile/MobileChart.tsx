import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  BarChart3,
  TrendingUp,
  Activity
} from "lucide-react";
import { useSwipeGestures } from '../../hooks/useSwipeGestures';

interface MobileChartProps {
  data: any[];
  title: string;
  description?: string;
  type?: 'area' | 'bar' | 'line';
  dataKey: string;
  color?: string;
  height?: number;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export const MobileChart: React.FC<MobileChartProps> = ({
  data,
  title,
  description,
  type = 'area',
  dataKey,
  color = 'oklch(var(--primary))',
  height = 300,
  showNavigation = true,
  onPrevious,
  onNext,
  onRefresh,
  className
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>(type);

  // Swipe gesture handlers
  const handleSwipeLeft = useCallback(() => {
    onNext?.();
  }, [onNext]);

  const handleSwipeRight = useCallback(() => {
    onPrevious?.();
  }, [onPrevious]);

  const { touchHandlers, mouseHandlers, isSwipping } = useSwipeGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    preventDefault: false
  });

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value} kWh`, 'Consumption']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value} kWh`, 'Consumption']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`${value} kWh`, 'Consumption']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
          
          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1">
            <Button
              variant={chartType === 'area' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('area')}
              className="h-8 w-8 p-0"
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-8 w-8 p-0"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8 w-8 p-0"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Navigation Controls */}
        {showNavigation && (onPrevious || onNext || onRefresh) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {onPrevious && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevious}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              {onNext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="h-8 w-8 p-0"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              )}
              
              <Badge variant="outline" className="text-xs">
                Swipe to navigate
              </Badge>
            </div>
          </div>
        )}

        {/* Chart Container */}
        <div 
          className="relative"
          style={{ height: `${height}px` }}
          {...touchHandlers}
          {...mouseHandlers}
        >
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
          
          {/* Swipe Indicator */}
          {isSwipping && (
            <div className="absolute inset-0 bg-primary/5 border-2 border-primary/20 rounded-lg pointer-events-none" />
          )}
        </div>

        {/* Mobile-specific Instructions */}
        <div className="mt-3 text-xs text-muted-foreground text-center">
          Swipe left/right to navigate • Tap chart type to change view
        </div>
      </CardContent>
    </Card>
  );
};
