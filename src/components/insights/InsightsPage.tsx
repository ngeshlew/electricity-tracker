import React, { useEffect, useState } from 'react';
import { AIInsights } from '../ai/AIInsights';
import { AIPromptInput } from '../ai/AIPromptInput';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Target, MessageSquare, Sparkles } from "lucide-react";
import { getAIHealth, AIHealthResponse } from '@/services/aiService';

export const InsightsPage: React.FC = () => {
  const [aiHealth, setAiHealth] = useState<AIHealthResponse | null>(null);

  useEffect(() => {
    getAIHealth()
      .then((health) => {
        console.log('AI Health response:', health);
        setAiHealth(health);
      })
      .catch((error) => {
        console.error('AI Health check failed:', error);
        setAiHealth({ status: 'ERROR' } as AIHealthResponse);
      });
  }, []);

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Real-time pattern analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5+</div>
            <p className="text-xs text-muted-foreground">
              Personalized suggestions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Above average efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
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
                <MessageSquare className="h-5 w-5" />
                AI Energy Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click the chat button in the bottom right to start a conversation with our AI assistant!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <AIPromptInput 
            onPromptSubmit={(prompt) => {
              console.log('AI Prompt submitted:', prompt);
              // This would trigger the AI chatbot
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
