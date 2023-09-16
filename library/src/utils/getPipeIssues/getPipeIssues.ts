import type { Issue } from '../../types.ts';

/**
 * Returns the pipeline result object with issues.
 *
 * @param validation The validation name.
 * @param message The error message.
 * @param input The input value.
 *
 * @returns The pipeline result object.
 */
export function getPipeIssues(
  validation: string,
  message: string,
  input: unknown
): { issues: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>[] } {
  return { issues: [{ validation, message, input }] };
}
