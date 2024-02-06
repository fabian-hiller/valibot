import type { SchemaIssues, SchemaResult } from '../../../../types/index.ts';

/**
 * Returns the subissues of the union validation.
 *
 * @param results The schema results.
 *
 * @returns The subissues.
 */
export function subissues(
  results: SchemaResult<any>[] | undefined
): SchemaIssues | undefined {
  let issues: SchemaIssues | undefined;
  if (results) {
    for (const result of results) {
      if (issues) {
        // Note: According to the implementation of `union` and `unionAsync`,
        // `result.issues` can never be `undefined`.
        for (const issue of result.issues!) {
          issues.push(issue);
        }
      } else {
        issues = result.issues;
      }
    }
  }
  return issues;
}
