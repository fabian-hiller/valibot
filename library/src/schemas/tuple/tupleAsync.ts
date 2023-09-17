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
  getSchemaIssues,
} from '../../utils/index.ts';
import type { TupleInput, TupleOutput, TuplePathItem } from './types.ts';
import { getTupleArgs } from './utils/index.ts';

/**
 * Tuple shape async type.
 */
export type TupleShapeAsync = [
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Tuple schema async type.
 */
export type TupleSchemaAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchemaAsync<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  schema: 'tuple';
  tuple: { items: TTupleItems; rest: TTupleRest };
};

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<TTupleItems extends TupleShapeAsync>(
  items: TTupleItems,
  pipe?: PipeAsync<TupleOutput<TTupleItems, undefined>>
): TupleSchemaAsync<TTupleItems>;

/**
 * Creates an async tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<TTupleItems extends TupleShapeAsync>(
  items: TTupleItems,
  error?: ErrorMessage,
  pipe?: PipeAsync<TupleOutput<TTupleItems, undefined>>
): TupleSchemaAsync<TTupleItems>;

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
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

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
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest>;

export function tupleAsync<
  TTupleItems extends TupleShapeAsync,
  TTupleRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  items: TTupleItems,
  arg2?:
    | PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
    | ErrorMessage
    | TTupleRest,
  arg3?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>> | ErrorMessage,
  arg4?: PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchemaAsync<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getTupleArgs<
    TTupleRest,
    PipeAsync<TupleOutput<TTupleItems, TTupleRest>>
  >(arg2, arg3, arg4);

  // Create and return async tuple schema
  return {
    /**
     * The schema type.
     */
    schema: 'tuple',

    /**
     * The tuple items and rest schema.
     */
    tuple: { items, rest },

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
      if (
        !Array.isArray(input) ||
        (!rest && items.length !== input.length) ||
        (rest && items.length > input.length)
      ) {
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
                    schema: 'tuple',
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
                      schema: 'tuple',
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
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            info,
            'tuple'
          );
    },
  };
}
