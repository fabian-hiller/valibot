import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getCurrentPath,
  getErrorAndPipe,
} from '../../utils/index.ts';
import type { SetInput, SetOutput } from './types.ts';

/**
 * Set schema async type.
 */
export type SetSchemaAsync<
  TSetValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TSetValue>
> = BaseSchemaAsync<SetInput<TSetValue>, TOutput> & {
  schema: 'set';
  set: { value: TSetValue };
};

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  pipe?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue>;

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  error?: string,
  pipe?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue>;

export function setAsync<TSetValue extends BaseSchema | BaseSchemaAsync>(
  value: TSetValue,
  arg2?: PipeAsync<SetOutput<TSetValue>> | string,
  arg3?: PipeAsync<SetOutput<TSetValue>>
): SetSchemaAsync<TSetValue> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create and return async set schema
  return {
    /**
     * The schema type.
     */
    schema: 'set',

    /**
     * The set value schema.
     */
    set: { value },

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
      if (!(input instanceof Set)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'set',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Create index, output and issues
      const output: SetOutput<TSetValue> = new Set();
      const issues: Issue[] = [];

      // Parse each value by schema
      await Promise.all(
        Array.from(input.values()).map(async (inputValue, index) => {
          try {
            output.add(
              await value.parse(inputValue, {
                ...info,
                path: getCurrentPath(info, {
                  schema: 'set',
                  input,
                  key: index,
                  value: inputValue,
                }),
              })
            );

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
      return executePipeAsync(output, pipe, { ...info, reason: 'set' });
    },
  };
}
