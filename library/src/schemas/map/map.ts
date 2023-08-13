import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, Output, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getIssue,
  getPath,
  getPathInfo,
  getPipeInfo,
} from '../../utils/index.ts';
import type { MapInput, MapOutput } from './types.ts';

/**
 * Map schema type.
 */
export type MapSchema<
  TMapKey extends BaseSchema,
  TMapValue extends BaseSchema,
  TOutput = MapOutput<TMapKey, TMapValue>
> = BaseSchema<MapInput<TMapKey, TMapValue>, TOutput> & {
  schema: 'map';
  map: { key: TMapKey; value: TMapValue };
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
export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  pipe?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue>;

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
export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  error?: string,
  pipe?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue>;

export function map<TMapKey extends BaseSchema, TMapValue extends BaseSchema>(
  key: TMapKey,
  value: TMapValue,
  arg3?: Pipe<MapOutput<TMapKey, TMapValue>> | string,
  arg4?: Pipe<MapOutput<TMapKey, TMapValue>>
): MapSchema<TMapKey, TMapValue> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg3, arg4);

  // Create and return map schema
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      // Check type of input
      if (!(input instanceof Map)) {
        throw new ValiError([
          getIssue(info, {
            reason: 'type',
            validation: 'map',
            message: error || 'Invalid type',
            input,
          }),
        ]);
      }

      // Create output and issues
      const output: Map<Output<TMapKey>, Output<TMapValue>> = new Map();
      const issues: Issue[] = [];

      // Parse each key and value by schema
      for (const inputEntry of input.entries()) {
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

        // Parse key and get output
        let outputKey: [any] | undefined;
        try {
          // Note: Output key is nested in array, so that also a falsy value
          // further down can be recognized as valid value
          outputKey = [key.parse(inputKey, getPathInfo(info, path, 'key'))];

          // Throw or fill issues in case of an error
        } catch (error) {
          if (info?.abortEarly) {
            throw error;
          }
          issues.push(...(error as ValiError).issues);
        }

        // Parse value and get output
        let outputValue: [any] | undefined;
        try {
          // Note: Output value is nested in array, so that also a falsy value
          // further down can be recognized as valid value
          outputValue = [value.parse(inputValue, getPathInfo(info, path))];

          // Throw or fill issues in case of an error
        } catch (error) {
          if (info?.abortEarly) {
            throw error;
          }
          issues.push(...(error as ValiError).issues);
        }

        // Set entry if output key and value is valid
        if (outputKey && outputValue) {
          output.set(outputKey[0], outputValue[0]);
        }
      }

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipe(output, pipe, getPipeInfo(info, 'map'));
    },
  };
}
