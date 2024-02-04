import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Issues,
  Output,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema async type.
 */
export type MapSchemaAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TKey, TValue>
> = BaseSchemaAsync<MapInput<TKey, TValue>, TOutput> & {
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
  pipe: PipeAsync<MapOutput<TKey, TValue>> | undefined;
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
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  key: TKey,
  value: TValue,
  pipe?: PipeAsync<MapOutput<TKey, TValue>>
): MapSchemaAsync<TKey, TValue>;

/**
 * Creates an async map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  key: TKey,
  value: TValue,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<MapOutput<TKey, TValue>>
): MapSchemaAsync<TKey, TValue>;

export function mapAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync
>(
  key: TKey,
  value: TValue,
  arg3?: PipeAsync<MapOutput<TKey, TValue>> | ErrorMessageOrMetadata,
  arg4?: PipeAsync<MapOutput<TKey, TValue>>
): MapSchemaAsync<TKey, TValue> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg3, arg4);

  // Create and return async map schema
  return {
    type: 'map',
    async: true,
    key,
    value,
    message,
    pipe,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Map)) {
        return schemaIssue(info, 'type', 'map', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
      let issues: Issues | undefined;
      const output: Map<Output<TKey>, Output<TValue>> = new Map();

      // Parse each key and value by schema
      await Promise.all(
        Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
          // Create path item variable
          let pathItem: MapPathItem | undefined;

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
                    // Create map path item
                    pathItem = pathItem || {
                      type: 'map',
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

          // Set output of entry
          if (keyResult && valueResult) {
            output.set(keyResult.output, valueResult.output);
          }
        })
      );

      // If output is typed, execute pipe
      if (typed) {
        return pipeResultAsync(output, this.pipe, info, 'map', issues);
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}
