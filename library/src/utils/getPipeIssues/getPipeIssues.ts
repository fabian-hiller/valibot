import type { ErrorMessage, Issue } from '../../types/index.ts';
import { getErrorMessage } from '../getErrorMessage/index.ts';
import { getIssues } from '../getIssues/getIssues.ts';

/**
 * Returns the pipeline result object with issues.
 *
 * @param validation The validation name.
 * @param message The error message.
 * @param input The input value.
 * @param requirement The requirement.
 *
 * @returns The pipeline result object.
 */
export function getPipeIssues(
  validation: string,
  message: ErrorMessage,
  input: unknown,
  requirement?: unknown
): {
  issues: Pick<Issue, 'validation' | 'message' | 'input' | 'requirement'>[];
} {
  return getIssues([
    {
      validation,
      message: getErrorMessage(message),
      input,
      requirement,
    },
  ]);
}
