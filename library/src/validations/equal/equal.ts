import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that checks the value for equality.
 *
 * @deprecated Function has been renamed to `value`.
 *
 * @param requirement The required value.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function equal<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    type: 'equal' as const,
    message: error ?? 'Invalid input',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return input !== requirement
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
