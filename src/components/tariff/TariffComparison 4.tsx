import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useTariffStore } from '@/store/useTariffStore';
import { TariffInfo } from '@/services/ukElectricityApi';
import { format } from 'date-fns';

interface ComparisonCardProps {
  tariff: TariffInfo;
  isCurrent?: boolean;
  estimatedAnnualCost: number;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  tariff,
  isCurrent,
  estimatedAnnualCost,
}) => {
  return (
    <Card className={isCurrent ? 'border-2 border-primary' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{tariff.tariffName}</CardTitle>
          {isCurrent && (
            <Badge className="bg-green-600">Current</Badge>
          )}
        </div>
        <CardDescription>{tariff.provider}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Unit Rate</div>
            <div className="text-xl font-semibold">{tariff.unitRate.toFixed(2)}p/kWh</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Standing Charge</div>
            <div className="text-xl font-semibold">{tariff.standingCharge.toFixed(2)}p/day</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground mb-2">Period</div>
          <div className="text-sm">
            {format(new Date(tariff.startDate), 'dd MMM yyyy')} -{' '}
            {tariff.endDate
              ? format(new Date(tariff.endDate), 'dd MMM yyyy')
              : 'Ongoing'}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground mb-2">Estimated Annual Cost</div>
          <div className="text-2xl font-bold">£{estimatedAnnualCost.toFixed(2)}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <div>Product Type</div>
            <div className="font-medium">{tariff.productType}</div>
          </div>
          <div>
            <div>Payment Method</div>
            <div className="font-medium">{tariff.paymentMethod}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TariffComparison: React.FC = () => {
  const { currentTariff, historicalTariffs } = useTariffStore();

  const comparisonTariffs = useMemo(() => {
    // Get current tariff and up to 2 most recent historical tariffs
    const recentHistorical = historicalTariffs
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 2);

    return [
      { ...currentTariff, isCurrent: true },
      ...recentHistorical.map(t => ({ ...t, isCurrent: false })),
    ];
  }, [currentTariff, historicalTariffs]);

  const calculateEstimatedAnnualCost = (tariff: TariffInfo) => {
    // Using estimated annual usage from tariff, or default 1180.1 kWh
    const annualUsage = tariff.estimatedAnnualUsage || 1180.1;
    const unitCost = (tariff.unitRate / 100) * annualUsage; // Convert pence to pounds
    const standingCost = (tariff.standingCharge / 100) * 365; // Convert pence to pounds
    return unitCost + standingCost;
  };

  const costDifferences = useMemo(() => {
    if (comparisonTariffs.length < 2) return [];

    const currentCost = calculateEstimatedAnnualCost(currentTariff);
    return comparisonTariffs.slice(1).map(tariff => {
      const tariffCost = calculateEstimatedAnnualCost(tariff);
      const difference = currentCost - tariffCost;
      const percentage = (difference / tariffCost) * 100;

      return {
        tariffName: tariff.tariffName,
        difference,
        percentage,
        isBetter: difference < 0,
      };
    });
  }, [comparisonTariffs, currentTariff]);

  if (comparisonTariffs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="bar-chart" className="h-5 w-5" />
            Tariff Comparison
          </CardTitle>
          <CardDescription>
            Compare your current tariff with historical tariffs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No tariffs available for comparison
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="bar-chart" className="h-5 w-5" />
          Tariff Comparison
        </CardTitle>
        <CardDescription>
          Compare your current tariff with historical tariffs side-by-side
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisonTariffs.map((tariff) => (
            <ComparisonCard
              key={tariff.id}
              tariff={tariff}
              isCurrent={tariff.isCurrent}
              estimatedAnnualCost={calculateEstimatedAnnualCost(tariff)}
            />
          ))}
        </div>

        {costDifferences.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Cost Comparison</h3>
            <div className="space-y-3">
              {costDifferences.map((diff, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">vs {diff.tariffName}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.abs(diff.percentage).toFixed(1)}%{' '}
                      {diff.isBetter ? 'cheaper' : 'more expensive'}
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      diff.isBetter ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {diff.isBetter ? '-' : '+'}£{Math.abs(diff.difference).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

