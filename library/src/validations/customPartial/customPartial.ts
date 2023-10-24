import type { ErrorMessage, PipeResult } from '../../types.js';
import { getOutput, getPipeIssues } from '../../utils/index.js';

/**
 * Creates a custom validation function that validates the part object schema.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function customPartial<TInput, TKeys extends keyof TInput>(
  requiredFields: TKeys[],
  requirement: (input: Pick<TInput, TKeys>) => boolean,
  error?: ErrorMessage
  // TODO: path
) {
  const pipe = (input: TInput): PipeResult<TInput> =>
    !requirement(input)
      ? getPipeIssues('customPartial', error || 'Invalid input', input)
      : getOutput(input);

  pipe.partial = requiredFields;
  return pipe;
}
