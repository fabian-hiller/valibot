import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getCurrentPath,
  getErrorAndPipe,
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
            validation: 'record',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Create output and issues
      const output: Record<string | number | symbol, any> = {};
      const issues: Issue[] = [];

      // Parse each key and value by schema
      await Promise.all(
        // Note: `Object.entries(...)` converts each key to a string
        Object.entries(input).map(async ([inputKey, inputValue]) => {
          // Exclude blocked keys to prevent prototype pollutions
          if (BLOCKED_KEYS.includes(inputKey)) {
            return;
          }

          // Get current path
          const path = getCurrentPath(info, {
            schema: 'record',
            input,
            key: inputKey,
            value: inputValue,
          });

          const [outputKey, outputValue] = await Promise.all([
            // Parse key and get output
            (async () => {
              try {
                return await key.parse(inputKey, {
                  ...info,
                  origin: 'key',
                  path,
                });

                // Throw or fill issues in case of an error
              } catch (error) {
                if (info?.abortEarly) {
                  throw error;
                }
                issues.push(...(error as ValiError).issues);
              }
            })(),

            // Parse value and get output
            (async () => {
              try {
                // Note: Value is nested in array, so that also a falsy value further
                // down can be recognized as valid value
                return [
                  await value.parse(inputValue, { ...info, path }),
                ] as const;

                // Throw or fill issues in case of an error
              } catch (error) {
                if (info?.abortEarly) {
                  throw error;
                }
                issues.push(...(error as ValiError).issues);
              }
            })(),
          ]);

          // Set entry if output key and value is valid
          if (outputKey && outputValue) {
            output[outputKey] = outputValue[0];
          }
        })
      );

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipeAsync(
        output as RecordOutput<TRecordKey, TRecordValue>,
        pipe,
        { ...info, reason: 'record' }
      );
    },
  };
}
