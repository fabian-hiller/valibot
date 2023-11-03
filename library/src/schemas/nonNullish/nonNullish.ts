import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullish type.
 */
export type NonNullish<T> = T extends null | undefined ? never : T;

/**
 * Non nullish schema type.
 */
export type NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullish<Output<TWrapped>>
> = BaseSchema<NonNullish<Input<TWrapped>>, TOutput> & {
  type: 'non_nullish';
  wrapped: TWrapped;
};

/**
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullishSchema<TWrapped> {
  return {
    /**
     * The schema type.
     */
    type: 'non_nullish',

    /**
     * The wrapped schema.
     */
    wrapped,

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
      // Allow `null` and `undefined` values not to pass
      if (input === null || input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullish',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
