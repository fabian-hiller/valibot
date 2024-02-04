import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
  SchemaIssues,
} from '../../types/index.ts';
import {
  pipeResultAsync,
  restAndDefaultArgs,
  schemaIssue,
  schemaResult,
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
  /**
   * The schema type.
   */
  type: 'tuple';
  /**
   * The tuple items schema.
   */
  items: TItems;
  /**
   * The tuple rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<TupleOutput<TItems, TRest>> | undefined;
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async tuple schema.
 */
export function tupleAsync<TItems extends TupleItemsAsync>(
  items: TItems,
  message?: ErrorMessage,
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
 * @param message The error message.
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
  message?: ErrorMessage,
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
  // Get rest, message and pipe argument
  const [rest, message, pipe] = restAndDefaultArgs<
    TRest,
    PipeAsync<TupleOutput<TItems, TRest>>
  >(arg2, arg3, arg4);

  // Create and return async tuple schema
  return {
    type: 'tuple',
    expects: 'Array',
    async: true,
    items,
    rest,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      // TODO: Due to length check, error message can be confusing
      if (Array.isArray(input) && this.items.length <= input.length) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: any[] = [];

        await Promise.all([
          // Parse schema of each tuple item
          Promise.all(
            this.items.map(async (schema, key) => {
              // If not aborted early, continue execution
              if (!(config?.abortEarly && issues)) {
                const value = input[key];
                const result = await schema._parse(value, config);

                // If not aborted early, continue execution
                if (!(config?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    // Create tuple path item
                    const pathItem: TuplePathItem = {
                      type: 'tuple',
                      origin: 'value',
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
                    if (config?.abortEarly) {
                      typed = false;
                      throw null;
                    }
                  }

                  // If not typed, set typed to false
                  if (!result.typed) {
                    typed = false;
                  }

                  // Set output of item
                  output[key] = result.output;
                }
              }
            })
          ),

          // If necessary parse schema of each rest item
          this.rest &&
            Promise.all(
              input.slice(this.items.length).map(async (value, index) => {
                // If not aborted early, continue execution
                if (!(config?.abortEarly && issues)) {
                  const key = this.items.length + index;
                  const result = await this.rest!._parse(value, config);

                  // If not aborted early, continue execution
                  if (!(config?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      // Create tuple path item
                      const pathItem: TuplePathItem = {
                        type: 'tuple',
                        origin: 'value',
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
                      if (config?.abortEarly) {
                        typed = false;
                        throw null;
                      }
                    }

                    // If not typed, set typed to false
                    if (!result.typed) {
                      typed = false;
                    }

                    // Set output of item
                    output[key] = result.output;
                  }
                }
              })
            ),
        ]).catch(() => null);

        // If output is typed, return pipe result
        if (typed) {
          return pipeResultAsync(
            this,
            output as TupleOutput<TItems, TRest>,
            config,
            issues
          );
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, tupleAsync, input, config);
    },
  };
}
