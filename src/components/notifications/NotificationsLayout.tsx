import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCenter } from './NotificationCenter';
import { NotificationSettings } from './NotificationSettings';

export const NotificationsLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Header />
        <div className="p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground mt-2">
                Manage your notifications and alerts
              </p>
            </div>
            
            <Tabs defaultValue="center" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="center">Notification Center</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="center">
                <NotificationCenter />
              </TabsContent>
              
              <TabsContent value="settings">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};
