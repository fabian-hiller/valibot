import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import {
  executePipeAsync,
  getChecks,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { EnumSchema, EnumSchemaAsync } from '../enumType/index.ts';
import type {
  NativeEnumSchema,
  NativeEnumSchemaAsync,
} from '../nativeEnum/index.ts';
import type { StringSchema, StringSchemaAsync } from '../string/index.ts';
import type { UnionSchema, UnionSchemaAsync } from '../union/index.ts';
import type { RecordInput, RecordOutput, RecordPathItem } from './types.ts';
import { getRecordArgs } from './utils/index.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key type.
 */
export type RecordKeyAsync =
  | EnumSchema<any, string | number | symbol>
  | EnumSchemaAsync<any, string | number | symbol>
  | NativeEnumSchema<any, string | number | symbol>
  | NativeEnumSchemaAsync<any, string | number | symbol>
  | StringSchema<string | number | symbol>
  | StringSchemaAsync<string | number | symbol>
  | UnionSchema<any, string | number | symbol>
  | UnionSchemaAsync<any, string | number | symbol>;

/**
 * Record schema async type.
 */
export type RecordSchemaAsync<
  TRecordKey extends RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync,
  TOutput = RecordOutput<TRecordKey, TRecordValue>
> = BaseSchemaAsync<RecordInput<TRecordKey, TRecordValue>, TOutput> & {
  kind: 'record';
  /**
   * The record key and value schema.
   */
  record: { key: TRecordKey; value: TRecordValue };
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
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
): RecordSchemaAsync<StringSchema, TRecordValue>;

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
  error?: ErrorMessage,
  pipe?: PipeAsync<RecordOutput<StringSchema, TRecordValue>>
): RecordSchemaAsync<StringSchema, TRecordValue>;

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
): RecordSchemaAsync<TRecordKey, TRecordValue>;

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
  error?: ErrorMessage,
  pipe?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchemaAsync<TRecordKey, TRecordValue>;

export function recordAsync<
  TRecordKey extends RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
>(
  arg1: TRecordValue | TRecordKey,
  arg2?:
    | PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
    | ErrorMessage
    | TRecordValue,
  arg3?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>> | ErrorMessage,
  arg4?: PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
): RecordSchemaAsync<TRecordKey, TRecordValue> {
  // Get key, value, error and pipe argument
  const [key, value, error, pipe] = getRecordArgs<
    TRecordKey,
    TRecordValue,
    PipeAsync<RecordOutput<TRecordKey, TRecordValue>>
  >(arg1, arg2, arg3, arg4);

  // Create and return async record schema
  return {
    kind: 'record',
    async: true,
    record: { key, value },
    checks: getChecks(pipe),
    async _parse(input, info) {
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
      await Promise.all(
        // Note: `Object.entries(...)` converts each key to a string
        Object.entries(input).map(async ([inputKey, inputValue]) => {
          // Exclude blocked keys to prevent prototype pollutions
          if (!BLOCKED_KEYS.includes(inputKey)) {
            // Create path item variable
            let pathItem: RecordPathItem | undefined;

            // Get parse result of key and value
            const [keyResult, valueResult] = await Promise.all(
              (
                [
                  { schema: key, value: inputKey, origin: 'key' },
                  { schema: value, value: inputValue, origin: 'value' },
                ] as const
              ).map(async ({ schema, value, origin }) => {
                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // Get parse result of value
                  const result = await schema._parse(value, {
                    origin,
                    abortEarly: info?.abortEarly,
                    abortPipeEarly: info?.abortPipeEarly,
                    skipPipe: info?.skipPipe,
                  });

                  // If not aborted early, continue execution
                  if (!(info?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      // Create record path item
                      pathItem = pathItem || {
                        schema: 'record',
                        input,
                        key: inputKey,
                        value: inputValue,
                      };

                      // Add modified result issues to issues
                      for (const issue of result.issues) {
                        if (issue.path) {
                          issue.path.unshift(pathItem);
                        } else {
                          issue.path = [pathItem];
                        }
                        issues?.push(issue);
                      }
                      if (!issues) {
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
        ? getIssues(issues)
        : executePipeAsync(
            output as RecordOutput<TRecordKey, TRecordValue>,
            pipe,
            info,
            'record'
          );
    },
  };
}
