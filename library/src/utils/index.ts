export * from './executePipe/index.ts';
export * from './getCurrentPath/index.ts';
export * from './getErrorAndPipe/index.ts';
export * from './isLuhnAlgo/index.ts';
import type { IssueReason } from '../index.ts';
import type { ParseInfo, ValidateInfo } from '../types.ts';

/**
 * Construct ValidateInfo without using spread operator for performance reasons
 *
 * @param info The parse info
 * @param reason The reason to be merged with the parse info
 *
 * @returns The merged valiate info
 */
export function getPipeInfo(
  info: ParseInfo | undefined,
  reason: IssueReason
): ValidateInfo {
  return {
    origin: info?.origin,
    path: info?.path,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
    reason,
  };
}
