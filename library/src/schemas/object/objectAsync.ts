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
import type { ObjectInput, ObjectOutput, ObjectPathItem } from './types.ts';

/**
 * Object entries async type.
 */
export type ObjectEntriesAsync = Record<
  string,
  BaseSchema<any> | BaseSchemaAsync<any>
>;

/**
 * Object schema async type.
 */
export type ObjectSchemaAsync<
  TObjectEntries extends ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined,
  TOutput = ObjectOutput<TObjectEntries, TObjectRest>
> = BaseSchemaAsync<ObjectInput<TObjectEntries, TObjectRest>, TOutput> & {
  schema: 'object';
  object: { entries: TObjectEntries; rest: TObjectRest };
};

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TObjectEntries extends ObjectEntriesAsync>(
  entries: TObjectEntries,
  pipe?: PipeAsync<ObjectOutput<TObjectEntries, undefined>>
): ObjectSchemaAsync<TObjectEntries>;

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TObjectEntries extends ObjectEntriesAsync>(
  entries: TObjectEntries,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TObjectEntries, undefined>>
): ObjectSchemaAsync<TObjectEntries>;

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
  TObjectEntries extends ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  entries: TObjectEntries,
  rest: TObjectRest,
  pipe?: PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchemaAsync<TObjectEntries, TObjectRest>;

/**
 * Creates an async object schema.
 *
 * @param entries The object entries.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<
  TObjectEntries extends ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined
>(
  entries: TObjectEntries,
  rest: TObjectRest,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchemaAsync<TObjectEntries, TObjectRest>;

export function objectAsync<
  TObjectEntries extends ObjectEntriesAsync,
  TObjectRest extends BaseSchema | BaseSchemaAsync | undefined = undefined
>(
  entries: TObjectEntries,
  arg2?:
    | PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>>
    | ErrorMessage
    | TObjectRest,
  arg3?: PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>> | ErrorMessage,
  arg4?: PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>>
): ObjectSchemaAsync<TObjectEntries, TObjectRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe] = getRestAndDefaultArgs<
    TObjectRest,
    PipeAsync<ObjectOutput<TObjectEntries, TObjectRest>>
  >(arg2, arg3, arg4);

  // Create cached entries
  let cachedEntries: [string, BaseSchema<any> | BaseSchemaAsync<any>][];

  // Create and return async object schema
  return {
    /**
     * The schema type.
     */
    schema: 'object',

    /**
     * The object entries and rest schema.
     */
    object: { entries, rest },

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
      if (!input || typeof input !== 'object') {
        return getSchemaIssues(
          info,
          'type',
          'object',
          error || 'Invalid type',
          input
        );
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(entries);

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
                    schema: 'object',
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

                  // Otherwise, add value to object
                } else if (result.output !== undefined || key in input) {
                  output[key] = result.output;
                }
              }
            }
          })
        ),

        rest &&
          Promise.all(
            Object.entries(input).map(async ([key, value]) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                if (!(key in entries)) {
                  // Get parse result of value
                  const result = await rest._parse(value, info);

                  // If not aborted early, continue execution
                  if (!(info?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      // Create object path item
                      const pathItem: ObjectPathItem = {
                        schema: 'object',
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
            output as ObjectOutput<TObjectEntries, TObjectRest>,
            pipe,
            info,
            'object'
          );
    },
  };
}
