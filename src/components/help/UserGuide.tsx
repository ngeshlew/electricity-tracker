import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-simple';
import { Button } from '@/components/ui/button-simple';
import { 
  QuestionMarkCircleIcon,
  XMarkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BookOpenIcon,
  LightBulbIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const UserGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpenIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Welcome to Electricity Tracker!</h4>
          <p className="text-muted-foreground">
            This guide will help you get the most out of your electricity tracking dashboard.
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-electric-purple/20 rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <p className="font-medium">Add Your First Reading</p>
                <p className="text-sm text-muted-foreground">Click the "Add Reading" button to record your first meter reading.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-electric-purple/20 rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <p className="font-medium">Explore Analytics</p>
                <p className="text-sm text-muted-foreground">Switch to the Analytics tab to view consumption trends and charts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-electric-purple/20 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium">Upload Statements</p>
                <p className="text-sm text-muted-foreground">Use the Statements tab to upload and process your energy bills.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'adding-readings',
      title: 'Adding Meter Readings',
      icon: <CogIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">How to Add Meter Readings</h4>
          <div className="space-y-3">
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Manual Entry</p>
              <p className="text-sm text-muted-foreground">
                Click the "Add Reading" button, enter your meter reading, select the date, and add any notes.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Statement Upload</p>
              <p className="text-sm text-muted-foreground">
                Upload PDF, CSV, or Excel files containing your energy statements for automatic processing.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Tips for Accurate Tracking</p>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li>• Take readings at the same time each month</li>
                <li>• Record readings immediately to avoid forgetting</li>
                <li>• Include notes for any unusual circumstances</li>
                <li>• Double-check your readings before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'understanding-analytics',
      title: 'Understanding Analytics',
      icon: <ChartBarIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Analytics Dashboard</h4>
          <div className="space-y-3">
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Monthly Overview</p>
              <p className="text-sm text-muted-foreground">
                View your total consumption, costs, and daily averages for the current month.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Weekly Breakdown</p>
              <p className="text-sm text-muted-foreground">
                See how your consumption varies throughout the month with interactive pie charts.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">Daily Trends</p>
              <p className="text-sm text-muted-foreground">
                Track daily consumption patterns and identify peak usage days.
              </p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="font-medium mb-2">View Modes</p>
              <p className="text-sm text-muted-foreground">
                Switch between kWh and Cost views to see your data in different perspectives.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tips-tricks',
      title: 'Tips & Tricks',
      icon: <LightBulbIcon className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Maximize Your Savings</h4>
          <div className="space-y-3">
            <div className="p-4 bg-electric-green/10 border border-electric-green/20 rounded-lg">
              <p className="font-medium text-electric-green mb-2">💡 Energy Saving Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use LED bulbs instead of incandescent</li>
                <li>• Unplug devices when not in use</li>
                <li>• Use energy-efficient appliances</li>
                <li>• Consider time-of-use pricing</li>
              </ul>
            </div>
            <div className="p-4 bg-electric-blue/10 border border-electric-blue/20 rounded-lg">
              <p className="font-medium text-electric-blue mb-2">📊 Data Analysis</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Look for patterns in your consumption</li>
                <li>• Compare month-over-month trends</li>
                <li>• Identify peak usage periods</li>
                <li>• Set consumption goals</li>
              </ul>
            </div>
            <div className="p-4 bg-electric-purple/10 border border-electric-purple/20 rounded-lg">
              <p className="font-medium text-electric-purple mb-2">🔧 App Features</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Export data for external analysis</li>
                <li>• Use mobile app for quick readings</li>
                <li>• Set up notifications for reminders</li>
                <li>• Share data with family members</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-6 right-6 z-50 lewis-card-hover"
        title="Open User Guide"
      >
        <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
        Help
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="lewis-card lewis-shadow-glow max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold lewis-text-gradient flex items-center space-x-2">
            <QuestionMarkCircleIcon className="h-6 w-6" />
            <span>User Guide</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lewis-card-hover"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {guideSections.map((section) => (
              <div key={section.id} className="border border-border rounded-lg">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between lewis-card-hover"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-electric-purple">
                      {section.icon}
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </div>
                  {activeSection === section.id ? (
                    <ChevronDownIcon className="h-5 w-5" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                  )}
                </button>
                
                {activeSection === section.id && (
                  <div className="px-4 pb-4 border-t border-border">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-semibold mb-2">Need More Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you can't find what you're looking for, check out our full documentation or contact support.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="lewis-card-hover">
                Full Documentation
              </Button>
              <Button variant="outline" size="sm" className="lewis-card-hover">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
