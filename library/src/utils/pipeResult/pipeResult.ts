import type {
  SchemaResult,
  IssueReason,
  Issues,
  ParseInfo,
  Pipe,
  PipeInfo,
} from '../../types/index.ts';
import { parseResult } from '../parseResult/index.ts';
import { pipeInfo, pipeIssue } from './utils/index.ts';

/**
 * Executes the validation and transformation pipe.
 *
 * @param input The input value.
 * @param pipe The pipe to be executed.
 * @param parseInfo The parse info.
 * @param reason The issue reason.
 * @param issues The issues if any.
 *
 * @returns The output value.
 */
export function pipeResult<TValue>(
  input: TValue,
  pipe: Pipe<TValue> | undefined,
  parseInfo: ParseInfo | undefined,
  reason: IssueReason,
  issues?: Issues
): SchemaResult<TValue> {
  // Create info and output
  let info: PipeInfo | undefined;
  let output: TValue = input;

  // Execute any action of pipe if necessary
  if (pipe?.length && !parseInfo?.skipPipe) {
    for (const action of pipe) {
      const result = action._parse(output);

      // If there are issues, capture them
      if (result.issues) {
        // Cache pipe info lazy
        info = info || pipeInfo(parseInfo, reason);

        // Create each issue and add it to issues
        for (const issueInfo of result.issues) {
          const issue = pipeIssue(info, issueInfo);
          issues ? issues.push(issue) : (issues = [issue]);
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
  }

  // Return final parse result
  return parseResult(true, output, issues);
}
