import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useElectricityStore } from '../../store/useElectricityStore';

interface AIInsight {
  id: string;
  type: 'tip' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'consumption' | 'cost' | 'efficiency' | 'pattern';
  actionable: boolean;
  estimatedSavings?: number;
}

export const AIInsights: React.FC = () => {
  const { chartData } = useElectricityStore();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recentData = chartData.slice(-30);
      const avgConsumption = recentData.length > 0 
        ? recentData.reduce((sum, point) => sum + point.kwh, 0) / recentData.length 
        : 0;
      
      const generatedInsights: AIInsight[] = [
        {
          id: '1',
          type: 'tip',
          title: 'Peak Usage Optimization',
          description: 'Your highest consumption occurs between 6-8 PM. Consider shifting energy-intensive activities to off-peak hours to reduce costs.',
          impact: 'high',
          category: 'efficiency',
          actionable: true,
          estimatedSavings: 15.50
        },
        {
          id: '2',
          type: 'success',
          title: 'Consistent Usage Pattern',
          description: 'Great job! Your energy usage has been consistent over the past month, showing good energy management habits.',
          impact: 'medium',
          category: 'pattern',
          actionable: false
        },
        {
          id: '3',
          type: 'warning',
          title: 'Above Average Consumption',
          description: `Your daily average of ${avgConsumption.toFixed(1)} kWh is 15% higher than the UK average. Consider energy-saving measures.`,
          impact: 'high',
          category: 'consumption',
          actionable: true,
          estimatedSavings: 25.00
        },
        {
          id: '4',
          type: 'info',
          title: 'Weekend Usage Spike',
          description: 'You use 20% more energy on weekends. This is normal but consider if any unnecessary appliances are left running.',
          impact: 'medium',
          category: 'pattern',
          actionable: true,
          estimatedSavings: 8.75
        },
        {
          id: '5',
          type: 'tip',
          title: 'Smart Thermostat Opportunity',
          description: 'Installing a smart thermostat could reduce your heating costs by up to 10% through better temperature control.',
          impact: 'high',
          category: 'efficiency',
          actionable: true,
          estimatedSavings: 30.00
        }
      ];
      
      setInsights(generatedInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chartData.length > 0) {
      generateInsights();
    }
  }, [chartData.length]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Zap className="h-5 w-5 text-blue-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'consumption':
        return <Zap className="h-4 w-4" />;
      case 'cost':
        return <DollarSign className="h-4 w-4" />;
      case 'efficiency':
        return <TrendingUp className="h-4 w-4" />;
      case 'pattern':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const totalSavings = insights
    .filter(insight => insight.estimatedSavings)
    .reduce((sum, insight) => sum + (insight.estimatedSavings || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI-Powered Insights
          </h2>
          <p className="text-muted-foreground">
            Personalized recommendations based on your energy usage patterns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button
            onClick={generateInsights}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Insights</p>
                <p className="text-2xl font-bold">{insights.length}</p>
              </div>
              <Sparkles className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actionable Tips</p>
                <p className="text-2xl font-bold">
                  {insights.filter(i => i.actionable).length}
                </p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold">£{totalSavings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            AI-generated insights based on your energy consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getImpactColor(insight.impact)}
                          >
                            {insight.impact} impact
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getCategoryIcon(insight.category)}
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      
                      {insight.estimatedSavings && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">
                            Potential savings: £{insight.estimatedSavings.toFixed(2)}/month
                          </span>
                        </div>
                      )}
                      
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="mt-2">
                          Learn More
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
