import { ValiError } from '../../error';
import type { BaseSchema, Pipe } from '../../types';
import { executePipe, getErrorAndPipe } from '../../utils';

/**
 * Special schema type.
 */
export type SpecialSchema<TInput, TOutput = TInput> = BaseSchema<
  TInput,
  TOutput
> & {
  schema: 'special';
};

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  error?: string,
  pipe?: Pipe<TInput>
): SpecialSchema<TInput>;

/**
 * Creates a special schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function special<TInput>(
  check: (input: unknown) => boolean,
  arg2?: Pipe<TInput> | string,
  arg3?: Pipe<TInput>
): SpecialSchema<TInput> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create and return string schema
  return {
    /**
     * The schema type.
     */
    schema: 'special',

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
      if (!check(input)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'special',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input as TInput, pipe, { ...info, reason: 'special' });
    },
  };
}
