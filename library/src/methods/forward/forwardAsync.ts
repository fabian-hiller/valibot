import type {
  BaseIssue,
  BaseValidation,
  BaseValidationAsync,
  IssuePathItem,
  PathKeys,
} from '../../types/index.ts';

// TODO: We should try to find a better way to type this function without
// breaking the type inference, as the current implementation loses some type
// information by returning a `BaseValidation` instead of the original type.
// In the process, we should also figure out how to add a `.forward' property
// to the returnd object in a type-safe way, similar to how the `fallback`
// method works.

/**
 * Forwards the issues of the passed validation action.
 *
 * @param action The validation action.
 * @param pathKeys The path keys.
 *
 * @returns The modified action.
 */
export function forwardAsync<
  TInput extends Record<string, unknown> | ArrayLike<unknown>,
  TIssue extends BaseIssue<unknown>,
>(
  action:
    | BaseValidation<TInput, TInput, TIssue>
    | BaseValidationAsync<TInput, TInput, TIssue>,
  pathKeys: PathKeys<TInput>
): BaseValidationAsync<TInput, TInput, TIssue> {
  return {
    ...action,
    async: true,
    async '~run'(dataset, config) {
      // Create copy of previous issues
      const prevIssues = dataset.issues && [...dataset.issues];

      // Run validation action
      dataset = await action['~run'](dataset, config);

      // If dataset contains issues, forward newly added issues
      if (dataset.issues) {
        for (const issue of dataset.issues) {
          if (!prevIssues?.includes(issue)) {
            // Create path input variable
            let pathInput: unknown = dataset.value;

            // Try to forward issue to end of path list
            for (const key of pathKeys) {
              // Create path value variable
              // @ts-expect-error
              const pathValue: unknown = pathInput[key];

              // Create path item for current key
              const pathItem: IssuePathItem = {
                type: 'unknown',
                origin: 'value',
                input: pathInput,
                key,
                value: pathValue,
              };

              // Forward issue by adding path item
              if (issue.path) {
                issue.path.push(pathItem);
              } else {
                // @ts-expect-error
                issue.path = [pathItem];
              }

              // If path value is undefined, stop forwarding
              if (!pathValue) {
                break;
              }

              // Set next path input to current path value
              pathInput = pathValue;
            }
          }
        }
      }

      // Return output dataset
      return dataset;
    },
  };
}
