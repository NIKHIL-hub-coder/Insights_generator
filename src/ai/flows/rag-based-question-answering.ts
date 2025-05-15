
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
  data: z.string().describe('The data to answer the question based on (CSV, JSON, TXT, or raw text extracted from XLSX).'),
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
  prompt: `Answer the following question based on the provided data. The data could be in CSV, JSON, TXT, or raw text extracted from an XLSX file.\n\nData:\n{{{data}}}\n\nQuestion: {{{question}}}\n\nAnswer:`,
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
