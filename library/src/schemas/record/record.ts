import type { BaseSchema, ErrorMessage, Issues, Pipe } from '../../types.ts';
import { executePipe, getIssues, getSchemaIssues } from '../../utils/index.ts';
import type { EnumSchema } from '../enum/index.ts';
import type { PicklistSchema } from '../picklist/index.ts';
import type { StringSchema } from '../string/index.ts';
import type { UnionSchema } from '../union/index.ts';
import type { RecordOutput, RecordInput, RecordPathItem } from './types.ts';
import { getRecordArgs } from './utils/index.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key type.
 */
export type RecordKey =
  | EnumSchema<any, string | number | symbol>
  | PicklistSchema<any, string | number | symbol>
  | StringSchema<string | number | symbol>
  | UnionSchema<any, string | number | symbol>;

/**
 * Record schema type.
 */
export type RecordSchema<
  TKey extends RecordKey,
  TValue extends BaseSchema,
  TOutput = RecordOutput<TKey, TValue>
> = BaseSchema<RecordInput<TKey, TValue>, TOutput> & {
  type: 'record';
  /**
   * The key schema.
   */
  key: TKey;
  /**
   * The value schema.
   */
  value: TValue;
  /**
   * Validation and transformation pipe.
   */
  pipe?: Pipe<RecordOutput<TKey, TValue>>;
};

/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TValue extends BaseSchema>(
  value: TValue,
  pipe?: Pipe<RecordOutput<StringSchema, TValue>>
): RecordSchema<StringSchema, TValue>;

/**
 * Creates a record schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TValue extends BaseSchema>(
  value: TValue,
  error?: ErrorMessage,
  pipe?: Pipe<RecordOutput<StringSchema, TValue>>
): RecordSchema<StringSchema, TValue>;

/**
 * Creates a record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TKey extends RecordKey, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  pipe?: Pipe<RecordOutput<TKey, TValue>>
): RecordSchema<TKey, TValue>;

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
export function record<TKey extends RecordKey, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  error?: ErrorMessage,
  pipe?: Pipe<RecordOutput<TKey, TValue>>
): RecordSchema<TKey, TValue>;

export function record<TKey extends RecordKey, TValue extends BaseSchema>(
  arg1: TValue | TKey,
  arg2?: Pipe<RecordOutput<TKey, TValue>> | ErrorMessage | TValue,
  arg3?: Pipe<RecordOutput<TKey, TValue>> | ErrorMessage,
  arg4?: Pipe<RecordOutput<TKey, TValue>>
): RecordSchema<TKey, TValue> {
  // Get key, value, error and pipe argument
  const [key, value, error, pipe] = getRecordArgs<
    TKey,
    TValue,
    Pipe<RecordOutput<TKey, TValue>>
  >(arg1, arg2, arg3, arg4);

  // Create and return record schema
  return {
    type: 'record',
    async: false,
    key,
    value,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return getSchemaIssues(
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
            skipPipe: info?.skipPipe,
          });

          // If there are issues, capture them
          if (keyResult.issues) {
            // Create record path item
            pathItem = {
              type: 'record',
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
              type: 'record',
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
        ? getIssues(issues)
        : executePipe(
            output as RecordOutput<TKey, TValue>,
            pipe,
            info,
            'record'
          );
    },
  };
}
