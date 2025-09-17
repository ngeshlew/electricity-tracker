import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign,
  Plus,
  Search,
  Eye
} from "lucide-react";
import { useElectricityStore } from '../../store/useElectricityStore';

interface Statement {
  id: string;
  month: string;
  year: number;
  totalConsumption: number;
  totalCost: number;
  averageDailyConsumption: number;
  averageDailyCost: number;
  peakDay: string;
  peakConsumption: number;
  efficiencyScore: number;
  generatedAt: Date;
  status: 'draft' | 'final' | 'archived';
}

export const StatementsPage: React.FC = () => {
  const { readings } = useElectricityStore();
  const [statements, setStatements] = useState<Statement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate monthly statements from readings
  const generateStatements = () => {
    if (readings.length === 0) return [];

    const monthlyData = readings.reduce((acc, reading) => {
      const date = new Date(reading.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          readings: [],
          totalConsumption: 0,
          totalCost: 0
        };
      }
      
      acc[monthKey].readings.push(reading);
      acc[monthKey].totalConsumption += reading.consumption || 0;
      acc[monthKey].totalCost += reading.cost || 0;
      
      return acc;
    }, {} as { [key: string]: { readings: any[], totalConsumption: number, totalCost: number } });

    const generatedStatements: Statement[] = Object.entries(monthlyData).map(([monthKey, data]) => {
      const [year, month] = monthKey.split('-');
      const daysInMonth = data.readings.length;
      const avgDailyConsumption = data.totalConsumption / daysInMonth;
      const avgDailyCost = data.totalCost / daysInMonth;
      
      // Find peak day
      const peakReading = data.readings.reduce((max, reading) => 
        (reading.consumption || 0) > (max.consumption || 0) ? reading : max
      );
      
      // Calculate efficiency score (0-100)
      const ukAverage = 8.5;
      const efficiencyScore = Math.max(0, Math.min(100, 100 - ((avgDailyConsumption - ukAverage) / ukAverage) * 100));
      
      return {
        id: monthKey,
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-GB', { month: 'long' }),
        year: parseInt(year),
        totalConsumption: data.totalConsumption,
        totalCost: data.totalCost,
        averageDailyConsumption: avgDailyConsumption,
        averageDailyCost: avgDailyCost,
        peakDay: new Date(peakReading.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        peakConsumption: peakReading.consumption || 0,
        efficiencyScore,
        generatedAt: new Date(),
        status: 'final' as const
      };
    });

    return generatedStatements.sort((a, b) => b.year - a.year || b.month.localeCompare(a.month));
  };

  // Generate statements on component mount
  React.useEffect(() => {
    const generatedStatements = generateStatements();
    setStatements(generatedStatements);
  }, [readings]);

  // Filter statements based on search and year
  const filteredStatements = statements.filter(statement => {
    const matchesSearch = statement.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         statement.year.toString().includes(searchTerm);
    const matchesYear = statement.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  // Get available years
  const availableYears = [...new Set(statements.map(s => s.year))].sort((a, b) => b - a);

  // Generate new statement
  const handleGenerateStatement = async () => {
    setIsGenerating(true);
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatements = generateStatements();
      setStatements(newStatements);
    } catch (error) {
      console.error('Failed to generate statement:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download statement as PDF
  const handleDownloadStatement = (statement: Statement) => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading statement:', statement.id);
    // For now, just show an alert
    alert(`Downloading statement for ${statement.month} ${statement.year}`);
  };

  // View statement details
  const handleViewStatement = (statement: Statement) => {
    console.log('Viewing statement:', statement.id);
    // In a real implementation, this would open a detailed view
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Statements
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate, view, and manage your electricity consumption statements
            </p>
          </div>
          <Button onClick={handleGenerateStatement} disabled={isGenerating}>
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Generate Statement
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statements.length}</div>
            <p className="text-xs text-muted-foreground">
              Generated statements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statements.filter(s => s.year === new Date().getFullYear()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Statements in {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{statements.reduce((sum, s) => sum + s.totalCost, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⚡</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statements.length > 0 
                ? (statements.reduce((sum, s) => sum + s.efficiencyScore, 0) / statements.length).toFixed(0)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average efficiency score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Statements</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by month or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="year">Filter by Year</Label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statements List */}
      <div className="space-y-4">
        {filteredStatements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Statements Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || selectedYear !== new Date().getFullYear()
                  ? 'No statements match your current filters.'
                  : 'Generate your first statement to get started.'}
              </p>
              {!searchTerm && selectedYear === new Date().getFullYear() && (
                <Button onClick={handleGenerateStatement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Statement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredStatements.map((statement) => (
            <Card key={statement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {statement.month} {statement.year}
                      </h3>
                      <Badge variant={statement.status === 'final' ? 'default' : 'secondary'}>
                        {statement.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Consumption</span>
                        <div className="font-semibold">{statement.totalConsumption.toFixed(1)} kWh</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Cost</span>
                        <div className="font-semibold">£{statement.totalCost.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Peak Day</span>
                        <div className="font-semibold">{statement.peakDay} ({statement.peakConsumption.toFixed(1)} kWh)</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency Score</span>
                        <div className="font-semibold">{statement.efficiencyScore.toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewStatement(statement)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadStatement(statement)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
