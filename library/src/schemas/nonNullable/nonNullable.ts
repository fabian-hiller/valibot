import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullableInput, NonNullableOutput } from './types.ts';

/**
 * Non nullable schema type.
 */
export interface NonNullableSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullableOutput<TWrapped>,
> extends BaseSchema<NonNullableInput<TWrapped>, TOutput> {
  /**
   * The schema type.
   */
  type: 'non_nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
}

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: ErrorMessage
): NonNullableSchema<TWrapped> {
  return {
    type: 'non_nullable',
    expects: '!null',
    async: false,
    wrapped,
    message,
    _parse(input, config) {
      // In input is `null`, return schema issue
      if (input === null) {
        return schemaIssue(this, nonNullable, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
