
"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUploaded: (content: string, fileName: string, fileType: string, isBinary: boolean) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileUploaded, disabled }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const processFile = useCallback((file: File) => {
    const allowedTextTypes = ['text/csv', 'application/json', 'text/plain'];
    const xlsxMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const isXlsx = file.type === xlsxMimeType || file.name.endsWith('.xlsx');

    if (!allowedTextTypes.includes(file.type) && !isXlsx) {
      toast({
        title: 'Invalid File Type',
        description: `Please upload a CSV, JSON, TXT, or XLSX file. Got: ${file.type || file.name.split('.').pop()}`,
        variant: 'destructive',
      });
      setSelectedFile(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (isXlsx) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        setSelectedFile(file);
        onFileUploaded(base64String, file.name, file.type, true);
        toast({
          title: 'File Uploaded',
          description: `${file.name} (XLSX) has been successfully loaded. It will be converted for analysis.`,
        });
      } else {
        const content = e.target?.result as string;
        setSelectedFile(file);
        onFileUploaded(content, file.name, file.type, false);
        toast({
          title: 'File Uploaded',
          description: `${file.name} has been successfully loaded.`,
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: `Could not read file: ${file.name}`,
        variant: 'destructive',
      });
      setSelectedFile(null);
    };

    if (isXlsx) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, [onFileUploaded, toast]);
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile, disabled]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);


  const clearFile = () => {
    setSelectedFile(null);
    onFileUploaded('', '', '', false); // Notify parent that file is cleared
  };

  return (
    <Card className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          Upload Your Data
        </CardTitle>
        <CardDescription>Drag & drop or click to upload a CSV, JSON, TXT, or XLSX file.</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile} aria-label="Clear file">
                <XCircle className="h-5 w-5 text-destructive" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              File loaded. You can now proceed to generate insights or ask questions below. To use a different file, clear the current one.
            </p>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors
              ${isDragging ? 'border-primary bg-accent/20' : 'border-border'}
              ${disabled ? 'cursor-not-allowed' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && document.getElementById('file-upload-input')?.click()}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') !disabled && document.getElementById('file-upload-input')?.click()}}
          >
            <UploadCloud className={`h-12 w-12 mb-2 ${isDragging ? 'text-primary': 'text-muted-foreground'}`} />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">CSV, JSON, TXT, or XLSX files</p>
            <Input
              id="file-upload-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv,.json,.txt,.xlsx,text/csv,application/json,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              disabled={disabled}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
