/**
 * Returns the result object with issues.
 * @param issues The issues.
 * @returns The result object.
 */
export function getIssues<TIssues>(issues: TIssues): { issues: TIssues } {
  return { issues };
}
