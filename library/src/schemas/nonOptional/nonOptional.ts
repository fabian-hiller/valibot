import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrapped extends BaseSchema,
  TOutput = NonOptional<Output<TWrapped>>
> = BaseSchema<NonOptional<Input<TWrapped>>, TOutput> & {
  type: 'non_optional';
  wrapped: TWrapped;
};

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonOptionalSchema<TWrapped> {
  return {
    /**
     * The schema type.
     */
    type: 'non_optional',

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
      // Allow `undefined` values not to pass
      if (input === undefined) {
        return getSchemaIssues(
          info,
          'type',
          'non_optional',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
