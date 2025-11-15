import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { useTariffStore } from '@/store/useTariffStore';

export const CurrentTariffInfo: React.FC = () => {
  const { currentTariff } = useTariffStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="dollar-currency" className="h-5 w-5" />
          Current Tariff Information
        </CardTitle>
        <CardDescription>
          Your active energy tariff and account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Provider</div>
            <div className="flex items-center gap-2">
              <Icon name="info" className="h-4 w-4" />
              <span className="font-semibold">{currentTariff.provider}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Tariff Name</div>
            <div className="font-semibold">{currentTariff.tariffName}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Unit Rate</div>
            <div className="flex items-center gap-1">
              <Icon name="lightning-energy" className="h-4 w-4" />
              <span className="font-semibold">{currentTariff.unitRate}p/kWh</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Standing Charge</div>
            <div className="flex items-center gap-1">
              <Icon name="clock-time" className="h-4 w-4" />
              <span className="font-semibold">{currentTariff.standingCharge}p/day</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Account Number</div>
              <div className="font-mono text-sm">{currentTariff.accountNumber || 'Not set'}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Meter Number</div>
              <div className="font-mono text-sm">{currentTariff.meterNumber || 'Not set'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

