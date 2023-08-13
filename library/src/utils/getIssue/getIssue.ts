import type { Issue, IssueReason } from '../../error/index.ts';
import type { ParseInfo, ValidateInfo } from '../../types.ts';

/**
 * Returns the final issue data.
 *
 * @param info The parse info.
 * @param issue The issue data.
 *
 * @returns The issue data.
 */
export function getIssue(
  info: ParseInfo | undefined,
  issue: Pick<Issue, 'reason' | 'validation' | 'message' | 'input' | 'issues'>
): Issue;

/**
 * Returns the final issue data.
 *
 * @param info The validate info.
 * @param issue The issue data.
 *
 * @returns The issue data.
 */
export function getIssue(
  info: ValidateInfo,
  issue: Pick<Issue, 'validation' | 'message' | 'input' | 'issues'>
): Issue;

export function getIssue(
  info: (ParseInfo & Partial<Pick<Issue, 'reason'>>) | undefined,
  issue: Pick<Issue, 'validation' | 'message' | 'input' | 'issues'> &
    Partial<Pick<Issue, 'reason'>>
): Issue {
  // Hint: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    reason: (info?.reason || issue.reason) as IssueReason,
    validation: issue.validation,
    origin: info?.origin || 'value',
    message: issue.message,
    input: issue.input,
    path: info?.path,
    issues: issue.issues,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
  };
}
