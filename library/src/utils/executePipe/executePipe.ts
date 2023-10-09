import type {
  _ParseResult,
  IssueReason,
  Issues,
  ParseInfo,
  Pipe,
  PipeInfo,
} from '../../types.ts';
import { getIssues } from '../getIssues/getIssues.ts';
import { getOutput } from '../getOutput/getOutput.ts';
import { getIssue, getPipeInfo } from './utils/index.ts';

/**
 * Executes the validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param parseInfo The parse info.
 * @param reason The issue reason.
 *
 * @returns The output value.
 */
export function executePipe<TValue>(
  input: TValue,
  pipe: Pipe<TValue> | undefined,
  parseInfo: ParseInfo | undefined,
  reason: IssueReason
): _ParseResult<TValue> {
  // If pipe is empty, return input as output
  if (!pipe || !pipe.length || parseInfo?.skipPipe) {
    return getOutput(input);
  }

  // Create pipe info, issues and output
  let pipeInfo: PipeInfo | undefined;
  let issues: Issues | undefined;
  let output: TValue = input;

  // Execute any action of pipe
  for (const action of pipe) {
    const result = action(output);

    // If there are issues, capture them
    if (result.issues) {
      // Cache pipe info lazy
      pipeInfo = pipeInfo || getPipeInfo(parseInfo, reason);

      // Create each issue and add it to issues
      for (const issueInfo of result.issues) {
        const issue = getIssue(pipeInfo, issueInfo);
        issues ? issues.push(issue) : (issues = [issue]);
      }

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
  return issues ? getIssues(issues) : getOutput(output);
}
