
// src/ai/flows/generate-data-insights.ts
'use server';
/**
 * @fileOverview AI flow for generating data insights from user-uploaded data.
 *
 * - generateDataInsights - A function that generates data insights.
 * - GenerateDataInsightsInput - The input type for the generateDataInsights function.
 * - GenerateDataInsightsOutput - The return type for the generateDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDataInsightsInputSchema = z.object({
  data: z
    .string()
    .describe('The data to analyze, as a string. This could be CSV, JSON, or TXT content directly, or data extracted from the first sheet of an XLSX file and converted to CSV format.'),
  query: z.string().optional().describe('Optional query to guide the insight generation.'),
});
export type GenerateDataInsightsInput = z.infer<
  typeof GenerateDataInsightsInputSchema
>;

const GenerateDataInsightsOutputSchema = z.object({
  insights: z.string().describe('The generated insights from the data.'),
});
export type GenerateDataInsightsOutput = z.infer<
  typeof GenerateDataInsightsOutputSchema
>;

export async function generateDataInsights(
  input: GenerateDataInsightsInput
): Promise<GenerateDataInsightsOutput> {
  return generateDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDataInsightsPrompt',
  input: {schema: GenerateDataInsightsInputSchema},
  output: {schema: GenerateDataInsightsOutputSchema},
  prompt: `You are an expert data analyst. Your task is to analyze the provided dataset and generate insightful observations. The data could be in CSV, JSON, or TXT format. If it originated from an XLSX file, it has been converted from its first sheet to CSV format.

Data:
{{{data}}}

Analysis Request:
{{#if query}}
  Focus your analysis on the following specific query:
  {{{query}}}
{{else}}
  Please perform a comprehensive analysis. Dig deep into the data to:
  1. Identify key trends and patterns (e.g., sales growth/decline over time, seasonal variations, correlations between different data points).
  2. Highlight significant positive performers (e.g., best-selling products, top-performing regions or categories, most effective strategies).
  3. Pinpoint areas that are underperforming or may require attention (e.g., products with declining sales, regions with low activity, potential bottlenecks or issues).
  4. Provide a concise summary of your most important findings, focusing on actionable insights and data-driven recommendations where possible.
  Present your findings in a clear, structured manner.
{{/if}}`,
});

const generateDataInsightsFlow = ai.defineFlow(
  {
    name: 'generateDataInsightsFlow',
    inputSchema: GenerateDataInsightsInputSchema,
    outputSchema: GenerateDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

