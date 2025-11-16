import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTariffStore } from '@/store/useTariffStore';
import { format } from 'date-fns';

interface TariffHistoryTableProps {
  onAddTariff?: () => void;
}

type SortField = 'startDate' | 'endDate' | 'unitRate' | 'standingCharge' | 'provider' | 'estimatedAnnualCost';
type SortDirection = 'asc' | 'desc';

export const TariffHistoryTable: React.FC<TariffHistoryTableProps> = ({ onAddTariff }) => {
  const { currentTariff, historicalTariffs, deleteTariff } = useTariffStore();
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const allTariffs = useMemo(() => {
    const tariffs = [
      { ...currentTariff, isCurrent: true },
      ...historicalTariffs.map(t => ({ ...t, isCurrent: false })),
    ];

    return tariffs.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'endDate':
          aValue = a.endDate ? new Date(a.endDate).getTime() : Infinity;
          bValue = b.endDate ? new Date(b.endDate).getTime() : Infinity;
          break;
        case 'unitRate':
          aValue = a.unitRate;
          bValue = b.unitRate;
          break;
        case 'standingCharge':
          aValue = a.standingCharge;
          bValue = b.standingCharge;
          break;
        case 'provider':
          aValue = a.provider;
          bValue = b.provider;
          break;
        case 'estimatedAnnualCost':
          aValue = a.estimatedAnnualCost || 0;
          bValue = b.estimatedAnnualCost || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [currentTariff, historicalTariffs, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCostComparison = (tariff: typeof allTariffs[0], index: number) => {
    if (index === 0) return null;
    const previousTariff = allTariffs[index - 1];
    
    if (!tariff.estimatedAnnualCost || !previousTariff.estimatedAnnualCost) return null;
    
    const difference = tariff.estimatedAnnualCost - previousTariff.estimatedAnnualCost;
    const percentage = (difference / previousTariff.estimatedAnnualCost) * 100;
    const isCheaper = difference < 0;
    
    return {
      difference: Math.abs(difference),
      percentage: Math.abs(percentage),
      isCheaper,
    };
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <Icon
        name={sortDirection === 'asc' ? 'arrow-chevron-up' : 'arrow-chevron-down'}
        className="h-4 w-4 ml-1"
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="table-panel-window-sidebar" className="h-5 w-5" />
              Tariff History
            </CardTitle>
            <CardDescription>
              View and manage all your tariffs, current and historical
            </CardDescription>
          </div>
          {onAddTariff && (
            <Button variant="outline" onClick={onAddTariff}>
              <Icon name="add-new-plus" className="h-4 w-4 mr-2" />
              Add Tariff
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {allTariffs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tariff history available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('provider')}
                  >
                    <div className="flex items-center">
                      Provider
                      <SortIcon field="provider" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center">
                      Tariff Name
                      <SortIcon field="startDate" />
                    </div>
                  </TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('unitRate')}
                  >
                    <div className="flex items-center">
                      Unit Rate
                      <SortIcon field="unitRate" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('standingCharge')}
                  >
                    <div className="flex items-center">
                      Standing Charge
                      <SortIcon field="standingCharge" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center">
                      Start Date
                      <SortIcon field="startDate" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center">
                      End Date
                      <SortIcon field="endDate" />
                    </div>
                  </TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('estimatedAnnualCost')}
                  >
                    <div className="flex items-center">
                      Estimated Annual Cost
                      <SortIcon field="estimatedAnnualCost" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTariffs.map((tariff, index) => (
                  <TableRow key={tariff.id}>
                    <TableCell className="font-medium">{tariff.provider}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{tariff.tariffName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tariff.productType}</Badge>
                    </TableCell>
                    <TableCell>{tariff.unitRate.toFixed(2)}p/kWh</TableCell>
                    <TableCell>{tariff.standingCharge.toFixed(2)}p/day</TableCell>
                    <TableCell>
                      {format(new Date(tariff.startDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {tariff.endDate
                        ? format(new Date(tariff.endDate), 'dd MMM yyyy')
                        : '—'}
                    </TableCell>
                    <TableCell>{tariff.paymentMethod}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>£{tariff.estimatedAnnualCost ? tariff.estimatedAnnualCost.toFixed(2) : '0.00'}</span>
                        {(() => {
                          const comparison = getCostComparison(tariff, index);
                          if (!comparison) return null;
                          return (
                            <span className={`text-xs ${comparison.isCheaper ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
                              {comparison.isCheaper ? (
                                <>
                                  <Icon name="arrow-down" className="h-3 w-3" />
                                  {comparison.percentage.toFixed(1)}% cheaper (-£{comparison.difference.toFixed(2)})
                                </>
                              ) : (
                                <>
                                  <Icon name="arrow-up" className="h-3 w-3" />
                                  {comparison.percentage.toFixed(1)}% more expensive (+£{comparison.difference.toFixed(2)})
                                </>
                              )}
                            </span>
                          );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {tariff.isCurrent ? (
                        <Badge className="bg-green-600">Current</Badge>
                      ) : (
                        <Badge variant="outline">Ended</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Icon name="more-horizontal" className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={tariff.isCurrent}>
                            <Icon name="edit-write" className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={tariff.isCurrent}
                            onClick={() => deleteTariff(tariff.id)}
                            className="text-red-600"
                          >
                            <Icon name="trash-delete-bin-3" className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

