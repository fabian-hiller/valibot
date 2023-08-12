import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import {
  executePipe,
  getCurrentPath,
  getErrorAndPipe,
  getPipeInfo,
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
    parse(input, info) {
      // Check type of input
      if (
        !input ||
        typeof input !== 'object' ||
        input.toString() !== '[object Object]'
      ) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'object',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Cache object entries lazy
      cachedEntries = cachedEntries || Object.entries(object);

      // Create output and issues
      const output: Record<string, any> = {};
      const issues: Issue[] = [];

      // Parse schema of each key
      for (const objectEntry of cachedEntries) {
        try {
          const key = objectEntry[0];
          const value = (input as Record<string, unknown>)[key];
          output[key] = objectEntry[1].parse(value, {
            ...info,
            path: getCurrentPath(info, { schema: 'object', input, key, value }),
          });

          // Throw or fill issues in case of an error
        } catch (error) {
          if (info?.abortEarly) {
            throw error;
          }
          issues.push(...(error as ValiError).issues);
        }
      }

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipe(
        output as ObjectOutput<TObjectShape>,
        pipe,
        getPipeInfo(info, 'object')
      );
    },
  };
}
