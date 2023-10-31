import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  Output,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema async type.
 */
export type ArraySchemaAsync<
  TItem extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TItem>[]
> = BaseSchemaAsync<Input<TItem>[], TOutput> & {
  type: 'array';
  /**
   * The array item schema.
   */
  item: TItem;
  /**
   * Validation checks that will be run against
   * the input value.
   */
  pipe?: PipeAsync<Output<TItem>[]>;
};

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  pipe?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem>;

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  error?: ErrorMessage,
  pipe?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem>;

export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  arg2?: ErrorMessage | PipeAsync<Output<TItem>[]>,
  arg3?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return async array schema
  return {
    type: 'array',
    async: true,
    item,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input)) {
        return getSchemaIssues(
          info,
          'type',
          'array',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each array item
      await Promise.all(
        input.map(async (value, key) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Parse schema of array item
            const result = await item._parse(value, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                // Create array path item
                const pathItem: ArrayPathItem = {
                  type: 'array',
                  input,
                  key,
                  value,
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

                // Otherwise, add item to array
              } else {
                output[key] = result.output;
              }
            }
          }
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(output as Output<TItem>[], pipe, info, 'array');
    },
  };
}
