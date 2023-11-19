import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types/index.ts';
import {
  executePipeAsync,
  getIssues,
  getRestAndDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ObjectInput, ObjectOutput, ObjectPathItem } from './types.ts';

/**
 * Object entries async type.
 */
export type ObjectEntriesAsync = Record<string, BaseSchema | BaseSchemaAsync>;

/**
 * Object schema async type.
 */
export interface ObjectSchemaAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = ObjectOutput<TEntries, TRest>
> extends BaseSchemaAsync<ObjectInput<TEntries, TRest>, TOutput> {
  /**
   * The schema type.
   */
  type: 'object';
  /**
   * The object entries schema.
   */
  entries: TEntries;
  /**
   * The object rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<ObjectOutput<TEntries, TRest>> | undefined;
}

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TEntries extends ObjectEntriesAsync>(
  entries: TEntries,
  pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
): ObjectSchemaAsync<TEntries>;

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TEntries extends ObjectEntriesAsync>(
  entries: TEntries,
  message?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
): ObjectSchemaAsync<TEntries>;

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  entries: TEntries,
  rest: TRest,
  pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>
): ObjectSchemaAsync<TEntries, TRest>;

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  entries: TEntries,
  rest: TRest,
  message?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TEntries, TRest>>
): ObjectSchemaAsync<TEntries, TRest>;

export function objectAsync<
  TEntries extends ObjectEntriesAsync,
  TRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  entries: TEntries,
  arg2?: PipeAsync<ObjectOutput<TEntries, TRest>> | ErrorMessage | TRest,
  arg3?: PipeAsync<ObjectOutput<TEntries, TRest>> | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<TEntries, TRest>>
): ObjectSchemaAsync<TEntries, TRest> {
  // Get rest, message and pipe argument
  const [rest, message = 'Invalid type', pipe] = getRestAndDefaultArgs<
    TRest,
    PipeAsync<ObjectOutput<TEntries, TRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema | BaseSchemaAsync][];

  // Create and return async object schema
  return {
    type: 'object',
    async: true,
    entries,
    rest,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return getSchemaIssues(info, 'type', 'object', this.message, input);
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(this.entries);

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string, any> = {};

      // Parse schema of each key
      await Promise.all([
        Promise.all(
          cachedEntries.map(async ([key, schema]) => {
            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // Get value by key
              const value = (input as Record<string, unknown>)[key];

              // Get parse result of value
              const result = await schema._parse(value, info);

              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  // Create object path item
                  const pathItem: ObjectPathItem = {
                    type: 'object',
                    input: input as Record<string, unknown>,
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

                  // Otherwise, add value to object
                } else if (result.output !== undefined || key in input) {
                  output[key] = result.output;
                }
              }
            }
          })
        ),

        this.rest &&
          Promise.all(
            Object.entries(input).map(async ([key, value]) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                if (!(key in this.entries)) {
                  // Get parse result of value
                  const result = await this.rest!._parse(value, info);

                  // If not aborted early, continue execution
                  if (!(info?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      // Create object path item
                      const pathItem: ObjectPathItem = {
                        type: 'object',
                        input: input as Record<string, unknown>,
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

                      // Otherwise, add value to object
                    } else {
                      output[key] = result.output;
                    }
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
            output as ObjectOutput<TEntries, TRest>,
            this.pipe,
            info,
            'object'
          );
    },
  };
}
