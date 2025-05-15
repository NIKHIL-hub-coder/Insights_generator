
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface InsightDisplayProps {
  insights: string | null;
  isLoading: boolean;
  error: string | null;
  fileName?: string | null;
}

export function InsightDisplay({ insights, isLoading, error, fileName }: InsightDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          View Insights
        </CardTitle>
        {fileName && !isLoading && !error && insights && (
          <CardDescription>Showing insights for: <span className="font-semibold text-accent">{fileName}</span></CardDescription>
        )}
         {!fileName && !isLoading && !error && !insights && (
          <CardDescription>Upload data and generate insights to see results here.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-muted/30">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Generating insights...</p>
              <p className="text-sm">This may take a few moments.</p>
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive" className="h-full flex flex-col justify-center items-center">
              <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
              <AlertTitle className="text-lg font-semibold">Error Generating Insights</AlertTitle>
              <AlertDescription className="text-center">
                {error}
                <br />
                Please try again or check your data.
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && insights && (
            <>
            <Alert variant="default" className="mb-4 border-green-500 bg-green-50 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-700 dark:text-green-300">Insights Generated Successfully</AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-500">
                Scroll down to view the detailed analysis of your data.
              </AlertDescription>
            </Alert>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {insights}
            </pre>
            </>
          )}
          {!isLoading && !error && !insights && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No insights to display</p>
              <p className="text-sm">Upload a file and generate insights to see them here.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
