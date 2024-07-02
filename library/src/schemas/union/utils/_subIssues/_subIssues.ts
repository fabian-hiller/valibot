import type { BaseIssue, Dataset } from '../../../../types/index.ts';

/**
 * Returns the sub issues of the provided datasets for the union issue.
 *
 * @param datasets The datasets.
 *
 * @returns The sub issues.
 *
 * @internal
 */
export function _subIssues(
  datasets: Dataset<unknown, BaseIssue<unknown>>[] | undefined
): [BaseIssue<unknown>, ...BaseIssue<unknown>[]] | undefined {
  let issues: [BaseIssue<unknown>, ...BaseIssue<unknown>[]] | undefined;
  if (datasets) {
    for (const dataset of datasets) {
      if (issues) {
        // Note: According to the implementation of `union` and `unionAsync`,
        // `dataset.issues` can never be `undefined`.
        issues.push(...dataset.issues!);
      } else {
        issues = dataset.issues;
      }
    }
  }
  return issues;
}
