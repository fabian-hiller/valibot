import type { ErrorMessage, Issue } from '../../types.ts';
import { getErrorMessage } from '../getErrorMessage/index.ts';
import { getIssues } from '../getIssues/getIssues.ts';

/**
 * Returns the pipeline result object with issues.
 * @param validation The validation name.
 * @param error The error message.
 * @param input The input value.
 * @returns The pipeline result object.
 */
export function getPipeIssues(
  validation: string,
  error: ErrorMessage,
  input: unknown
): { issues: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>[] } {
  return getIssues([
    {
      validation,
      message: getErrorMessage(error),
      input,
    },
  ]);
}
