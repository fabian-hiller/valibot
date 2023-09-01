import { executePipe, getIssues } from '../../utils/index.ts';
import { getRecordArgs } from './utils/index.ts';
import { BLOCKED_KEYS } from './values.ts';

import type { BaseSchema, FString, Issues, Pipe } from '../../types.ts';
import type { StringSchema } from '../string/index.ts';
import type { RecordOutput, RecordInput, RecordPathItem } from './types.ts';
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
  error?: FString,
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
  error?: FString,
  pipe?: Pipe<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchema<TRecordValue, TRecordKey>;

export function record<
  TRecordKey extends RecordKey,
  TRecordValue extends BaseSchema
>(
  arg1: TRecordValue | TRecordKey,
  arg2?: Pipe<RecordOutput<TRecordKey, TRecordValue>> | FString | TRecordValue,
  arg3?: Pipe<RecordOutput<TRecordKey, TRecordValue>> | FString,
  arg4?: Pipe<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchema<TRecordValue, TRecordKey> {
  // Get key, value, error and pipe argument
  const [key, value, error, pipe] = getRecordArgs<
    TRecordKey,
    TRecordValue,
    Pipe<RecordOutput<TRecordKey, TRecordValue>>
  >(arg1, arg2, arg3, arg4);

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
      if (!input || typeof input !== 'object') {
        return getIssues(
          info,
          'type',
          'record',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: Record<string | number | symbol, any> = {};

      // Parse each key and value by schema
      // Note: `Object.entries(...)` converts each key to a string
      for (const [inputKey, inputValue] of Object.entries(input)) {
        // Exclude blocked keys to prevent prototype pollutions
        if (!BLOCKED_KEYS.includes(inputKey)) {
          // Create path item variable
          let pathItem: RecordPathItem | undefined;

          // Get parse result of key
          const keyResult = key._parse(inputKey, {
            origin: 'key',
            abortEarly: info?.abortEarly,
            abortPipeEarly: info?.abortPipeEarly,
          });

          // If there are issues, capture them
          if (keyResult.issues) {
            // Create record path item
            pathItem = {
              schema: 'record',
              input,
              key: inputKey,
              value: inputValue,
            };

            // Add modified result issues to issues
            for (const issue of keyResult.issues) {
              issue.path = [pathItem];
              issues?.push(issue);
            }
            if (!issues) {
              issues = keyResult.issues;
            }

            // If necessary, abort early
            if (info?.abortEarly) {
              break;
            }
          }

          // Get parse result of value
          const valueResult = value._parse(inputValue, info);

          // If there are issues, capture them
          if (valueResult.issues) {
            // Create record path item
            pathItem = pathItem || {
              schema: 'record',
              input,
              key: inputKey,
              value: inputValue,
            };

            // Add modified result issues to issues
            for (const issue of valueResult.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              issues?.push(issue);
            }
            if (!issues) {
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
