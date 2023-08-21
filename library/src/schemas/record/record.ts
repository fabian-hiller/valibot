import type { Issues } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
} from '../../utils/index.ts';
import { type StringSchema, string } from '../string/index.ts';
import type { RecordOutput, RecordInput } from './types.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key type.
 */
export type RecordKey = StringSchema<string | number | symbol>;

/**
 * Record schema type.
 */
export type RecordSchema<
  TRecordValue extends BaseSchema,
  TRecordKey extends RecordKey = StringSchema,
  TOutput = RecordOutput<TRecordKey, TRecordValue>
> = BaseSchema<RecordInput<TRecordKey, TRecordValue>, TOutput> & {
  schema: 'record';
  record: { key: TRecordKey; value: TRecordValue };
};

/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TRecordValue extends BaseSchema>(
  value: TRecordValue,
  pipe?: Pipe<RecordOutput<StringSchema, TRecordValue>>
): RecordSchema<TRecordValue>;

/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TRecordValue extends BaseSchema>(
  value: TRecordValue,
  error?: string,
  pipe?: Pipe<RecordOutput<StringSchema, TRecordValue>>
): RecordSchema<TRecordValue>;

/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<
  TRecordKey extends RecordKey,
  TRecordValue extends BaseSchema
>(
  key: TRecordKey,
  value: TRecordValue,
  pipe?: Pipe<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchema<TRecordValue, TRecordKey>;

/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<
  TRecordKey extends RecordKey,
  TRecordValue extends BaseSchema
>(
  key: TRecordKey,
  value: TRecordValue,
  error?: string,
  pipe?: Pipe<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchema<TRecordValue, TRecordKey>;

export function record<
  TRecordKey extends RecordKey,
  TRecordValue extends BaseSchema
>(
  arg1: TRecordValue | TRecordKey,
  arg2?: Pipe<RecordOutput<TRecordKey, TRecordValue>> | string | TRecordValue,
  arg3?: Pipe<RecordOutput<TRecordKey, TRecordValue>> | string,
  arg4?: Pipe<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchema<TRecordValue, TRecordKey> {
  // Get key, value, error and pipe argument
  const { key, value, error, pipe } = (
    typeof arg2 === 'object' && !Array.isArray(arg2)
      ? { key: arg1, value: arg2, ...getErrorAndPipe(arg3, arg4) }
      : { key: string(), value: arg1, ...getErrorAndPipe(arg2, arg3 as any) }
  ) as {
    key: TRecordKey;
    value: TRecordValue;
    error: string | undefined;
    pipe: Pipe<RecordOutput<TRecordKey, TRecordValue>>;
  };

  // Create and return record schema
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
      if (!input || input.constructor !== Object) {
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
      // Note: `Object.entries(...)` converts each key to a string
      for (const inputEntry of Object.entries(input)) {
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

          // Get parse result of key
          const keyResult = key._parse(
            inputKey,
            getPathInfo(info, path, 'key')
          );

          // If there are issues, capture them
          if (keyResult.issues) {
            if (issues) {
              for (const issue of keyResult.issues) {
                issues.push(issue);
              }
            } else {
              issues = keyResult.issues;
            }

            // If necessary, abort early
            if (info?.abortEarly) {
              break;
            }
          }

          // Get parse result of value
          const valueResult = value._parse(inputValue, getPathInfo(info, path));

          // If there are issues, capture them
          if (valueResult.issues) {
            if (issues) {
              for (const issue of valueResult.issues) {
                issues.push(issue);
              }
            } else {
              issues = valueResult.issues;
            }

            // If necessary, abort early
            if (info?.abortEarly) {
              break;
            }
          }

          // Set entry if there are no issues
          if (!keyResult.issues && !valueResult.issues) {
            output[keyResult.output] = valueResult.output;
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipe(
            output as RecordOutput<TRecordKey, TRecordValue>,
            pipe,
            info,
            'record'
          );
    },
  };
}
