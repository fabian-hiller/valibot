import type { BaseSchema, Issues, Pipe } from '../../types.ts';
import { executePipe, getDefaultArgs, getIssues } from '../../utils/index.ts';
import type { ObjectOutput, ObjectInput, ObjectPathItem } from './types.ts';

/**
 * Object shape type.
 */
export type ObjectShape = Record<string, BaseSchema<any>>;

/**
 * Object schema type.
 */
export type ObjectSchema<
  TObjectShape extends ObjectShape,
  TOutput = ObjectOutput<TObjectShape>
> = BaseSchema<ObjectInput<TObjectShape>, TOutput> & {
  schema: 'object';
  object: TObjectShape;
};

/**
 * Creates an object schema.
 *
 * @param object The object schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TObjectShape extends ObjectShape>(
  object: TObjectShape,
  pipe?: Pipe<ObjectOutput<TObjectShape>>
): ObjectSchema<TObjectShape>;

/**
 * Creates an object schema.
 *
 * @param object The object schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function object<TObjectShape extends ObjectShape>(
  object: TObjectShape,
  error?: string,
  pipe?: Pipe<ObjectOutput<TObjectShape>>
): ObjectSchema<TObjectShape>;

export function object<TObjectShape extends ObjectShape>(
  object: TObjectShape,
  arg2?: Pipe<ObjectOutput<TObjectShape>> | string,
  arg3?: Pipe<ObjectOutput<TObjectShape>>
): ObjectSchema<TObjectShape> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create cached entries
  let cachedEntries: [string, BaseSchema<any>][];

  // Create and return object schema
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return getIssues(
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
      for (const [key, schema] of cachedEntries) {
        // Get value by key
        const value = (input as Record<string, unknown>)[key];

        // Get parse result of value
        const result = schema._parse(value, info);

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
            break;
          }

          // Otherwise, add value to object
        } else {
          output[key] = result.output;
        }
      }

      const extraInputKeys = Object.keys(input).filter(
        (k) => !cachedEntries.map((e) => e[0]).includes(k)
      );
      for (const key of extraInputKeys) {
        const value = (input as Record<string, unknown>)[key];
        output[key] = value;
      }

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipe(
            output as ObjectOutput<TObjectShape>,
            pipe,
            info,
            'object'
          );
    },
  };
}
