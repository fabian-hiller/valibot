import type { IssueOrigin } from '../../error/index.ts';
import type { ParseInfo } from '../../types.ts';
import type { LazyPath } from '../getPath/getPath.ts';

/**
 * Returns the parse info of a path.
 *
 * @param info The parse info.
 * @param pathItem The path item.
 *
 * @returns The parse info.
 */
export function getPathInfo(
  info: ParseInfo | undefined,
  path: LazyPath,
  origin: IssueOrigin = 'value'
): ParseInfo {
  // Note: The path info is deliberately not constructed with the spread
  // operator for performance reasons
  return {
    origin,
    path,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
  };
}
