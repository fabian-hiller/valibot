import type { IssueReason, Issues } from '../../error/index.ts';
import type {
  _ParseResult,
  ParseInfo,
  PipeAsync,
  PipeInfo,
} from '../../types.ts';
import { getIssue } from '../getIssue/index.ts';
import { getPipeInfo } from '../getPipeInfo/index.ts';

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
  pipe: PipeAsync<TValue> | undefined,
  parseInfo: ParseInfo | undefined,
  reason: IssueReason
): Promise<_ParseResult<TValue>> {
  // If pipe is empty, return input as output
  if (!pipe || !pipe.length) {
    return { output: input };
  }

  // Create pipe info, issues and output
  let pipeInfo: PipeInfo | undefined;
  let issues: Issues | undefined;
  let output: TValue = input;

  // Execute any action of pipe
  for (const action of pipe) {
    const result = await action(output);

    // If there is a issue, capture it
    if (result.issue) {
      // Cache pipe info lazy
      pipeInfo = pipeInfo || getPipeInfo(parseInfo, reason);

      // Create issue and add it to issues
      const issue = getIssue(pipeInfo, result.issue);
      issues ? issues.push(issue) : (issues = [issue]);

      // If necessary, abort early
      if (pipeInfo.abortEarly || pipeInfo.abortPipeEarly) {
        break;
      }

      // Otherwise, overwrite output
    } else {
      output = result.output;
    }
  }

  // Return pipe issues or output
  return issues ? { issues } : { output };
}
