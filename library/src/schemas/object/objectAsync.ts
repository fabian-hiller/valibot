import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import {
  executePipeAsync,
  getChecks,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ObjectInput, ObjectOutput, ObjectPathItem } from './types.ts';

/**
 * Object shape async type.
 */
export type ObjectShapeAsync = Record<
  string,
  BaseSchema<any> | BaseSchemaAsync<any>
>;

/**
 * Object schema async type.
 */
export type ObjectSchemaAsync<
  TObjectShape extends ObjectShapeAsync,
  TOutput = ObjectOutput<TObjectShape>
> = BaseSchemaAsync<ObjectInput<TObjectShape>, TOutput> & {
  schema: 'object';
  object: TObjectShape;
  checks: PipeMeta[];
};

/**
 * Creates an async object schema.
 *
 * @param object The object schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TObjectShape extends ObjectShapeAsync>(
  object: TObjectShape,
  pipe?: PipeAsync<ObjectOutput<TObjectShape>>
): ObjectSchemaAsync<TObjectShape>;

/**
 * Creates an async object schema.
 *
 * @param object The object schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async object schema.
 */
export function objectAsync<TObjectShape extends ObjectShapeAsync>(
  object: TObjectShape,
  error?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TObjectShape>>
): ObjectSchemaAsync<TObjectShape>;

export function objectAsync<TObjectShape extends ObjectShapeAsync>(
  object: TObjectShape,
  arg2?: PipeAsync<ObjectOutput<TObjectShape>> | ErrorMessage,
  arg3?: PipeAsync<ObjectOutput<TObjectShape>>
): ObjectSchemaAsync<TObjectShape> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create cached entries
  let cachedEntries: [string, BaseSchema<any> | BaseSchemaAsync<any>][];

  // Create and return async object schema
  return {
    /**
     * The schema type.
     */
    schema: 'object',

    /**
     * The object schema.
     */
    object,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Validation checks that will be run against
     * the input value.
     */
    checks: getChecks(pipe),

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
      cachedEntries = cachedEntries || Object.entries(object);

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string, any> = {};

      // Parse schema of each key
      await Promise.all(
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
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(
            output as ObjectOutput<TObjectShape>,
            pipe,
            info,
            'object'
          );
    },
  };
}
