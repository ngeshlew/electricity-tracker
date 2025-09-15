import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Settings as SettingsIcon, Trash2, Plus, Clock } from 'lucide-react';
import { useElectricityStore } from '../store/useElectricityStore';
import { TimeOfUseRate } from '../types';
import { toast } from '@/components/ui/toaster';

export const Settings: React.FC = () => {
  const { preferences, updatePreferences } = useElectricityStore();
  const [newRate, setNewRate] = useState<Partial<TimeOfUseRate>>({
    name: '',
    startTime: '09:00',
    endTime: '17:00',
    rate: 0.30,
    days: [1, 2, 3, 4, 5] // Mon-Fri
  });

  const addTimeOfUseRate = () => {
    if (!newRate.name?.trim()) {
      toast.error('Rate name is required');
      return;
    }
    const rate: TimeOfUseRate = {
      id: crypto.randomUUID(),
      name: newRate.name,
      startTime: newRate.startTime || '09:00',
      endTime: newRate.endTime || '17:00',
      rate: newRate.rate || 0.30,
      days: newRate.days || [1, 2, 3, 4, 5]
    };
    updatePreferences({
      timeOfUseRates: [...preferences.timeOfUseRates, rate]
    });
    setNewRate({ name: '', startTime: '09:00', endTime: '17:00', rate: 0.30, days: [1, 2, 3, 4, 5] });
    toast.success('Time-of-use rate added');
  };

  const removeTimeOfUseRate = (id: string) => {
    updatePreferences({
      timeOfUseRates: preferences.timeOfUseRates.filter(r => r.id !== id)
    });
    toast.success('Time-of-use rate removed');
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold lewis-text-gradient mb-3 flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8" />
            <span>Settings</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure your electricity tracker preferences and rates
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="lewis-card">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={preferences.theme} onValueChange={(v) => updatePreferences({ theme: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label>Currency</Label>
                    <Select value={preferences.currency} onValueChange={(v) => updatePreferences({ currency: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates">
            <div className="space-y-6">
              <Card className="lewis-card">
                <CardHeader>
                  <CardTitle>Standard Rates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Unit Rate (per kWh)</Label>
                      <span className="text-sm font-medium">£{preferences.unitRate.toFixed(3)}</span>
                    </div>
                    <Slider
                      min={0.05}
                      max={1.0}
                      step={0.001}
                      value={[preferences.unitRate]}
                      onValueChange={([v]) => updatePreferences({ unitRate: v })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Standing Charge (per day)</Label>
                      <span className="text-sm font-medium">£{preferences.standingCharge.toFixed(2)}</span>
                    </div>
                    <Slider
                      min={0}
                      max={2.0}
                      step={0.01}
                      value={[preferences.standingCharge]}
                      onValueChange={([v]) => updatePreferences({ standingCharge: v })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="lewis-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Time-of-Use Rates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {preferences.timeOfUseRates.map((rate) => (
                    <div key={rate.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{rate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rate.startTime} - {rate.endTime} • £{rate.rate.toFixed(3)}/kWh
                        </div>
                        <div className="flex space-x-1 mt-1">
                          {rate.days.map(day => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {dayNames[day]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove rate?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the "{rate.name}" time-of-use rate.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeTimeOfUseRate(rate.id)}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}

                  <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Rate Name</Label>
                        <Input
                          value={newRate.name || ''}
                          onChange={(e) => setNewRate(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Peak Hours"
                        />
                      </div>
                      <div>
                        <Label>Rate (£/kWh)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={newRate.rate || ''}
                          onChange={(e) => setNewRate(prev => ({ ...prev, rate: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={newRate.startTime || ''}
                          onChange={(e) => setNewRate(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={newRate.endTime || ''}
                          onChange={(e) => setNewRate(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Days</Label>
                      <div className="flex space-x-2 mt-2">
                        {dayNames.map((day, i) => (
                          <Button
                            key={i}
                            variant={newRate.days?.includes(i) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const days = newRate.days || [];
                              const next = days.includes(i) ? days.filter(d => d !== i) : [...days, i];
                              setNewRate(prev => ({ ...prev, days: next }));
                            }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={addTimeOfUseRate} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time-of-Use Rate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="lewis-card">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for meter reading reminders</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(c: boolean) => updatePreferences({ notifications: c })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card className="lewis-card">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Data Export</Label>
                  <div className="flex space-x-2">
                    <Button variant="outline">Export All Data</Button>
                    <Button variant="outline">Import Data</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Reset</Label>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Reset All Data</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset all data?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all meter readings, statements, and preferences. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Reset Everything</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};