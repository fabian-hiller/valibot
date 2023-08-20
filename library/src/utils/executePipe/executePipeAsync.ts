import type { Issues } from '../../error/index.ts';
import type { _ParseResult, PipeAsync, ValidateInfo } from '../../types.ts';

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
): Promise<_ParseResult<TValue>> {
  // Create issues and output
  let output: TValue = input;
  let issues: Issues | undefined;

  // Execute any action of pipe
  for (const action of pipe) {
    const result = await action(output, info);

    // If there are issues, capture them
    if (result.issues) {
      if (issues) {
        issues.push(...result.issues);
      } else {
        issues = result.issues;
      }

      // If necessary, abort early
      if (info.abortEarly || info.abortPipeEarly) {
        break;
      }

      // Otherwise, overwrite output
    } else {
      output = result.output;
    }
  }

  // Return pipe result
  return issues ? { issues } : { output };
}
