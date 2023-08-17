import type { IssueReason } from '../../error/index.ts';
import type { ParseInfo, ValidateInfo } from '../../types.ts';

/**
 * Returns the pipe info.
 *
 * @param info The parse info.
 * @param reason The issue reason.
 *
 * @returns The pipe info.
 */
export function getPipeInfo(
  info: ParseInfo | undefined,
  reason: IssueReason
): ValidateInfo {
  // Note: The pipe info is deliberately not constructed with the spread
  // operator for performance reasons
  return {
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
    reason,
  };
}
