import type {
  BaseSchema,
  ErrorMessage,
  Issues,
  Output,
  Pipe,
} from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
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
  type: 'map';
  key: TKey;
  value: TValue;
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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A map schema.
 */
export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  error?: ErrorMessage,
  pipe?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue>;

export function map<TKey extends BaseSchema, TValue extends BaseSchema>(
  key: TKey,
  value: TValue,
  arg3?: Pipe<MapOutput<TKey, TValue>> | ErrorMessage,
  arg4?: Pipe<MapOutput<TKey, TValue>>
): MapSchema<TKey, TValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return map schema
  return {
    /**
     * The schema type.
     */
    type: 'map',

    /**
     * The key schema.
     */
    key,

    /**
     * The value schema.
     */
    value,

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
      if (!(input instanceof Map)) {
        return getSchemaIssues(
          info,
          'type',
          'map',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: Map<Output<TKey>, Output<TValue>> = new Map();

      // Parse each key and value by schema
      for (const [inputKey, inputValue] of input.entries()) {
        // Create path item variable
        let pathItem: MapPathItem | undefined;

        // Get parse result of key
        const keyResult = key._parse(inputKey, {
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
            break;
          }
        }

        // Get parse result of value
        const valueResult = value._parse(inputValue, info);

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
            break;
          }
        }

        // Set entry if there are no issues
        if (!keyResult.issues && !valueResult.issues) {
          output.set(keyResult.output, valueResult.output);
        }
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(output, pipe, info, 'map');
    },
  };
}
