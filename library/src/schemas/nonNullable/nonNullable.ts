import type { BaseSchema, ErrorMessage, Input, Output } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullable<Output<TWrapped>>
> = BaseSchema<NonNullable<Input<TWrapped>>, TOutput> & {
  kind: 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
};

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  error?: ErrorMessage
): NonNullableSchema<TWrapped> {
  return {
    kind: 'non_nullable',
    async: false,
    wrapped,
    _parse(input, info) {
      // Allow `null` values not to pass
      if (input === null) {
        return getSchemaIssues(
          info,
          'type',
          'non_nullable',
          error || 'Invalid type',
          input
        );
      }

      // Return result of wrapped schema
      return wrapped._parse(input, info);
    },
  };
}
