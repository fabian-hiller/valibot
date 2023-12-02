import type { Issue, PipeInfo } from '../../../../types/index.ts';

/**
 * Returns the pipe issue data.
 *
 * @param info The pipe info.
 * @param issue The issue data.
 *
 * @returns The issue data.
 */
export function pipeIssue(
  info: PipeInfo,
  issue: Pick<
    Issue,
    'validation' | 'message' | 'input' | 'requirement' | 'path'
  >
): Issue {
  // Note: The issue is deliberately not constructed with the spread operator
  // for performance reasons
  return {
    reason: info?.reason,
    validation: issue.validation,
    origin: info?.origin || 'value',
    message: issue.message,
    input: issue.input,
    requirement: issue?.requirement,
    path: issue.path,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
    skipPipe: info?.skipPipe,
  };
}
