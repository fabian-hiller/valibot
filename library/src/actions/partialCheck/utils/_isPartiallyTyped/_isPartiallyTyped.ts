import type { BaseIssue, OutputDataset } from '../../../../types/index.ts';

/**
 * Checks if a dataset is partially typed.
 *
 * @param dataset The dataset to check.
 * @param pathList The list of paths to check.
 *
 * @returns Whether it is partially typed.
 */
// @__NO_SIDE_EFFECTS__
export function _isPartiallyTyped(
  dataset: OutputDataset<unknown, BaseIssue<unknown>>,
  pathList: readonly (readonly (string | number)[])[]
): boolean {
  // If issues exist, check if a specified path matches path of a schema issue
  if (dataset.issues) {
    for (const path of pathList) {
      for (const issue of dataset.issues) {
        // Hint: We also mark the data as untyped if there are validation
        // issues, since the data could potentially be untyped if a pipeline
        // contains a transformation action.

        // Create typed variable
        let typed = false;

        // Calculate bound of match check
        const bound = Math.min(path.length, issue.path?.length ?? 0);

        // Mark data as typed if any path items of same index do not match
        for (let index = 0; index < bound; index++) {
          // @ts-expect-error We know that key of issue path item exists
          if (path[index] !== issue.path[index].key) {
            typed = true;
            break;
          }
        }

        // Return false if untyped
        if (!typed) {
          return false;
        }
      }
    }
  }

  // Return true if typed
  return true;
}
