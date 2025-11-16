import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useTariffStore } from '@/store/useTariffStore';
import { format } from 'date-fns';

interface TimelineDataPoint {
  date: string;
  unitRate: number;
  standingCharge: number;
  tariffName: string;
  provider: string;
  productType?: string;
  estimatedAnnualCost?: number;
  tariffId?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    const allTariffs = useTariffStore.getState();
    const { currentTariff, historicalTariffs } = allTariffs;
    const allTariffsList = [currentTariff, ...historicalTariffs].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    // Find current tariff and previous tariff for comparison
    const currentIndex = allTariffsList.findIndex(t => 
      t.id === data?.tariffId || 
      (t.tariffName === data?.tariffName && t.provider === data?.provider)
    );
    const currentTariffData = currentIndex >= 0 ? allTariffsList[currentIndex] : null;
    const previousTariff = currentIndex > 0 ? allTariffsList[currentIndex - 1] : null;
    
    // Calculate cost comparison
    let costComparison = null;
    if (currentTariffData && previousTariff && currentTariffData.estimatedAnnualCost && previousTariff.estimatedAnnualCost) {
      const difference = currentTariffData.estimatedAnnualCost - previousTariff.estimatedAnnualCost;
      const percentage = (difference / previousTariff.estimatedAnnualCost) * 100;
      const isCheaper = difference < 0;
      
      costComparison = {
        difference: Math.abs(difference),
        percentage: Math.abs(percentage),
        isCheaper,
        previousTariffName: previousTariff.tariffName,
      };
    }
    
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 shadow-lg rounded-lg max-w-xs">
        <p className="text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
              {entry.dataKey === 'unitRate' ? 'p/kWh' : 'p/day'}
            </span>
          </div>
        ))}
        {data?.tariffName && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium">{data.tariffName}</p>
            <p className="text-xs text-muted-foreground">{data.provider}</p>
            {data.productType && (
              <p className="text-xs text-muted-foreground mt-1">Product Type: {data.productType}</p>
            )}
          </div>
        )}
        {costComparison && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">Cost Comparison</p>
            <p className="text-xs">
              vs {costComparison.previousTariffName}
            </p>
            <p className={`text-xs font-semibold ${costComparison.isCheaper ? 'text-green-600' : 'text-red-600'}`}>
              {costComparison.isCheaper ? 'Cheaper' : 'More expensive'} by {costComparison.percentage.toFixed(1)}%
            </p>
            <p className={`text-xs font-semibold ${costComparison.isCheaper ? 'text-green-600' : 'text-red-600'}`}>
              {costComparison.isCheaper ? '-' : '+'}£{costComparison.difference.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const TariffHistoryTimeline: React.FC = () => {
  const { currentTariff, historicalTariffs } = useTariffStore();

  const timelineData = useMemo(() => {
    const allTariffs = [currentTariff, ...historicalTariffs];
    
    // Sort by start date
    const sortedTariffs = allTariffs.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const dataPoints: TimelineDataPoint[] = [];
    
    sortedTariffs.forEach((tariff) => {
      const startDate = new Date(tariff.startDate);
      const endDate = tariff.endDate ? new Date(tariff.endDate) : new Date();
      
      // Add start date point
      dataPoints.push({
        date: format(startDate, 'MMM yyyy'),
        unitRate: tariff.unitRate,
        standingCharge: tariff.standingCharge,
        tariffName: tariff.tariffName,
        provider: tariff.provider,
        productType: tariff.productType,
        estimatedAnnualCost: tariff.estimatedAnnualCost,
        tariffId: tariff.id,
      });
      
      // Add end date point if tariff has ended
      if (tariff.endDate) {
        dataPoints.push({
          date: format(endDate, 'MMM yyyy'),
          unitRate: tariff.unitRate,
          standingCharge: tariff.standingCharge,
          tariffName: tariff.tariffName,
          provider: tariff.provider,
          productType: tariff.productType,
          estimatedAnnualCost: tariff.estimatedAnnualCost,
          tariffId: tariff.id,
        });
      }
    });

    // Remove duplicates and sort by date
    const dateMap = new Map<string, TimelineDataPoint>();
    dataPoints.forEach(point => {
      const pointDate = new Date(point.date + ' 01');
      const existing = dateMap.get(point.date);
      if (!existing || new Date(existing.date + ' 01').getTime() < pointDate.getTime()) {
        dateMap.set(point.date, point);
      }
    });

    const uniqueDates = Array.from(dateMap.values()).sort((a, b) => {
      const dateA = new Date(a.date + ' 01');
      const dateB = new Date(b.date + ' 01');
      return dateA.getTime() - dateB.getTime();
    });

    return uniqueDates.map(point => {
      // Find the tariff active at this date
      const pointDate = new Date(point.date + ' 01');
      const activeTariff = sortedTariffs.find(tariff => {
        const tariffStart = new Date(tariff.startDate);
        const tariffEnd = tariff.endDate ? new Date(tariff.endDate) : new Date();
        return pointDate >= tariffStart && pointDate <= tariffEnd;
      });

      if (activeTariff) {
        return {
          date: point.date,
          unitRate: activeTariff.unitRate,
          standingCharge: activeTariff.standingCharge,
          tariffName: activeTariff.tariffName,
          provider: activeTariff.provider,
          productType: activeTariff.productType,
          estimatedAnnualCost: activeTariff.estimatedAnnualCost,
          tariffId: activeTariff.id,
        };
      }

      return {
        date: point.date,
        unitRate: point.unitRate,
        standingCharge: point.standingCharge,
        tariffName: point.tariffName,
        provider: point.provider,
        productType: point.productType,
        estimatedAnnualCost: point.estimatedAnnualCost,
        tariffId: point.tariffId,
      };
    });
  }, [currentTariff, historicalTariffs]);

  if (timelineData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="activity-graph" className="h-5 w-5" />
            Tariff History Timeline
          </CardTitle>
          <CardDescription>
            Visualize your tariff changes over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tariff history available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="activity-graph" className="h-5 w-5" />
          Tariff History Timeline
        </CardTitle>
        <CardDescription>
          Visualize your unit rate and standing charge changes over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Unit Rate (p/kWh)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Standing Charge (p/day)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="unitRate"
                stroke="rgb(139, 92, 246)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Unit Rate (p/kWh)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="standingCharge"
                stroke="rgb(245, 158, 11)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Standing Charge (p/day)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

