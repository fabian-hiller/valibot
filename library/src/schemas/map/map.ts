import type {
  BaseSchema,
  ErrorMessage,
  Output,
  Pipe,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResult,
  schemaIssue,
  schemaResult,
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
  message: ErrorMessage | undefined;
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  message?: ErrorMessage,
  pipe?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue>;

export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  arg3?: Pipe<MapOutput<TKey, TValue>> | ErrorMessage,
  arg4?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg3, arg4);

  // Create and return map schema
  return {
    type: 'map',
    expects: 'Map',
    async: false,
    key,
    value,
    message,
    pipe,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof Map) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: Map<Output<TKey>, Output<TValue>> = new Map();

        // Parse each key and value by schema
        for (const [inputKey, inputValue] of input.entries()) {
          // Create path item variable
          let pathItem: MapPathItem | undefined;

          // Get schema result of key
          const keyResult = this.key._parse(inputKey, config);

          // If there are issues, capture them
          if (keyResult.issues) {
            // Create map path item
            pathItem = {
              type: 'map',
              origin: 'key',
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
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }

          // Get schema result of value
          const valueResult = this.value._parse(inputValue, config);

          // If there are issues, capture them
          if (valueResult.issues) {
            // Create map path item
            pathItem = pathItem ?? {
              type: 'map',
              origin: 'value',
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
            if (config?.abortEarly) {
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

        // If output is typed, return pipe result
        if (typed) {
          return pipeResult(this, output, config, issues);
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, map, input, config);
    },
  };
}
