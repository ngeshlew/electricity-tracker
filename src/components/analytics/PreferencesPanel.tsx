import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useElectricityStore } from '../../store/useElectricityStore';

export const PreferencesPanel: React.FC = () => {
  const { preferences, updatePreferences } = useElectricityStore();

  return (
    <Card className="lewis-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold lewis-text-gradient">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Theme</label>
          <Select value={preferences.theme} onValueChange={(v) => updatePreferences({ theme: v as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Currency</label>
          <Select value={preferences.currency} onValueChange={(v) => updatePreferences({ currency: v as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Notifications</label>
          <div className="flex h-10 items-center">
            <Switch checked={preferences.notifications} onCheckedChange={(c) => updatePreferences({ notifications: Boolean(c) })} />
            <span className="ml-2 text-sm">Enabled</span>
          </div>
        </div>

        <div className="space-y-2 col-span-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Unit Rate (per kWh)</label>
            <span className="text-sm font-medium">£{preferences.unitRate.toFixed(2)}</span>
          </div>
          <Slider
            min={0.05}
            max={1.0}
            step={0.01}
            value={[preferences.unitRate]}
            onValueChange={([v]) => updatePreferences({ unitRate: v })}
          />
        </div>

        <div className="space-y-2 col-span-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Standing Charge (per day)</label>
            <span className="text-sm font-medium">£{preferences.standingCharge.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={2.0}
            step={0.05}
            value={[preferences.standingCharge]}
            onValueChange={([v]) => updatePreferences({ standingCharge: v })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

