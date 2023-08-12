import type { IssueOrigin } from '../../error/index.ts';
import type { ParseInfo, PathItem } from '../../types.ts';

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
  path: PathItem[],
  origin: IssueOrigin = 'value'
): ParseInfo {
  // Hint: The pipe info is deliberately not constructed with the spread
  // operator for performance reasons
  return {
    origin,
    path,
    abortEarly: info?.abortEarly,
    abortPipeEarly: info?.abortPipeEarly,
  };
}
