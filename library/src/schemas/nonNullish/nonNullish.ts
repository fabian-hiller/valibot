import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue } from '../../utils/index.ts';
import type { NonNullishInput, NonNullishOutput } from './types.ts';

/**
 * Non nullish schema type.
 */
export interface NonNullishSchema<
  TWrapped extends BaseSchema,
  TOutput = NonNullishOutput<TWrapped>,
> extends BaseSchema<NonNullishInput<TWrapped>, TOutput> {
  /**
   * The schema type.
   */
  type: 'non_nullish';
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
 * Creates a non nullish schema.
 *
 * @param wrapped The wrapped schema.
 * @param message The error message.
 *
 * @returns A non nullish schema.
 */
export function nonNullish<TWrapped extends BaseSchema>(
  wrapped: TWrapped,
  message?: ErrorMessage
): NonNullishSchema<TWrapped> {
  return {
    type: 'non_nullish',
    expects: '!null & !undefined',
    async: false,
    wrapped,
    message,
    _parse(input, config) {
      // In input is `null` or `undefined`, return schema issue
      if (input === null || input === undefined) {
        return schemaIssue(this, nonNullish, input, config);
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}
