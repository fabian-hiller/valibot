import type { Issue, PipeInfo } from '../../../../types.ts';

/**
 * Returns the final issue data.
 *
 * @param info The pipe info.
 * @param issue The issue data.
 *
 * @returns The issue data.
 */
export function getIssue(
  info: PipeInfo,
  issue: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>
): Issue {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    reason: info?.reason,
    validation: issue.validation,
    origin: info?.origin || 'value',
    message: issue.message,
    input: issue.input,
    path: issue.path,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
  };
}
