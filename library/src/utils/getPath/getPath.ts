import type { PathItem } from '../../types.ts';

/**
 * Returns the current path.
 *
 * TODO: Prüfen ob es wirklich erforderlich ist einen neuen Array zu erstellen.
 * TODO: Prüfen ob for loop nur wegen Profiler schneller als spread war
 *
 * @param info The parse info.
 * @param key The current key.
 *
 * @returns The current path.
 */
export function getPath(prevPath: PathItem[] | undefined, pathItem: PathItem) {
  // Note: Array is copied with for loop instead of spread operator for
  // performance reasons
  const path: PathItem[] = [];
  if (prevPath) {
    for (const pathItem of prevPath) {
      path.push(pathItem);
    }
  }
  path.push(pathItem);
  return path;
}
