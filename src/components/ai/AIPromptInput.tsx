import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Zap,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';

interface AIPromptInputProps {
  onPromptSubmit: (prompt: string) => void;
  isLoading?: boolean;
  className?: string;
}

const suggestedPrompts = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Analyze my consumption trends",
    category: "analytics"
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    text: "How can I reduce my electricity bill?",
    category: "cost"
  },
  {
    icon: <Lightbulb className="h-4 w-4" />,
    text: "Suggest energy-saving tips",
    category: "tips"
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    text: "What are my peak usage hours?",
    category: "patterns"
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    text: "Compare this month vs last month",
    category: "comparison"
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "Identify unusual usage patterns",
    category: "anomalies"
  }
];

export const AIPromptInput: React.FC<AIPromptInputProps> = ({
  onPromptSubmit,
  isLoading = false,
  className
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  const filteredPrompts = selectedCategory 
    ? suggestedPrompts.filter(p => p.category === selectedCategory)
    : suggestedPrompts;

  const categories = Array.from(new Set(suggestedPrompts.map(p => p.category)));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Energy Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your energy usage, get insights, and receive personalized recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Suggested prompts:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredPrompts.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-auto p-3 text-left"
                onClick={() => handleSuggestedPrompt(suggestion.text)}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  {suggestion.icon}
                  <span className="text-sm">{suggestion.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Your question or request:
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me anything about your energy usage... (e.g., 'How can I reduce my electricity bill?' or 'What are my peak usage hours?')"
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <span className="text-xs text-muted-foreground">
                {prompt.length}/500 characters
              </span>
            </div>
            
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Ask AI
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Tips */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>💡 Tip:</strong> Be specific in your questions. For example, instead of "help me save money," 
            try "what are the most expensive appliances in my home?" or "how can I reduce my peak hour usage?"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
