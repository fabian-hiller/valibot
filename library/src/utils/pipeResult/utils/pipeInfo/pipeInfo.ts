import type {
  IssueReason,
  ParseInfo,
  PipeInfo,
} from '../../../../types/index.ts';

/**
 * Returns the pipe info.
 *
 * @param info The parse info.
 * @param reason The issue reason.
 *
 * @returns The pipe info.
 */
export function pipeInfo(
  info: ParseInfo | undefined,
  reason: IssueReason
): PipeInfo {
  // Note: The pipe info is deliberately not constructed with the spread
  // operator for performance reasons
  return {
    reason,
    origin: info?.origin,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
    skipPipe: info?.skipPipe,
  };
}
