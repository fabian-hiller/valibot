import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param error The error message.
 *
 * @returns A async validation function.
 */
export function customAsync<TInput>(
  requirement: (input: TInput) => Promise<boolean>,
  error?: ErrorMessage
) {
  return {
    type: 'custom' as const,
    message: error ?? 'Invalid input',
    requirement,
    async _parse(input: TInput): Promise<PipeResult<TInput>> {
      return !(await requirement(input))
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
