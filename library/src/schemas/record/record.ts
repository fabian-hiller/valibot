import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Issues,
  Pipe,
} from '../../types/index.ts';
import { parseResult, pipeResult, schemaIssue } from '../../utils/index.ts';
import type { EnumSchema } from '../enum/index.ts';
import type { PicklistSchema } from '../picklist/index.ts';
import type { SpecialSchema } from '../special/index.ts';
import type { StringSchema } from '../string/index.ts';
import type { UnionSchema } from '../union/index.ts';
import type { RecordOutput, RecordInput, RecordPathItem } from './types.ts';
import { recordArgs } from './utils/index.ts';
import { BLOCKED_KEYS } from './values.ts';

/**
 * Record key type.
 */
export type RecordKey =
  | EnumSchema<any, string | number | symbol>
  | PicklistSchema<any, string | number | symbol>
  | SpecialSchema<any, string | number | symbol>
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
  /**
   * The schema type.
   */
  type: 'record';
  /**
   * The record key schema.
   */
  key: TKey;
  /**
   * The record value schema.
   */
  value: TValue;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<RecordOutput<TKey, TValue>> | undefined;
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TValue extends BaseSchema>(
  value: TValue,
  messageOrMetadata?: ErrorMessageOrMetadata,
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A record schema.
 */
export function record<TKey extends RecordKey, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<RecordOutput<TKey, TValue>>
): RecordSchema<TKey, TValue>;

export function record<TKey extends RecordKey, TValue extends BaseSchema>(
  arg1: TValue | TKey,
  arg2?: Pipe<RecordOutput<TKey, TValue>> | ErrorMessageOrMetadata | TValue,
  arg3?: Pipe<RecordOutput<TKey, TValue>> | ErrorMessageOrMetadata,
  arg4?: Pipe<RecordOutput<TKey, TValue>>
): RecordSchema<TKey, TValue> {
  // Get key, value, message and pipe argument
  const [key, value, message = 'Invalid type', pipe, metadata] = recordArgs<
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
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return schemaIssue(info, 'type', 'record', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
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
          const keyResult = this.key._parse(inputKey, {
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
              input: input as Record<string | number | symbol, unknown>,
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
              typed = false;
              break;
            }
          }

          // Get parse result of value
          const valueResult = this.value._parse(inputValue, info);

          // If there are issues, capture them
          if (valueResult.issues) {
            // Create record path item
            pathItem = pathItem || {
              type: 'record',
              input: input as Record<string | number | symbol, unknown>,
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
              typed = false;
              break;
            }
          }

          // If not typed, set typed to false
          if (!keyResult.typed || !valueResult.typed) {
            typed = false;
          }

          // If key is typed, set output of entry
          if (keyResult.typed) {
            output[keyResult.output] = valueResult.output;
          }
        }
      }

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(
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
