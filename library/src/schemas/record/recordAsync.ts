import type { Issues } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
  getPipeInfo,
} from '../../utils/index.ts';
import {
  type StringSchema,
  string,
  type StringSchemaAsync,
} from '../string/index.ts';
import type { RecordInput, RecordOutput } from './types.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key type.
 */
export type RecordKeyAsync =
  | StringSchema<string | number | symbol>
  | StringSchemaAsync<string | number | symbol>;

/**
 * Record schema async type.
 */
export type RecordSchemaAsync<
  TRecordValue extends BaseSchema | BaseSchemaAsync,
  TRecordKey extends RecordKeyAsync = StringSchema,
  TOutput = RecordOutput<TRecordKey, TRecordValue>
> = BaseSchemaAsync<RecordInput<TRecordKey, TRecordValue>, TOutput> & {
  schema: 'record';
  record: { key: TRecordKey; value: TRecordValue };
};

/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<TRecordValue extends BaseSchema | BaseSchemaAsync>(
  value: TRecordValue,
  pipe?: PipeAsync<RecordOutput<StringSchema, TRecordValue>>
): RecordSchemaAsync<TRecordValue>;

/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<TRecordValue extends BaseSchema | BaseSchemaAsync>(
  value: TRecordValue,
  error?: string,
  pipe?: PipeAsync<RecordOutput<StringSchema, TRecordValue>>
): RecordSchemaAsync<TRecordValue>;

/**
 * Creates an async record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<
  TRecordKey extends RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
>(
  key: TRecordKey,
  value: TRecordValue,
  pipe?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchemaAsync<TRecordValue, TRecordKey>;

/**
 * Creates an async record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<
  TRecordKey extends RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
>(
  key: TRecordKey,
  value: TRecordValue,
  error?: string,
  pipe?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchemaAsync<TRecordValue, TRecordKey>;

export function recordAsync<
  TRecordKey extends RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
>(
  arg1: TRecordValue | TRecordKey,
  arg2?:
    | PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
    | string
    | TRecordValue,
  arg3?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>> | string,
  arg4?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchemaAsync<TRecordValue, TRecordKey> {
  // Get key, value, error and pipe argument
  const { key, value, error, pipe } = (
    typeof arg2 === 'object' && !Array.isArray(arg2)
      ? { key: arg1, value: arg2, ...getErrorAndPipe(arg3, arg4) }
      : { key: string(), value: arg1, ...getErrorAndPipe(arg2, arg3 as any) }
  ) as {
    key: TRecordKey;
    value: TRecordValue;
    error: string | undefined;
    pipe: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>;
  };

  // Create and return async record schema
  return {
    /**
     * The schema type.
     */
    schema: 'record',

    /**
     * The record key and value schema.
     */
    record: { key, value },

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
              validation: 'record',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string | number | symbol, any> = {};

      // Parse each key and value by schema
      await Promise.all(
        // Note: `Object.entries(...)` converts each key to a string
        Object.entries(input).map(async (inputEntry) => {
          // Get input key
          const inputKey = inputEntry[0];

          // Exclude blocked keys to prevent prototype pollutions
          if (!BLOCKED_KEYS.includes(inputKey)) {
            // Get input value
            const inputValue = inputEntry[1];

            // Get current path
            const path = getPath(info?.path, {
              schema: 'record',
              input,
              key: inputKey,
              value: inputValue,
            });

            // Get parse result of key and value
            const [keyResult, valueResult] = await Promise.all(
              [
                { schema: key, input: inputKey, origin: 'key' as const },
                { schema: value, input: inputValue },
              ].map(async ({ schema, input, origin }) => {
                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // Get parse result of input
                  const result = await schema._parse(
                    input,
                    getPathInfo(info, path, origin)
                  );

                  // If not aborted early, continue execution
                  if (!(info?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      if (issues) {
                        issues.push(...result.issues);
                      } else {
                        issues = result.issues;
                      }

                      // If necessary, abort early
                      if (info?.abortEarly) {
                        throw null;
                      }

                      // Otherwise, return parse result
                    } else {
                      return result;
                    }
                  }
                }
              })
            ).catch(() => []);

            // Set entry if there are no issues
            if (keyResult && valueResult) {
              output[keyResult.output] = valueResult.output;
            }
          }
        })
      );

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipeAsync(
            output as RecordOutput<TRecordKey, TRecordValue>,
            pipe,
            getPipeInfo(info, 'record')
          );
    },
  };
}
