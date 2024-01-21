import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types/index.ts';
import {
  parseResult,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { EnumSchema, EnumSchemaAsync } from '../enum/index.ts';
import type { PicklistSchema, PicklistSchemaAsync } from '../picklist/index.ts';
import type { SpecialSchema, SpecialSchemaAsync } from '../special/index.ts';
import type { StringSchema, StringSchemaAsync } from '../string/index.ts';
import type { UnionSchema, UnionSchemaAsync } from '../union/index.ts';
import type { RecordInput, RecordOutput, RecordPathItem } from './types.ts';
import { recordArgs } from './utils/index.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key async type.
 */
export type RecordKeyAsync =
  | EnumSchema<any, string | number | symbol>
  | EnumSchemaAsync<any, string | number | symbol>
  | PicklistSchema<any, string | number | symbol>
  | PicklistSchemaAsync<any, string | number | symbol>
  | SpecialSchema<any, string | number | symbol>
  | SpecialSchemaAsync<any, string | number | symbol>
  | StringSchema<string | number | symbol>
  | StringSchemaAsync<string | number | symbol>
  | UnionSchema<any, string | number | symbol>
  | UnionSchemaAsync<any, string | number | symbol>;

/**
 * Record schema async type.
 */
export interface RecordSchemaAsync<
  TKey extends RecordKeyAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = RecordOutput<TKey, TValue>
> extends BaseSchemaAsync<RecordInput<TKey, TValue>, TOutput> {
  /**
   * The schema type.
   */
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
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<RecordOutput<TKey, TValue>> | undefined;
}

/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  pipe?: PipeAsync<RecordOutput<StringSchema, TValue>>
): RecordSchemaAsync<StringSchema, TValue>;

/**
 * Creates an async record schema.
 *
 * @param value The value schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  message?: ErrorMessage,
  pipe?: PipeAsync<RecordOutput<StringSchema, TValue>>
): RecordSchemaAsync<StringSchema, TValue>;

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
  TKey extends RecordKeyAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  key: TKey,
  value: TValue,
  pipe?: PipeAsync<RecordOutput<TKey, TValue>>
): RecordSchemaAsync<TKey, TValue>;

/**
 * Creates an async record schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async record schema.
 */
export function recordAsync<
  TKey extends RecordKeyAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  key: TKey,
  value: TValue,
  message?: ErrorMessage,
  pipe?: PipeAsync<RecordOutput<TKey, TValue>>
): RecordSchemaAsync<TKey, TValue>;

export function recordAsync<
  TKey extends RecordKeyAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  arg1: TValue | TKey,
  arg2?: PipeAsync<RecordOutput<TKey, TValue>> | ErrorMessage | TValue,
  arg3?: PipeAsync<RecordOutput<TKey, TValue>> | ErrorMessage,
  arg4?: PipeAsync<RecordOutput<TKey, TValue>>
): RecordSchemaAsync<TKey, TValue> {
  // Get key, value, message and pipe argument
  const [key, value, message = 'Invalid type', pipe] = recordArgs<
    TKey,
    TValue,
    PipeAsync<RecordOutput<TKey, TValue>>
  >(arg1, arg2, arg3, arg4);

  // Create and return async record schema
  return {
    type: 'record',
    async: true,
    key,
    value,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return schemaIssue(info, 'type', 'record', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
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
                  { schema: this.key, value: inputKey, origin: 'key' },
                  { schema: this.value, value: inputValue, origin: 'value' },
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
                        type: 'record',
                        input: input as Record<
                          string | number | symbol,
                          unknown
                        >,
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
                    }

                    // Return parse result
                    return result;
                  }
                }
              })
            ).catch(() => []);

            // If not typed, set typed to false
            if (!keyResult?.typed || !valueResult?.typed) {
              typed = false;
            }

            // If key is typed, set output of entry
            if (keyResult?.typed && valueResult) {
              output[keyResult.output] = valueResult.output;
            }
          }
        })
      );

      // If output is typed, execute pipe
      if (typed) {
        return pipeResultAsync(
          output as RecordOutput<TKey, TValue>,
          this.pipe,
          info,
          'record',
          issues
        );
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}
