import type { Issues, ValiError } from '../ValiError/index.ts';

/**
 * Flat errors type.
 */
export type FlatErrors = {
  root?: [string, ...string[]];
  nested: Partial<Record<string, [string, ...string[]]>>;
};

/**
 * Flatten the error messages of a Vali error.
 *
 * @param error A Vali error.
 *
 * @returns Flat errors.
 */
export function flatten(error: ValiError): FlatErrors;

/**
 * Flatten the error messages of issues.
 *
 * @param issues The issues.
 *
 * @returns Flat errors.
 */
export function flatten(issues: Issues): FlatErrors;

export function flatten(issueContainer: Issues | ValiError): FlatErrors {
  const issues = Array.isArray(issueContainer)
    ? issueContainer
    : issueContainer.issues;
  const flatErrors: FlatErrors = { nested: {} };
  function flattenRecursive(issues: Issues, path: string) {
    for (const issue of issues) {
      if (issue.type === 'leaf') {
        if (path === '') {
          if (!flatErrors.root) {
            flatErrors.root = [issue.message];
          } else {
            flatErrors.root.push(issue.message);
          }
        } else {
          if (!flatErrors.nested[path]) {
            flatErrors.nested[path] = [issue.message];
          } else {
            flatErrors.nested[path]!.push(issue.message);
          }
        }
      } else if (issue.type === 'nested') {
        const newPath = path === '' ? issue.path : `${path}.${issue.path}`;
        flattenRecursive(issue.issues, newPath);
      } else if (issue.type === 'union') {
        flattenRecursive(issue.issues, path);
      }
    }
  }
  flattenRecursive(issues, '');
  return flatErrors;
}
