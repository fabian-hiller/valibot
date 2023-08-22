import type { IssueReason, Issues } from '../../error/index.ts';
import type { ParseInfo } from '../../types.ts';

/**
 * Returns the final issue data.
 *
 * @param info The parse info.
 * @param issue The issue data.
 *
 * @returns The issue data.
 */
export function getIssues(
  info: ParseInfo | undefined,
  reason: IssueReason,
  validation: string,
  message: string,
  input: unknown,
  issues?: Issues
): { issues: Issues } {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    issues: [
      {
        reason,
        validation,
        origin: info?.origin || 'value',
        message,
        input,
        issues,
        abortEarly: info?.abortEarly,
        abortPipeEarly: info?.abortPipeEarly,
      },
    ],
  };
}
