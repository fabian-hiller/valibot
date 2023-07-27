import type { ValiError } from '../ValiError/index.ts';

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
export function flatten(error: ValiError) {
  return error.issues.reduce<FlatErrors>(
    (flatErrors, issue) => {
      if (issue.path) {
        const path = issue.path.map(({ key }) => key).join('.');
        flatErrors.nested[path] = [
          ...(flatErrors.nested[path] || []),
          issue.message,
        ];
      } else {
        flatErrors.root = [...(flatErrors.root || []), issue.message];
      }
      return flatErrors;
    },
    { nested: {} }
  );
}
