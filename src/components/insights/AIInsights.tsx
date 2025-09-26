import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 

  RefreshCw,
  ChevronRight,
  BarChart3,
  PieChart
} from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';

interface Insight {
  id: string;
  type: 'pattern' | 'recommendation' | 'anomaly' | 'forecast';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: 'cost' | 'usage' | 'efficiency' | 'timing';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface ConsumptionPattern {
  peakHours: number[];
  averageDailyUsage: number;
  weeklyPattern: { [key: string]: number };
  seasonalTrend: 'increasing' | 'decreasing' | 'stable';
  costPerKwh: number;
  efficiencyScore: number;
}

export const AIInsights: React.FC = () => {
  const { readings } = useElectricityStore();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [patterns, setPatterns] = useState<ConsumptionPattern | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleTabChange = (val: string) => setSelectedCategory(val);

  // Analyze consumption patterns and generate insights
  const analyzeConsumption = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newInsights = generateInsights(readings, []);
      const newPatterns = analyzePatterns(readings, []);
      
      setInsights(newInsights);
      setPatterns(newPatterns);
    } catch (error) {
      console.error('Failed to analyze consumption:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate AI insights based on consumption data
  const generateInsights = (readings: any[], _chartData: any[]): Insight[] => {
    const insights: Insight[] = [];
    
    if (readings.length < 7) {
      insights.push({
        id: 'insufficient-data',
        type: 'recommendation',
        title: 'More Data Needed',
        description: 'Add more meter readings to unlock AI-powered insights and recommendations.',
        impact: 'medium',
        confidence: 0.9,
        category: 'usage',
        actionable: true,
        actionText: 'Add Reading',
        actionUrl: '/dashboard'
      });
      return insights;
    }

    // Calculate average daily consumption
    const totalConsumption = readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0);
    const days = readings.length;
    const avgDailyConsumption = totalConsumption / days;

    // UK average daily consumption (kWh)
    const ukAverage = 8.5;
    const efficiencyRatio = avgDailyConsumption / ukAverage;

    // High consumption alert
    if (efficiencyRatio > 1.2) {
      insights.push({
        id: 'high-consumption',
        type: 'anomaly',
        title: 'Above Average Consumption',
        description: `Your daily consumption (${avgDailyConsumption.toFixed(1)} kWh) is ${((efficiencyRatio - 1) * 100).toFixed(0)}% above UK average.`,
        impact: 'high',
        confidence: 0.85,
        category: 'usage',
        actionable: true,
        actionText: 'View Tips',
        actionUrl: '/analytics'
      });
    }

    // Cost optimization
    const totalCost = readings.reduce((sum, reading) => sum + (reading.cost || 0), 0);
    const avgDailyCost = totalCost / days;
    
    if (avgDailyCost > 2.5) {
      insights.push({
        id: 'high-cost',
        type: 'recommendation',
        title: 'Cost Optimization Opportunity',
        description: `Daily electricity cost is £${avgDailyCost.toFixed(2)}. Consider switching to off-peak usage or energy-efficient appliances.`,
        impact: 'high',
        confidence: 0.8,
        category: 'cost',
        actionable: true,
        actionText: 'View Recommendations',
        actionUrl: '/settings'
      });
    }

    // Usage pattern analysis
    const recentReadings = readings.slice(-7);
    const hasConsistentUsage = recentReadings.every((reading, index) => {
      if (index === 0) return true;
      const prevReading = recentReadings[index - 1];
      const diff = Math.abs((reading.consumption || 0) - (prevReading.consumption || 0));
      return diff < 5; // Less than 5 kWh difference
    });

    if (hasConsistentUsage) {
      insights.push({
        id: 'consistent-usage',
        type: 'pattern',
        title: 'Consistent Usage Pattern',
        description: 'Your electricity usage shows good consistency. This helps with budgeting and energy planning.',
        impact: 'medium',
        confidence: 0.9,
        category: 'efficiency',
        actionable: false
      });
    }

    // Seasonal trend analysis
    const monthlyData = {} as { [key: number]: number[] };

    const monthlyAverages = Object.entries(monthlyData).map(([month, values]) => ({
      month: parseInt(month),
      average: (values as number[]).reduce((sum: number, val: number) => sum + val, 0) / (values as number[]).length
    }));

    if (monthlyAverages.length >= 2) {
      const trend = monthlyAverages[monthlyAverages.length - 1].average - monthlyAverages[0].average;
      if (Math.abs(trend) > 2) {
        insights.push({
          id: 'seasonal-trend',
          type: 'pattern',
          title: trend > 0 ? 'Increasing Usage Trend' : 'Decreasing Usage Trend',
          description: `Your consumption shows a ${trend > 0 ? 'rising' : 'falling'} trend of ${Math.abs(trend).toFixed(1)} kWh per month.`,
          impact: 'medium',
          confidence: 0.75,
          category: 'usage',
          actionable: true,
          actionText: 'View Trends',
          actionUrl: '/analytics'
        });
      }
    }

    // Efficiency recommendations
    if (efficiencyRatio < 0.8) {
      insights.push({
        id: 'efficient-usage',
        type: 'pattern',
        title: 'Efficient Energy Usage',
        description: 'Great job! Your consumption is below UK average. Keep up the good work with energy-saving habits.',
        impact: 'low',
        confidence: 0.9,
        category: 'efficiency',
        actionable: false
      });
    } else if (efficiencyRatio > 1.0 && efficiencyRatio < 1.2) {
      insights.push({
        id: 'improvement-opportunity',
        type: 'recommendation',
        title: 'Energy Efficiency Tips',
        description: 'Small changes could reduce your consumption. Consider LED bulbs, smart thermostats, or energy-efficient appliances.',
        impact: 'medium',
        confidence: 0.8,
        category: 'efficiency',
        actionable: true,
        actionText: 'Get Tips',
        actionUrl: '/settings'
      });
    }

    return insights;
  };

  // Analyze consumption patterns
  const analyzePatterns = (readings: any[], _chartData: any[]): ConsumptionPattern => {
    const totalConsumption = readings.reduce((sum, reading) => sum + (reading.consumption || 0), 0);
    const days = readings.length;
    const avgDailyUsage = totalConsumption / days;
    
    // Calculate cost per kWh
    const totalCost = readings.reduce((sum, reading) => sum + (reading.cost || 0), 0);
    const costPerKwh = totalCost / totalConsumption;

    // Analyze weekly patterns (simplified)
    const weeklyPattern = {
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0,
      'Sunday': 0
    };

    // Calculate efficiency score (0-100)
    const ukAverage = 8.5;
    const efficiencyScore = Math.max(0, Math.min(100, 100 - ((avgDailyUsage - ukAverage) / ukAverage) * 100));

    return {
      peakHours: [18, 19, 20], // Evening peak hours
      averageDailyUsage: avgDailyUsage,
      weeklyPattern,
      seasonalTrend: 'stable',
      costPerKwh,
      efficiencyScore
    };
  };

  // Filter insights by category
  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <BarChart3 className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      case 'forecast': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cost': return 'bg-green-100 text-green-800';
      case 'usage': return 'bg-blue-100 text-blue-800';
      case 'efficiency': return 'bg-purple-100 text-purple-800';
      case 'timing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (readings.length > 0) {
      analyzeConsumption();
    }
  }, [readings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI-Powered Insights
          </h2>
          <p className="text-muted-foreground">
            Intelligent analysis of your electricity consumption patterns
          </p>
        </div>
        <Button 
          onClick={analyzeConsumption} 
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Consumption Patterns Overview */}
      {patterns && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Consumption Patterns
            </CardTitle>
            <CardDescription>
              AI analysis of your electricity usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {patterns.averageDailyUsage.toFixed(1)} kWh
                </div>
                <div className="text-sm text-muted-foreground">Daily Average</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  £{patterns.costPerKwh.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">Cost per kWh</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {patterns.efficiencyScore.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Efficiency Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Tabs */}
      <Tabs value={selectedCategory} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredInsights.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                <p className="text-muted-foreground text-center">
                  Add more meter readings to unlock AI-powered insights and recommendations.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            {getInsightIcon(insight.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge variant={getImpactColor(insight.impact)}>
                              {insight.impact}
                            </Badge>
                            <Badge variant="outline" className={getCategoryColor(insight.category)}>
                              {insight.category}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {insight.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                            {insight.actionable && insight.actionText && (
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                {insight.actionText}
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
