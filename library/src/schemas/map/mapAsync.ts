import { i18next } from '../../i18n.ts';
import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Output,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getCurrentPath,
  getErrorAndPipe,
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
    async parse(input, info) {
      // Check type of input
      if (!(input instanceof Map)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'map',
            origin: 'value',
            message: error || i18next.t("schemas.mapAsync"),
            input,
            ...info,
          },
        ]);
      }

      // Create output and issues
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();
      const issues: Issue[] = [];

      // Parse each key and value by schema
      await Promise.all(
        Array.from(input.entries()).map(async ([inputKey, inputValue]) => {
          // Get current path
          const path = getCurrentPath(info, {
            schema: 'map',
            input,
            key: inputKey,
            value: inputValue,
          });

          const [outputKey, outputValue] = await Promise.all([
            // Parse key and get output
            (async () => {
              try {
                // Note: Output key is nested in array, so that also a falsy value
                // further down can be recognized as valid value
                return [
                  await key.parse(inputKey, { ...info, origin: 'key', path }),
                ] as const;

                // Throw or fill issues in case of an error
              } catch (error) {
                if (info?.abortEarly) {
                  throw error;
                }
                issues.push(...(error as ValiError).issues);
              }
            })(),

            // Parse value and get output
            (async () => {
              try {
                // Note: Output value is nested in array, so that also a falsy value
                // further down can be recognized as valid value
                return [
                  await value.parse(inputValue, { ...info, path }),
                ] as const;

                // Throw or fill issues in case of an error
              } catch (error) {
                if (info?.abortEarly) {
                  throw error;
                }
                issues.push(...(error as ValiError).issues);
              }
            })(),
          ]);

          // Set entry if output key and value is valid
          if (outputKey && outputValue) {
            output.set(outputKey[0], outputValue[0]);
          }
        })
      );

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipeAsync(output, pipe, { ...info, reason: 'map' });
    },
  };
}
