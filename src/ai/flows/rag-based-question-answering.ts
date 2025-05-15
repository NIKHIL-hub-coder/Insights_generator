
'use server';

/**
 * @fileOverview Implements a RAG-based question answering flow over user-provided data.
 *
 * - ragBasedQuestionAnswering: An async function that accepts a question and data and returns an answer.
 * - RagBasedQuestionAnsweringInput: The input type for the ragBasedQuestionAnswering function.
 * - RagBasedQuestionAnsweringOutput: The return type for the ragBasedQuestionAnswering function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RagBasedQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The question to ask about the data.'),
  data: z.string().describe('The data to answer the question based on. This could be CSV, JSON, or TXT content directly, or data extracted from the first sheet of an XLSX file and converted to CSV format.'),
});
export type RagBasedQuestionAnsweringInput = z.infer<
  typeof RagBasedQuestionAnsweringInputSchema
>;

const RagBasedQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type RagBasedQuestionAnsweringOutput = z.infer<
  typeof RagBasedQuestionAnsweringOutputSchema
>;

export async function ragBasedQuestionAnswering(
  input: RagBasedQuestionAnsweringInput
): Promise<RagBasedQuestionAnsweringOutput> {
  return ragBasedQuestionAnsweringFlow(input);
}

const ragBasedQuestionAnsweringPrompt = ai.definePrompt({
  name: 'ragBasedQuestionAnsweringPrompt',
  input: {schema: RagBasedQuestionAnsweringInputSchema},
  output: {schema: RagBasedQuestionAnsweringOutputSchema},
  prompt: `You are an AI assistant. Your task is to answer the question based *only* on the provided dataset.
The dataset is provided as a string, typically in CSV format (even if originally from XLSX, JSON, or TXT, it has been prepared for you).

START OF DATASET
{{{data}}}
END OF DATASET

Question: {{{question}}}

Based *solely* on the dataset provided above, answer the question. If the answer cannot be found in the dataset, clearly state that the information is not available in the provided data. Do not invent information.

Answer:`,
});

const ragBasedQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'ragBasedQuestionAnsweringFlow',
    inputSchema: RagBasedQuestionAnsweringInputSchema,
    outputSchema: RagBasedQuestionAnsweringOutputSchema,
  },
  async input => {
    const {output} = await ragBasedQuestionAnsweringPrompt(input);
    return output!;
  }
);
