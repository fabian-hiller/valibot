import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Output,
  PipeAsync,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { MapInput, MapOutput, MapPathItem } from './types.ts';

/**
 * Map schema async type.
 */
export interface MapSchemaAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = MapOutput<TKey, TValue>,
> extends BaseSchemaAsync<MapInput<TKey, TValue>, TOutput> {
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
  pipe: PipeAsync<MapOutput<TKey, TValue>> | undefined;
}

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
  TValue extends BaseSchema | BaseSchemaAsync,
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async map schema.
 */
export function mapAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
>(
  key: TKey,
  value: TValue,
  message?: ErrorMessage,
  pipe?: PipeAsync<MapOutput<TKey, TValue>>
): MapSchemaAsync<TKey, TValue>;

export function mapAsync<
  TKey extends BaseSchema | BaseSchemaAsync,
  TValue extends BaseSchema | BaseSchemaAsync,
>(
  key: TKey,
  value: TValue,
  arg3?: PipeAsync<MapOutput<TKey, TValue>> | ErrorMessage,
  arg4?: PipeAsync<MapOutput<TKey, TValue>>
): MapSchemaAsync<TKey, TValue> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg3, arg4);

  // Create and return async map schema
  return {
    type: 'map',
    expects: 'Map',
    async: true,
    key,
    value,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof Map) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: Map<Output<TKey>, Output<TValue>> = new Map();

        // Parse each key and value by schema
        await Promise.all(
          Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
            // Create path item variable
            let pathItem: MapPathItem | undefined;

            // Get schema result of key and value
            const [keyResult, valueResult] = await Promise.all(
              (
                [
                  { schema: this.key, value: inputKey, origin: 'key' },
                  { schema: this.value, value: inputValue, origin: 'value' },
                ] as const
              ).map(async ({ schema, value, origin }) => {
                // If not aborted early, continue execution
                if (!(config?.abortEarly && issues)) {
                  // Get schema result of value
                  const result = await schema._parse(value, config);

                  // If not aborted early, continue execution
                  if (!(config?.abortEarly && issues)) {
                    // If there are issues, capture them
                    if (result.issues) {
                      // Create map path item
                      pathItem = pathItem ?? {
                        type: 'map',
                        origin,
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
                      if (config?.abortEarly) {
                        throw null;
                      }
                    }

                    // Return schema result
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

        // If output is typed, return pipe result
        if (typed) {
          return pipeResultAsync(this, output, config, issues);
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, mapAsync, input, config);
    },
  };
}
