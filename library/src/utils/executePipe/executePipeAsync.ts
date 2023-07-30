import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { PipeAsync, ValidateInfo } from '../../types.ts';

/**
 * Executes the async validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param info The validation info.
 *
 * @returns The output value.
 */
export async function executePipeAsync<TValue>(
  input: TValue,
  pipe: PipeAsync<TValue>,
  info: ValidateInfo
): Promise<TValue> {
  // Create output and issues
  let output: TValue = input;
  const issues: Issue[] = [];

  // Execute any action of pipe
  for (const action of pipe) {
    try {
      output = await action(output, info);

      // Throw or fill issues in case of an error
    } catch (error) {
      if (info.abortEarly || info.abortPipeEarly) {
        throw error;
      }
      issues.push(...(error as ValiError).issues);
    }
  }

  // Throw error if there are issues
  if (issues.length) {
    throw new ValiError(issues as Issues);
  }

  // Return output of pipe
  return output;
}
