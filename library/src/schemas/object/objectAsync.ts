import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getCurrentPath,
  getErrorAndPipe,
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
    async parse(input, info) {
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

      // Create output and issues
      const output: Record<string, any> = {};
      const issues: Issue[] = [];

      // Parse schema of each key
      await Promise.all(
        Object.entries(object).map(async ([key, schema]) => {
          try {
            const value = (input as Record<string, unknown>)[key];
            output[key] = await schema.parse(value, {
              ...info,
              path: getCurrentPath(info, {
                schema: 'object',
                input,
                key,
                value,
              }),
            });

            // Throw or fill issues in case of an error
          } catch (error) {
            if (info?.abortEarly) {
              throw error;
            }
            issues.push(...(error as ValiError).issues);
          }
        })
      );

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipeAsync(output as ObjectOutput<TObjectShape>, pipe, {
        ...info,
        reason: 'object',
      });
    },
  };
}
