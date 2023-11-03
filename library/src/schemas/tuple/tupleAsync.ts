import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getIssues,
  getRestAndDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { TupleInput, TupleOutput, TuplePathItem } from './types.ts';

/**
 * Tuple shape async type.
 */
export type TupleItemsAsync = [
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema | BaseSchemaAsync)[]
];

/**
 * Tuple schema async type.
 */
export type TupleSchemaAsync<
  TItems extends TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = TupleOutput<TItems, TRest>
> = BaseSchemaAsync<TupleInput<TItems, TRest>, TOutput> & {
  type: 'tuple';
  items: TItems;
  rest: TRest;
};

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<TItems extends TupleItemsAsync>(
  items: TItems,
  pipe?: PipeAsync<TupleOutput<TItems, undefined>>
): TupleSchemaAsync<TItems>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<TItems extends TupleItemsAsync>(
  items: TItems,
  error?: ErrorMessage,
  pipe?: PipeAsync<TupleOutput<TItems, undefined>>
): TupleSchemaAsync<TItems>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TItems extends TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  items: TItems,
  rest: TRest,
  pipe?: PipeAsync<TupleOutput<TItems, TRest>>
): TupleSchemaAsync<TItems, TRest>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<
  TItems extends TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  items: TItems,
  rest: TRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<TupleOutput<TItems, TRest>>
): TupleSchemaAsync<TItems, TRest>;

export function tupleAsync<
  TItems extends TupleItemsAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  items: TItems,
  arg2?: PipeAsync<TupleOutput<TItems, TRest>> | ErrorMessage | TRest,
  arg3?: PipeAsync<TupleOutput<TItems, TRest>> | ErrorMessage,
  arg4?: PipeAsync<TupleOutput<TItems, TRest>>
): TupleSchemaAsync<TItems, TRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TRest,
    PipeAsync<TupleOutput<TItems, TRest>>
  >(arg2, arg3, arg4);

  // Create and return async tuple schema
  return {
    /**
     * The schema type.
     */
    type: 'tuple',

    /**
     * The items schema.
     */
    items,

    /**
     * The rest schema.
     */
    rest,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input) || items.length > input.length) {
        return getSchemaIssues(
          info,
          'type',
          'tuple',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      await Promise.all([
        // Parse schema of each tuple item
        Promise.all(
          items.map(async (schema, key) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              const value = input[key];
              const result = await schema._parse(value, info);

              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  // Create tuple path item
                  const pathItem: TuplePathItem = {
                    type: 'tuple',
                    input: input as [any, ...any[]],
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

                  // Otherwise, add item to tuple
                } else {
                  output[key] = result.output;
                }
              }
            }
          })
        ),

        // If necessary parse schema of each rest item
        rest &&
          Promise.all(
            input.slice(items.length).map(async (value, index) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                const key = items.length + index;
                const result = await rest._parse(value, info);

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    // Create tuple path item
                    const pathItem: TuplePathItem = {
                      type: 'tuple',
                      input: input as [any, ...any[]],
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

                    // Otherwise, add item to tuple
                  } else {
                    output[key] = result.output;
                  }
                }
              }
            })
          ),
      ]).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(
            output as TupleOutput<TItems, TRest>,
            pipe,
            info,
            'tuple'
          );
    },
  };
}
