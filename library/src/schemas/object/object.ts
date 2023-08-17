import type { Issues } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getLeafIssue,
  getNestedIssue,
} from '../../utils/index.ts';
import type { ObjectOutput, ObjectInput } from './types.ts';

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
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create cached entries
  let cachedEntries: (string | BaseSchema<any>['_parse'])[];

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
      if (input?.constructor !== Object) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'object',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Cache object entries lazy
      // Make a flat array of [string, schema, string, schema] instead of regular Object.entries()
      // For better CPU cache locality
      if (!cachedEntries) {
        cachedEntries = [];
        const keys = Object.keys(object);
        for (let k = 0; k < keys.length; ++k) {
          const key = keys[k];
          const parser = object[key];
          cachedEntries.push(key, parser._parse);
        }
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string, any> = {};

      // Parse schema of each key
      for (let i = 0; i < cachedEntries.length; i += 2) {
        // Get key and value
        const key = cachedEntries[i] as string;
        const value: any = (input as Record<string, unknown>)[key as string];
        const parser = cachedEntries[i + 1] as BaseSchema<any>['_parse'];

        // Get parse result of value
        const result = parser(value, info);

        // If there are issues, capture them
        if (result.issues) {
          const nestedIssue = getNestedIssue({
            path: key,
            issues: result.issues,
          });
          if (issues) {
            issues.push(nestedIssue);
          } else {
            issues = [nestedIssue];
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
