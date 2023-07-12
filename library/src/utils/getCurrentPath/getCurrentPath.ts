import type { ParseInfo, PathItem } from '../../types';

/**
 * Returns the current path.
 *
 * @param info The parse info.
 * @param key The current key.
 *
 * @returns The current path.
 */
export function getCurrentPath(info: ParseInfo | undefined, item: PathItem) {
  return [...(info?.path || []), item];
}
