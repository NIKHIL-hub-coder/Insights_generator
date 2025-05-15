
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Zap, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuerySectionProps {
  onAskQuestion: (question: string) => void;
  onGenerateInsights: () => void;
  isProcessing: boolean;
  processingType: 'question' | 'general' | null;
  disabled?: boolean;
}

export function QuerySection({
  onAskQuestion,
  onGenerateInsights,
  isProcessing,
  processingType,
  disabled,
}: QuerySectionProps) {
  const [query, setQuery] = useState('');

  const handleAskQuestion = () => {
    if (query.trim()) {
      onAskQuestion(query);
    }
  };

  return (
    <Card className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Generate Insights
        </CardTitle>
        <CardDescription>
          Ask a specific question about your uploaded data or request general insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="query-input" className="text-base font-semibold">Ask a Specific Question</Label>
          <Textarea
            id="query-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What are the sales trends for product X? Which region has the highest growth?"
            rows={3}
            className="text-sm"
            disabled={isProcessing || disabled}
          />
          <Button
            onClick={handleAskQuestion}
            disabled={!query.trim() || isProcessing || disabled}
            className="w-full sm:w-auto mt-2"
            variant="outline"
          >
            {isProcessing && processingType === 'question' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Ask Question
          </Button>
        </div>

        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-4 text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Generate General Insights</Label>
          <p className="text-sm text-muted-foreground">Let AI analyze your data and provide an overall summary and key findings.</p>
          <Button
            onClick={onGenerateInsights}
            disabled={isProcessing || disabled}
            className="w-full sm:w-auto mt-2"
            variant="default"
          >
            {isProcessing && processingType === 'general' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            Generate General Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
