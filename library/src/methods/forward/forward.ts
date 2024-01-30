import type { BaseValidation, PathItem } from '../../types/index.ts';
import type { PathList } from './types.ts';

/**
 * Forwards the issues of the passed validation.
 *
 * @param validation The validation.
 * @param pathList The path list.
 *
 * @returns The passed validation.
 */
export function forward<TInput extends unknown[] | Record<string, unknown>>(
  validation: BaseValidation<TInput>,
  pathList: PathList<TInput>
): BaseValidation<TInput> {
  return {
    ...validation,
    _parse(input) {
      // Get validation result
      const result = validation._parse(input);

      // If issues occurred, try to forward them
      if (result.issues) {
        for (const issue of result.issues) {
          // Create path input variable
          let pathInput: any = input;

          // Try to forward issue to end of path list
          for (const key of pathList) {
            // Create path value variable
            const pathValue = pathInput[key];

            // Overwrite issue input with path value
            issue.input = pathValue;

            // Create path item for current key
            const pathItem: PathItem = {
              type: 'unknown',
              input: pathInput,
              key,
              value: pathValue,
            };

            // Forward issue by adding path item
            issue.path ? issue.path.push(pathItem) : (issue.path = [pathItem]);

            // If path value is undefined, stop forwarding
            if (!pathValue) {
              break;
            }

            // Set next path input to current path value
            pathInput = pathValue;
          }
        }
      }

      // Return validation result
      return result;
    },
  };
}
