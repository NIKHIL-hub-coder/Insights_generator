
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
  prompt: `You are an expert data analyst.
The following is the dataset you need to analyze. It is provided as a string, typically in CSV format (even if originally from XLSX, JSON, or TXT, it has been prepared for you).

START OF DATASET
{{{data}}}
END OF DATASET

Based *solely* on the dataset provided above, perform a comprehensive analysis. Do not provide a potential analysis or outline; analyze the actual data.

Analysis Request:
{{#if query}}
  Focus your analysis on the following specific query, using *only* the dataset provided above:
  {{{query}}}
{{else}}
  Please perform a comprehensive analysis. Dig deep into the provided data to:
  1. Identify key trends and patterns (e.g., sales growth/decline over time if date information is present, common occurrences, correlations between different data points/columns).
  2. Highlight significant positive performers (e.g., best-selling items if applicable, top categories, entities with high values in key metrics).
  3. Pinpoint areas that are underperforming or may require attention (e.g., items with low sales, entities with low values in key metrics, potential outliers or anomalies indicating issues).
  4. Provide a concise summary of your most important findings. Focus on actionable insights and data-driven recommendations derived *directly* from the provided dataset.
  Present your findings in a clear, structured manner, based *only* on the dataset given.
{{/if}}

If the dataset appears empty, uninterpretable, or insufficient for the requested analysis, state that clearly and explain why, instead of inventing information.`,
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

