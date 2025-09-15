import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { formatDateUK, addDays } from '../../utils/dateFormatters';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, MoreVertical } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

export const ConsumptionChart: React.FC = () => {
  const { chartData } = useElectricityStore();
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Fill missing dates to prevent chart gaps
  const fillMissingDates = (data: typeof chartData) => {
    if (data.length < 2) return data;
    
    const filledData = [];
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      
      filledData.push({
        date: current.date,
        consumption: current.kwh,
        cost: current.cost,
      });
      
      // Fill gaps between current and next reading
      if (next) {
        const currentDate = new Date(current.date);
        const nextDate = new Date(next.date);
        const daysDiff = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Add zero consumption days for gaps > 1 day
        for (let day = 1; day < daysDiff; day++) {
          const gapDate = addDays(currentDate, day);
          filledData.push({
            date: gapDate.toISOString().split('T')[0],
            consumption: 0,
            cost: 0,
          });
        }
      }
    }
    
    return filledData;
  };
  
  // Transform chart data for Recharts with filled gaps
  const chartDataFormatted = fillMissingDates(chartData);

  const downloadChart = async (format: 'png' | 'svg') => {
    if (!chartRef.current) return;
    try {
      const dataUrl = format === 'png' 
        ? await toPng(chartRef.current, { quality: 1.0, pixelRatio: 2 })
        : await toSvg(chartRef.current);
      const link = document.createElement('a');
      link.download = `consumption-chart.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <Card className="lewis-card lewis-card-hover lewis-animation-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold lewis-text-gradient">
            Daily Consumption Trend
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadChart('png')}>
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadChart('svg')}>
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartDataFormatted}>
              <defs>
                <linearGradient id="chartPrimary" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                className="text-xs fill-muted-foreground"
                tickFormatter={(value) => formatDateUK(new Date(value), 'chart')}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 10px 25px -5px hsl(var(--primary) / 0.2)',
                }}
                formatter={(value: number, name: string) => [
                  `${value} ${name === 'consumption' ? 'kWh' : '£'}`,
                  name === 'consumption' ? 'Consumption' : 'Cost'
                ]}
                labelFormatter={(value) => `Date: ${formatDateUK(new Date(value), 'long')}`}
              />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                stroke="url(#chartPrimary)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5, stroke: 'hsl(var(--background))' }}
                activeDot={{ r: 8, stroke: 'hsl(var(--accent))', strokeWidth: 3, fill: 'hsl(var(--background))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};