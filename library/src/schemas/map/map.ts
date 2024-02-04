import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Issues,
  Output,
  Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema type.
 */
export type MapSchema<
  TKey extends BaseSchema,
  TValue extends BaseSchema,
  TOutput = MapOutput<TKey, TValue>
> = BaseSchema<MapInput<TKey, TValue>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'map';
  /**
   * The map key schema.
   */
  key: TKey;
  /**
   * The map value schema.
   */
  value: TValue;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<MapOutput<TKey, TValue>> | undefined;
};

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  pipe?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue>;

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue>;

export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  arg3?: Pipe<MapOutput<TKey, TValue>> | ErrorMessageOrMetadata,
  arg4?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg3, arg4);

  // Create and return map schema
  return {
    type: 'map',
    async: false,
    key,
    value,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Map)) {
        return schemaIssue(info, 'type', 'map', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
      let issues: Issues | undefined;
      const output: Map<Output<TKey>, Output<TValue>> = new Map();

      // Parse each key and value by schema
      for (const [inputKey, inputValue] of input.entries()) {
        // Create path item variable
        let pathItem: MapPathItem | undefined;

        // Get parse result of key
        const keyResult = this.key._parse(inputKey, {
          origin: 'key',
          abortEarly: info?.abortEarly,
          abortPipeEarly: info?.abortPipeEarly,
          skipPipe: info?.skipPipe,
        });

        // If there are issues, capture them
        if (keyResult.issues) {
          // Create map path item
          pathItem = {
            type: 'map',
            input,
            key: inputKey,
            value: inputValue,
          };

          // Add modified result issues to issues
          for (const issue of keyResult.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              issue.path = [pathItem];
            }
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
          // Create map path item
          pathItem = pathItem || {
            type: 'map',
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
            typed = false;
            break;
          }
        }

        // If not typed, set typed to false
        if (!keyResult.typed || !valueResult.typed) {
          typed = false;
        }

        // Set output of entry
        output.set(keyResult.output, valueResult.output);
      }

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(output, this.pipe, info, 'map', issues);
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}
