import {
  executePipeAsync,
  getDefaultArgs,
  getIssues,
} from '../../utils/index.ts';

import type {
  BaseSchema,
  BaseSchemaAsync,
  FString,
  Issues,
  Output,
  PipeAsync,
} from '../../types.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema async type.
 */
export type MapSchemaAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TMapKey, TMapValue>
> = BaseSchemaAsync<MapInput<TMapKey, TMapValue>, TOutput> & {
  schema: 'map';
  map: { key: TMapKey; value: TMapValue };
};

/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  pipe?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue>;

/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  error?: FString,
  pipe?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue>;

export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  arg3?: PipeAsync<MapOutput<TMapKey, TMapValue>> | FString,
  arg4?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return async map schema
  return {
    /**
     * The schema type.
     */
    schema: 'map',

    /**
     * The map key and value schema.
     */
    map: { key, value },

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
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Map)) {
        return getIssues(info, 'type', 'map', error || 'Invalid type', input);
      }

      // Create issues and output
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();
      let issues: Issues | undefined;

      // Parse each key and value by schema
      await Promise.all(
        Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
          // Create path item variable
          let pathItem: MapPathItem | undefined;

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
                });

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    // Create map path item
                    pathItem = pathItem || {
                      schema: 'map',
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
            output.set(keyResult.output, valueResult.output);
          }
        })
      );

      // Return issues or pipe result
      return issues ? { issues } : executePipeAsync(input, pipe, info, 'map');
    },
  };
}
