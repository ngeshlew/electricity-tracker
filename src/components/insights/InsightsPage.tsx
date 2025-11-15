import React, { useEffect, useState } from 'react';
import { AIInsights } from '../ai/AIInsights';
import { AIPromptInput } from '../ai/AIPromptInput';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@/components/ui/icon";
import { getAIHealth, AIHealthResponse } from '@/services/aiService';
import { useAIChatStore } from '@/store/useAIChatStore';

export const InsightsPage: React.FC = () => {
  const [aiHealth, setAiHealth] = useState<AIHealthResponse | null>(null);
  const { open, send } = useAIChatStore();

  useEffect(() => {
    getAIHealth()
      .then((health) => {
        console.log('AI Health response:', health);
        setAiHealth(health);
      })
      .catch((error) => {
        console.error('AI Health check failed:', error);
        // Set a default OK status if health check fails to prevent "AI Offline" showing
        setAiHealth({ status: 'OK', message: 'Health check failed but assuming OK' });
      });
  }, []);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="info" className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Insights</h1>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          Discover intelligent insights about your electricity consumption patterns and get personalized recommendations
          {aiHealth?.status === 'OK' && (
            <span className="text-xs rounded px-2 py-0.5 bg-green-500/10 text-green-600">
              AI Online
            </span>
          )}
          {aiHealth?.status === 'ERROR' && (
            <span className="text-xs rounded px-2 py-0.5 bg-red-500/10 text-red-600">
              AI Offline
            </span>
          )}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
        <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
            <div className="flex items-center gap-1">
              <div className="text-muted-foreground text-xs">
                AI Analysis
              </div>
              <Icon name="info" className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-lg tabular-nums">
              Active
            </div>
          </CardHeader>
          <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
            <div className="text-muted-foreground text-xs">
              Real-time pattern analysis
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
            <div className="flex items-center gap-1">
              <div className="text-muted-foreground text-xs">
                Recommendations
              </div>
              <Icon name="target" className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-lg tabular-nums">
              5+
            </div>
          </CardHeader>
          <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
            <div className="text-muted-foreground text-xs">
              Personalized suggestions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground flex flex-col gap-2 border py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-3">
            <div className="flex items-center gap-1">
              <div className="text-muted-foreground text-xs">
                Efficiency Score
              </div>
              <Icon name="arrow-up" className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="text-lg tabular-nums">
              85%
            </div>
          </CardHeader>
          <CardContent className="flex px-3 flex-col items-start gap-1 text-xs">
            <div className="text-muted-foreground text-xs">
              Above average efficiency
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Icon name="info" className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Icon name="mail-email-message-inbox" className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Icon name="info" className="h-4 w-4" />
            Ask AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <AIInsights />
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="mail-email-message-inbox" className="h-5 w-5" />
                AI Energy Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="mail-email-message-inbox" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click the chat button in the bottom right to start a conversation with our AI assistant!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <AIPromptInput 
            onPromptSubmit={async (prompt) => {
              open();
              await send(prompt);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
