import { mixinsOf } from '../../registry/registry.ts';
import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

type SchemaValidators<TRegistry, TThis> = {
  [K in keyof TRegistry]: (
    ...args: Parameters<Extract<TRegistry[K], (...args: any) => any>>
  ) => TThis;
};

/**
 * String schema type.
 */
export interface StringSchema<TOutput = string>
  extends BaseSchema<string, TOutput>,
    SchemaValidators<StringRegistry, StringSchema<TOutput>> {
  schema: 'string';
}

/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(pipe?: Pipe<string>): StringSchema;

/**
 * Creates a string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(error?: ErrorMessage, pipe?: Pipe<string>): StringSchema;

export function string(
  arg1?: ErrorMessage | Pipe<string>,
  arg2?: Pipe<string>
): StringSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return string schema
  return {
    /**
     * The schema type.
     */
    schema: 'string',

    _pipe: pipe,

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
      if (typeof input !== 'string') {
        return getSchemaIssues(
          info,
          'type',
          'string',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, this._pipe, info, 'string');
    },
    ...(mixinsOf('string') as SchemaValidators<
      StringRegistry,
      StringSchema<string>
    >),
  };
}
