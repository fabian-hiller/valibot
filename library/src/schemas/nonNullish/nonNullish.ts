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
  kind: 'non_nullish';
  /**
   * The wrapped schema.
   */
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
    kind: 'non_nullish',
    async: false,
    wrapped,
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
