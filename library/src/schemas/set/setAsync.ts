import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema async type.
 */
export type SetSchemaAsync<
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TValue>
> = BaseSchemaAsync<SetInput<TValue>, TOutput> & {
  type: 'set';
  /**
   * The value schema.
   */
  value: TValue;
  /**
   * Validation and transformation pipe.
   */
  pipe?: PipeAsync<SetOutput<TValue>>;
};

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  pipe?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue>;

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  error?: ErrorMessage,
  pipe?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue>;

export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  arg2?: PipeAsync<SetOutput<TValue>> | ErrorMessage,
  arg3?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return async set schema
  return {
    type: 'set',
    async: true,
    value,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Set)) {
        return getSchemaIssues(
          info,
          'type',
          'set',
          error || 'Invalid type',
          input
        );
      }

      // Create index, output and issues
      let issues: Issues | undefined;
      const output: SetOutput<TValue> = new Set();

      // Parse each value by schema
      await Promise.all(
        Array.from(input.values()).map(async (inputValue, key) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Get parse result of input value
            const result = await value._parse(inputValue, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                // Create set path item
                const pathItem: SetPathItem = {
                  type: 'set',
                  input,
                  key,
                  value: inputValue,
                };

                // Add modified result issues to issues
                for (const issue of result.issues) {
                  if (issue.path) {
                    issue.path.unshift(pathItem);
                  } else {
                    issue.path = [pathItem];
                  }
                  issues?.push(issue);
                }
                if (!issues) {
                  issues = result.issues;
                }

                // If necessary, abort early
                if (info?.abortEarly) {
                  throw null;
                }

                // Otherwise, add item to set
              } else {
                output.add(result.output);
              }
            }
          }
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(input, pipe, info, 'set');
    },
  };
}
