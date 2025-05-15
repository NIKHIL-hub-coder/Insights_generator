
"use server";

import { generateDataInsights } from '@/ai/flows/generate-data-insights';
import { ragBasedQuestionAnswering } from '@/ai/flows/rag-based-question-answering';

export async function processDataAndGetGeneralInsights(
  data: string
): Promise<{ insights?: string; error?: string }> {
  if (!data.trim()) {
    return { error: "Data cannot be empty." };
  }
  try {
    const result = await generateDataInsights({ data });
    return { insights: result.insights };
  } catch (e: any) {
    console.error("Error generating general insights:", e);
    return { error: e.message || "Failed to generate general insights." };
  }
}

export async function processDataAndAskQuestion(
  data: string,
  question: string
): Promise<{ answer?: string; error?: string }> {
  if (!data.trim()) {
    return { error: "Data cannot be empty." };
  }
  if (!question.trim()) {
    return { error: "Question cannot be empty." };
  }
  try {
    const result = await ragBasedQuestionAnswering({ data, question });
    return { answer: result.answer };
  } catch (e: any) {
    console.error("Error answering question:", e);
    return { error: e.message || "Failed to answer question." };
  }
}
