import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { useNotificationStore } from '../../store/useNotificationStore';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useNotificationStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleNestedSettingChange = (parentKey: string, childKey: string, value: any) => {
    const newSettings = {
      ...localSettings,
      [parentKey]: {
        ...(localSettings[parentKey as keyof typeof settings] as any),
        [childKey]: value
      }
    };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    resetSettings();
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="notification-bell-alarm" className="h-5 w-5" />
            General Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="mail-email-message-inbox" className="h-4 w-4" />
                <Label htmlFor="email">Email Notifications</Label>
              </div>
              <Switch
                id="email"
                checked={localSettings.email}
                onCheckedChange={(checked) => handleSettingChange('email', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="mobile-phone" className="h-4 w-4" />
                <Label htmlFor="push">Push Notifications</Label>
              </div>
              <Switch
                id="push"
                checked={localSettings.push}
                onCheckedChange={(checked) => handleSettingChange('push', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Receive browser push notifications
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="notification-bell-alarm" className="h-4 w-4" />
                <Label htmlFor="inApp">In-App Notifications</Label>
              </div>
              <Switch
                id="inApp"
                checked={localSettings.inApp}
                onCheckedChange={(checked) => handleSettingChange('inApp', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Show notifications within the app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="alert-error" className="h-5 w-5" />
            Alert Categories
          </CardTitle>
          <CardDescription>
            Choose which types of alerts you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="lightning-energy" className="h-4 w-4" />
                <Label htmlFor="consumption">Consumption Alerts</Label>
              </div>
              <Switch
                id="consumption"
                checked={localSettings.consumptionAlerts}
                onCheckedChange={(checked) => handleSettingChange('consumptionAlerts', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Get notified about high energy usage
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="dollar-currency" className="h-4 w-4" />
                <Label htmlFor="cost">Cost Alerts</Label>
              </div>
              <Switch
                id="cost"
                checked={localSettings.costAlerts}
                onCheckedChange={(checked) => handleSettingChange('costAlerts', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Get notified about high energy costs
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="adjust-settings-horizontal" className="h-4 w-4" />
                <Label htmlFor="system">System Alerts</Label>
              </div>
              <Switch
                id="system"
                checked={localSettings.systemAlerts}
                onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Get notified about system updates and issues
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="clock-time" className="h-4 w-4" />
                <Label htmlFor="reminder">Reminder Alerts</Label>
              </div>
              <Switch
                id="reminder"
                checked={localSettings.reminderAlerts}
                onCheckedChange={(checked) => handleSettingChange('reminderAlerts', checked)}
              />
              <p className="text-xs text-muted-foreground">
                Get reminded to record meter readings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="alert-error" className="h-5 w-5" />
            Alert Thresholds
          </CardTitle>
          <CardDescription>
            Set thresholds for when you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="highUsageThreshold">High Usage Threshold (kWh/day)</Label>
              <Input
                id="highUsageThreshold"
                type="number"
                value={localSettings.highUsageThreshold}
                onChange={(e) => handleSettingChange('highUsageThreshold', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground">
                Get notified when daily consumption exceeds this amount
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="highCostThreshold">High Cost Threshold (£/day)</Label>
              <Input
                id="highCostThreshold"
                type="number"
                value={localSettings.highCostThreshold}
                onChange={(e) => handleSettingChange('highCostThreshold', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Get notified when daily cost exceeds this amount
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="clock-time" className="h-5 w-5" />
            Reminder Settings
          </CardTitle>
          <CardDescription>
            Configure how often you want to be reminded
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
            <Select
              value={localSettings.reminderFrequency}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                handleSettingChange('reminderFrequency', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How often to remind you to record meter readings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="clock-time" className="h-5 w-5" />
            Quiet Hours
          </CardTitle>
          <CardDescription>
            Set times when you don't want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="quietHoursEnabled"
                checked={localSettings.quietHours.enabled}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('quietHours', 'enabled', checked)
                }
              />
              <Label htmlFor="quietHoursEnabled">Enable Quiet Hours</Label>
            </div>

            {localSettings.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={localSettings.quietHours.start}
                    onChange={(e) => 
                      handleNestedSettingChange('quietHours', 'start', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={localSettings.quietHours.end}
                    onChange={(e) => 
                      handleNestedSettingChange('quietHours', 'end', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <Icon name="clock-refresh-time-arrow" className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResetToDefaults}
              >
                Reset to Defaults
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Icon name="save" className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
