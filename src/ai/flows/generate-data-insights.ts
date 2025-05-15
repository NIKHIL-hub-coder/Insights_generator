
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
    .describe('The data to analyze, as a string (CSV, JSON, TXT, or XLSX content). For XLSX, the raw text content will be provided.'),
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
  prompt: `You are an expert data analyst. Analyze the following data and generate key insights and potential trends. The data could be in CSV, JSON, TXT, or raw text extracted from an XLSX file. If a query is provided, focus your analysis accordingly.

Data:
{{data}}

Query (Optional):
{{#if query}}
  {{query}}
{{else}}
  Provide a general overview of the data.
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
