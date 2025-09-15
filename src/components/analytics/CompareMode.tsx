import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useElectricityStore } from '../../store/useElectricityStore';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const CompareMode: React.FC = () => {
  const { readings, preferences } = useElectricityStore();
  const [period1, setPeriod1] = useState('current-month');
  const [period2, setPeriod2] = useState('previous-month');

  const getPeriodData = (period: string) => {
    const now = new Date();
    let start: Date, end: Date, label: string;

    switch (period) {
      case 'current-month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMM yyyy');
        break;
      case 'previous-month':
        const prev = subMonths(now, 1);
        start = startOfMonth(prev);
        end = endOfMonth(prev);
        label = format(prev, 'MMM yyyy');
        break;
      case 'current-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        label = now.getFullYear().toString();
        break;
      case 'previous-year':
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        label = (now.getFullYear() - 1).toString();
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        label = format(now, 'MMM yyyy');
    }

    const periodReadings = readings.filter(r => {
      const date = new Date(r.date);
      return date >= start && date <= end;
    });

    let totalKwh = 0;
    let totalCost = 0;
    const dailyData: { date: string; kwh: number; cost: number }[] = [];

    for (let i = 1; i < periodReadings.length; i++) {
      const prev = periodReadings[i - 1];
      const curr = periodReadings[i];
      if (curr.isFirstReading) continue;
      
      const consumption = curr.reading - prev.reading;
      const cost = consumption * preferences.unitRate;
      
      if (consumption > 0) {
        totalKwh += consumption;
        totalCost += cost;
        dailyData.push({
          date: curr.date.toISOString().split('T')[0],
          kwh: consumption,
          cost
        });
      }
    }

    return { totalKwh, totalCost, dailyData, label, count: periodReadings.length };
  };

  const data1 = getPeriodData(period1);
  const data2 = getPeriodData(period2);

  const combinedChartData = useMemo(() => {
    const dates = new Set([...data1.dailyData.map(d => d.date), ...data2.dailyData.map(d => d.date)]);
    return Array.from(dates).sort().map(date => {
      const d1 = data1.dailyData.find(d => d.date === date);
      const d2 = data2.dailyData.find(d => d.date === date);
      return {
        date: format(new Date(date), 'MMM d'),
        period1: d1?.kwh || 0,
        period2: d2?.kwh || 0,
      };
    });
  }, [data1.dailyData, data2.dailyData]);

  const kwhDiff = data1.totalKwh - data2.totalKwh;
  const costDiff = data1.totalCost - data2.totalCost;
  const kwhPercent = data2.totalKwh > 0 ? ((kwhDiff / data2.totalKwh) * 100) : 0;

  const getDiffIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="lewis-card">
      <CardHeader>
        <CardTitle className="lewis-text-gradient">Compare Periods</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground">Period 1</label>
            <Select value={period1} onValueChange={setPeriod1}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Period 2</label>
            <Select value={period2} onValueChange={setPeriod2}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">{data1.label}</div>
            <div className="text-2xl font-bold">{data1.totalKwh.toFixed(1)} kWh</div>
            <div className="text-sm text-muted-foreground">£{data1.totalCost.toFixed(2)}</div>
          </div>
          <div className="text-center flex flex-col items-center space-y-2">
            {getDiffIcon(kwhDiff)}
            <Badge variant={kwhDiff > 0 ? 'destructive' : kwhDiff < 0 ? 'secondary' : 'outline'}>
              {kwhDiff >= 0 ? '+' : ''}{kwhDiff.toFixed(1)} kWh ({kwhPercent >= 0 ? '+' : ''}{kwhPercent.toFixed(1)}%)
            </Badge>
            <div className="text-xs text-muted-foreground">
              £{costDiff >= 0 ? '+' : ''}{costDiff.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">{data2.label}</div>
            <div className="text-2xl font-bold">{data2.totalKwh.toFixed(1)} kWh</div>
            <div className="text-sm text-muted-foreground">£{data2.totalCost.toFixed(2)}</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="period1" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name={data1.label}
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="period2" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name={data2.label}
                dot={{ fill: 'hsl(var(--accent))', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};