import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl text-foreground mb-4">
            🎉 shadcn/ui Setup Complete!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your electricity tracker is now using shadcn/ui components with Tailwind CSS v3
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">✅ Configuration Fixed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Tailwind CSS v3 installed</li>
                <li>• shadcn/ui components ready</li>
                <li>• TypeScript paths configured</li>
                <li>• CSS variables set up</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">🚀 Ready to Build</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Button components working</li>
                <li>• Card components styled</li>
                <li>• Form components ready</li>
                <li>• Dark theme enabled</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="default">
            Primary Button
          </Button>
          <Button variant="secondary">
            Secondary Button
          </Button>
          <Button variant="outline">
            Outline Button
          </Button>
          <Button variant="ghost">
            Ghost Button
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Run <code className="bg-muted px-2 py-1 rounded">npm install</code> to install dependencies</li>
              <li>2. Run <code className="bg-muted px-2 py-1 rounded">npm run dev</code> to start development server</li>
              <li>3. Visit <code className="bg-muted px-2 py-1 rounded">http://localhost:5173</code> to see your app</li>
              <li>4. Start building your electricity tracker features!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
