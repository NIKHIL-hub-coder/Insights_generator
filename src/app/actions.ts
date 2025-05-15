
"use server";

import * as XLSX from 'xlsx';
import { generateDataInsights } from '@/ai/flows/generate-data-insights';
import { ragBasedQuestionAnswering } from '@/ai/flows/rag-based-question-answering';

export interface FileProcessInput {
  content: string | null; // Base64 string if isBinary & XLSX, raw string otherwise
  fileName: string | null;
  fileType: string | null; // Original MIME type
  isBinary: boolean; // True if content is Base64 encoded ArrayBuffer
}

async function prepareData(fileInfo: FileProcessInput): Promise<{ data?: string; error?: string }> {
  if (!fileInfo || !fileInfo.content || !fileInfo.fileName) {
    return { error: "File data is missing or incomplete." };
  }

  let dataToProcess = "";

  if (fileInfo.isBinary && (fileInfo.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileInfo.fileName.toLowerCase().endsWith('.xlsx'))) {
    try {
      const buffer = Buffer.from(fileInfo.content, 'base64');
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return { error: "XLSX file is empty or has no sheets." };
      }
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      dataToProcess = XLSX.utils.sheet_to_csv(worksheet);
    } catch (e: any) {
      console.error("Error processing XLSX file:", e);
      return { error: `Failed to parse XLSX file: ${e.message}` };
    }
  } else {
    dataToProcess = fileInfo.content;
  }

  if (!dataToProcess.trim()) {
    return { error: "Data cannot be empty after processing." };
  }
  return { data: dataToProcess };
}


export async function processDataAndGetGeneralInsights(
  fileInfo: FileProcessInput
): Promise<{ insights?: string; error?: string }> {
  const prepared = await prepareData(fileInfo);
  if (prepared.error || !prepared.data) {
    return { error: prepared.error || "Failed to prepare data." };
  }

  try {
    const result = await generateDataInsights({ data: prepared.data });
    return { insights: result.insights };
  } catch (e: any) {
    console.error("Error generating general insights:", e);
    return { error: e.message || "Failed to generate general insights." };
  }
}

export async function processDataAndAskQuestion(
  fileInfo: FileProcessInput,
  question: string
): Promise<{ answer?: string; error?: string }> {
  const prepared = await prepareData(fileInfo);
  if (prepared.error || !prepared.data) {
    return { error: prepared.error || "Failed to prepare data." };
  }
  
  if (!question.trim()) {
    return { error: "Question cannot be empty." };
  }

  try {
    const result = await ragBasedQuestionAnswering({ data: prepared.data, question });
    return { answer: result.answer };
  } catch (e: any) {
    console.error("Error answering question:", e);
    return { error: e.message || "Failed to answer question." };
  }
}
