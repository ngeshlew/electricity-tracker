import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../dashboard/Header';
import { AppSidebar } from '../dashboard/AppSidebar';
import { Settings } from './Settings';
import { UserProfile } from '../auth/UserProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileNavigation } from '../mobile/MobileNavigation';

export const SettingsLayout: React.FC = () => {
  return (
    <>
      <MobileNavigation />
      <SidebarProvider>
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <main className="flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0">
          <div className="hidden lg:block">
            <Header />
          </div>
          <div className="p-6">
            <div className="mx-auto max-w-4xl">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <UserProfile />
                </TabsContent>
                
                <TabsContent value="settings">
                  <Settings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};
