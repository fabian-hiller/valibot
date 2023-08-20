import type { Issues } from '../../error/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
  getPipeInfo,
} from '../../utils/index.ts';
import type { MapInput, MapOutput } from './types.ts';

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
  error?: string,
  pipe?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue>;

export function mapAsync<
  TMapKey extends BaseSchema | BaseSchemaAsync,
  TMapValue extends BaseSchema | BaseSchemaAsync
>(
  key: TMapKey,
  value: TMapValue,
  arg3?: PipeAsync<MapOutput<TMapKey, TMapValue>> | string,
  arg4?: PipeAsync<MapOutput<TMapKey, TMapValue>>
): MapSchemaAsync<TMapKey, TMapValue> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

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
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'map',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create issues and output
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();
      let issues: Issues | undefined;

      // Parse each key and value by schema
      await Promise.all(
        Array.from(input.entries()).map(async (inputEntry) => {
          // Get input key and value
          const inputKey = inputEntry[0];
          const inputValue = inputEntry[1];

          // Get current path
          const path = getPath(info?.path, {
            schema: 'map',
            input,
            key: inputKey,
            value: inputValue,
          });

          // Get parse result of key and value
          const [keyResult, valueResult] = await Promise.all(
            [
              { schema: key, input: inputKey, origin: 'key' as const },
              { schema: value, input: inputValue },
            ].map(async ({ schema, input, origin }) => {
              // If not aborted early, continue execution
              if (!(info?.abortEarly && issues)) {
                // Get parse result of input
                const result = await schema._parse(
                  input,
                  getPathInfo(info, path, origin)
                );

                // If not aborted early, continue execution
                if (!(info?.abortEarly && issues)) {
                  // If there are issues, capture them
                  if (result.issues) {
                    if (issues) {
                      issues.push(...result.issues);
                    } else {
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
      return issues
        ? { issues }
        : executePipeAsync(output, pipe, getPipeInfo(info, 'map'));
    },
  };
}
