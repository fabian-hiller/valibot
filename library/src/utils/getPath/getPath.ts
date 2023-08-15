import type { PathItem } from '../../types.ts';

/**
 * Wrapper for issue paths that only concatenates the full path when it is needed.
 *
 * @param prevPath Previous, "parent", path. Optional.
 * @param pathItem The "leaf" path item to add to the full path.
 *
 * @returns instance of LazyPath
 */
export class LazyPath {
  private prevPath: LazyPath | undefined;
  private pathItem: PathItem;
  private cachedPath: PathItem[] = [];
  constructor(prevPath: LazyPath | undefined, pathItem: PathItem) {
    this.prevPath = prevPath;
    this.pathItem = pathItem;
  }

  get evaluatedPath(): PathItem[] {
    if (!this.cachedPath.length) {
      if (this.prevPath) {
        const prevPath = this.prevPath.evaluatedPath;
        for (const pathItem of prevPath) {
          this.cachedPath.push(pathItem);
        }
      }
      this.cachedPath.push(this.pathItem);
    }

    return this.cachedPath;
  }
}

/**
 * Returns a lazy representation of the current path. `path.evaluatedPath` evaluates the path.
 *
 * TODO: Prüfen ob es wirklich erforderlich ist einen neuen Array zu erstellen.
 * TODO: Prüfen ob for loop nur wegen Profiler schneller als spread war
 *
 * @param info The parse info.
 * @param key The current key.
 *
 * @returns A lazy representation of the current path.
 */
export function getPath(prevPath: LazyPath | undefined, pathItem: PathItem) {
  return new LazyPath(prevPath, pathItem);
}
