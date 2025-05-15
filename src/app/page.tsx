
"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FileUpload } from '@/components/insight-flow/FileUpload';
import { QuerySection } from '@/components/insight-flow/QuerySection';
import { InsightDisplay } from '@/components/insight-flow/InsightDisplay';
import { processDataAndGetGeneralInsights, processDataAndAskQuestion, type FileProcessInput } from './actions';

export default function InsightFlowPage() {
  const [uploadedDataContent, setUploadedDataContent] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);
  const [isBinaryData, setIsBinaryData] = useState<boolean>(false);
  
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingType, setProcessingType] = useState<'question' | 'general' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUploaded = (content: string, fileName: string, fileType: string, isBinary: boolean) => {
    setUploadedDataContent(content);
    setUploadedFileName(fileName);
    setUploadedFileType(fileType);
    setIsBinaryData(isBinary);
    // Reset previous results when a new file is uploaded or cleared
    setInsights(null);
    setError(null);
  };

  const getFileProcessInput = (): FileProcessInput | null => {
    if (!uploadedDataContent || !uploadedFileName) {
      setError("Please upload data first.");
      return null;
    }
    return {
      content: uploadedDataContent,
      fileName: uploadedFileName,
      fileType: uploadedFileType,
      isBinary: isBinaryData,
    };
  };

  const handleGenerateInsights = async () => {
    const fileInfo = getFileProcessInput();
    if (!fileInfo) return;

    setIsLoading(true);
    setProcessingType('general');
    setError(null);
    setInsights(null);
    const result = await processDataAndGetGeneralInsights(fileInfo);
    if (result.insights) {
      setInsights(result.insights);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
    setProcessingType(null);
  };

  const handleAskQuestion = async (question: string) => {
    const fileInfo = getFileProcessInput();
    if (!fileInfo) return;
    
    setIsLoading(true);
    setProcessingType('question');
    setError(null);
    setInsights(null);
    const result = await processDataAndAskQuestion(fileInfo, question);
    if (result.answer) {
      setInsights(result.answer);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setIsLoading(false);
    setProcessingType(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
            Unlock Data Insights with AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your data (CSV, JSON, TXT, XLSX), ask questions, or let our AI generate key insights and trends for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <FileUpload onFileUploaded={handleFileUploaded} disabled={isLoading} />
          
          <QuerySection
            onAskQuestion={handleAskQuestion}
            onGenerateInsights={handleGenerateInsights}
            isProcessing={isLoading}
            processingType={processingType}
            disabled={!uploadedDataContent || isLoading}
          />
          
          <InsightDisplay
            insights={insights}
            isLoading={isLoading}
            error={error}
            fileName={uploadedFileName}
          />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-auto">
        © {new Date().getFullYear()} InsightFlow. Powered by AI.
      </footer>
    </div>
  );
}
