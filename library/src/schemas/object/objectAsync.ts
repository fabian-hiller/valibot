import type { Issues } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
} from '../../utils/index.ts';
import type { ObjectInput, ObjectOutput } from './types.ts';

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
  error?: string,
  pipe?: PipeAsync<ObjectOutput<TObjectShape>>
): ObjectSchemaAsync<TObjectShape>;

export function objectAsync<TObjectShape extends ObjectShapeAsync>(
  object: TObjectShape,
  arg2?: PipeAsync<ObjectOutput<TObjectShape>> | string,
  arg3?: PipeAsync<ObjectOutput<TObjectShape>>
): ObjectSchemaAsync<TObjectShape> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

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
        !input ||
        typeof input !== 'object' ||
        input.toString() !== '[object Object]'
      ) {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'object',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(object);

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string, any> = {};

      // Parse schema of each key
      await Promise.all(
        cachedEntries.map(async (objectEntry) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Get key and value
            const key = objectEntry[0];
            const value = (input as Record<string, unknown>)[key];

            // Get parse result of value
            const result = await objectEntry[1]._parse(
              value,
              getPathInfo(
                info,
                getPath(info?.path, {
                  schema: 'object',
                  input,
                  key,
                  value,
                })
              )
            );

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                if (issues) {
                  for (const issue of result.issues) {
                    issues.push(issue);
                  }
                } else {
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
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipeAsync(
            output as ObjectOutput<TObjectShape>,
            pipe,
            info,
            'object'
          );
    },
  };
}
