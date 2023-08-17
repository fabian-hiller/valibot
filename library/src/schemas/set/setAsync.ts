import type { Issues } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getLeafIssue,
  getNestedIssue,
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
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Set)) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'set',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create index, output and issues
      let issues: Issues | undefined;
      const output: SetOutput<TSetValue> = new Set();

      // Parse each value by schema
      await Promise.all(
        Array.from(input.values()).map(async (inputValue, index) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            const result = await value._parse(inputValue, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
              // If there are issues, capture them
              if (result.issues) {
                const nestedIssue = getNestedIssue({
                  path: `${index}`,
                  issues: result.issues,
                });
                if (issues) {
                  issues.push(nestedIssue);
                } else {
                  issues = [nestedIssue];
                }

                // If necessary, abort early
                if (info?.abortEarly) {
                  throw null;
                }

                // Otherwise, add item to set
              } else {
                output.add(result.output);
              }
            }
          }
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues ? { issues } : executePipeAsync(output, pipe, info, 'set');
    },
  };
}
